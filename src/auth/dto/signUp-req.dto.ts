import { ApiProperty } from '@nestjs/swagger';

export class SignUpReqDto {
  @ApiProperty({ example: 'Mr.', required: true })
  firstName: string;

  @ApiProperty({ example: 'Heisenberg', required: true })
  lastName: string;

  @ApiProperty({ example: 'example@example.com', required: true })
  email: string;

  @ApiProperty({ example: 'YourStr0NgPassw0rd123!', required: true })
  password: string;
}
