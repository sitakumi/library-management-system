import { IsString, IsInt, IsUUID, Min, MinLength, IsNotEmpty } from 'class-validator';

export class CreateBookDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  title: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  author: string;

  @IsString()
  @IsNotEmpty()
  isbn: string;

  @IsInt()
  @Min(0)
  totalCopies: number;

  @IsUUID()
  genreId: string;
}