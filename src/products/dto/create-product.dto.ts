import { Type } from 'class-transformer';
import { IsString, Min, IsNumber } from 'class-validator';

export class CreateProductDto {
  @IsString()
  public name: string;

  @IsNumber({
    maxDecimalPlaces: 4,
  })
  @Min(0)
  //Transformamos el tipo de dato a Number porque en la req viene como string x-form-urlencoded;
  @Type(() => Number)
  public price: number;
}
