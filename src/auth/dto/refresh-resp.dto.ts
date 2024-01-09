import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../users/user.entity';

export class RefreshRespDto {
  @ApiProperty({ example: '_userTokenHere_' })
  authToken: string;

  @ApiProperty({ example: '_userTokenHere_' })
  refreshToken: string;

  @ApiProperty({ type: User })
  user: User;
}
