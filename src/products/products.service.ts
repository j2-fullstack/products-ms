import {
  HttpStatus,
  Injectable,
  Logger,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaClient } from '@prisma/client';
import { PaginationDto } from 'src/common';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class ProductsService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger('ProductServices');
  onModuleInit() {
    //throw new Error('Method not implemented.');
    this.$connect();
    //console.log('Database connected.');
    this.logger.log('Database Connected');
  }
  create(createProductDto: CreateProductDto) {
    //return 'This action adds a new product';
    //Modelo de prisma client

    try {
      return this.product.create({ data: createProductDto });
    } catch (error) {
      throw new RpcException({
        message: error,
        status: HttpStatus.BAD_REQUEST,
      });
    }
  }

  async findAll(paginationDto: PaginationDto) {
    //return `This action returns all products`;
    //console.log(paginationDto);
    const { page, limit } = paginationDto;
    const totalProducts = await this.product.count({
      where: { available: true },
    });
    const totalPages = Math.ceil(totalProducts / limit); //Redondeamos al siguiente numero positivo

    return {
      data: await this.product.findMany({
        where: { available: true },
        skip: (page - 1) * limit, //las paginas en las base de datos son en base 0 y page tiene el valor de la 1ra pagina o sea 1 por eso hay que restar
        take: limit,
      }),
      meta: {
        total: totalProducts,
        currentPage: page,
        lastPage: totalPages,
      },
    };
  }

  async findOne(id: number) {
    //return `This action returns a #${id} product`;
    const product = await this.product.findUnique({
      where: { id: id, available: true },
    });
    if (!product) {
      //throw new NotFoundException(`Product with id ${id} not found`);
      //throw new RpcException(`Product with id ${id} not found`);
      throw new RpcException({
        message: `Product with id ${id} not found`,
        status: HttpStatus.BAD_REQUEST,
      });
    }
    return product;
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    //return `This action updates a #${id} product`;
    await this.findOne(id); // si no lo encuentra se va por la excepcion del metodo
    //Para no enviar el id en el update y solo enviamos el rest que esta en la variable data
    const { id: __id, ...data } = updateProductDto;
    return this.product.update({ where: { id: id }, data: data });
  }

  async remove(id: number) {
    //return `This action removes a #${id} product`;
    await this.findOne(id); //SI el producto no se encuentra se lanza la excepcion
    //Hard delete
    //return this.product.delete({ where: { id: id } });
    // Soft delete
    return this.product.update({
      where: { id: id },
      data: { available: false },
    });
  }
}
