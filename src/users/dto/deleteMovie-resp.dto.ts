import { ApiProperty } from '@nestjs/swagger';

export class DeleteMovieRespDto {
  @ApiProperty({ example: true })
  success: boolean;
}
