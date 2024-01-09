import { ApiProperty } from '@nestjs/swagger';

export class LoginReqDto {
  @ApiProperty({ example: 'example@example.com', required: true })
  email: string;

  @ApiProperty({ example: 'YourStr0NgPassw0rd123!', required: true })
  password: string;

  @ApiProperty({ example: true, required: false })
  isRememberMe: boolean;
}
