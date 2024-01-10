import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'Mr.', required: true })
  firstName: string;

  @ApiProperty({ example: 'Heisenberg', required: true })
  lastName: string;

  @ApiProperty({ example: 'userEmail@example.com', required: true })
  email: string;

  @ApiProperty({ example: 'YourStr0NgPassw0rd123!', required: true })
  password: string;
}
