import { ApiProperty } from '@nestjs/swagger';

export class RefreshReqDto {
  @ApiProperty({ example: '_userTokenHere_' })
  refreshToken: string;
}
