import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class RefreshReqDto {
  @ApiProperty({ example: '_userTokenHere_' })
  @IsNotEmpty()
  refreshToken: string;
}
