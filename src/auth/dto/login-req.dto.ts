import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class LoginReqDto {
  @ApiProperty({ example: 'example@example.com', required: true })
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'YourStr0NgPassw0rd123!', required: true })
  @IsNotEmpty()
  password: string;

  @ApiProperty({ example: true, required: false })
  isRememberMe: boolean;
}
