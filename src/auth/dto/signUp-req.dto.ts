import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class SignUpReqDto {
  @ApiProperty({ example: 'Mr.', required: true })
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({ example: 'Heisenberg', required: true })
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({ example: 'example@example.com', required: true })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'YourStr0NgPassw0rd123!', required: true })
  @IsNotEmpty()
  password: string;
}
