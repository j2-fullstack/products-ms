import { Type } from 'class-transformer';
import { IsPositive, IsOptional } from 'class-validator';

export class PaginationDto {
  @IsPositive()
  @IsOptional()
  //Transformamos el tipo de dato a Number porque en la req viene como string x-form-urlencoded;
  @Type(() => Number)
  page?: number = 1; //Valor por defecto
  @IsPositive()
  @IsOptional()
  //Transformamos el tipo de dato a Number porque en la req viene como string x-form-urlencoded;
  @Type(() => Number)
  limit?: number = 10; //Valor por defecto
}
