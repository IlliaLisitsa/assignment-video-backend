import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, Max, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateMovieReqDto {
  @ApiProperty({ type: 'string', format: 'binary' })
  file: any;

  @ApiProperty({ example: 'Star wars' })
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 1977 })
  @Type(() => Number)
  @IsNotEmpty()
  @IsInt()
  @Min(1900)
  @Max(new Date().getFullYear())
  publishingYear: number;
}
