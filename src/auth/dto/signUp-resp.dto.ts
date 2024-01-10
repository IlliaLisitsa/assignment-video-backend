import { ApiProperty } from '@nestjs/swagger';

export class SignUpRespDto {
  @ApiProperty({ example: true })
  success: boolean;
}
