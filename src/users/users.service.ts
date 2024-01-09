import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/createUser.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
  ) {}

  async createUser(dto: CreateUserDto): Promise<User> {
    const user = this.usersRepository.create(dto);

    return await this.usersRepository.save(user);
  }

  async findByEmail(email: string): Promise<User[]> {
    const queryBuilder = this.usersRepository.createQueryBuilder('users');

    queryBuilder.where('users.email = :email', { email });

    return await queryBuilder.getMany();
  }

  async findOneByEmail(
    email: string,
    isWithPassword: boolean = false,
  ): Promise<User> {
    const queryBuilder = this.usersRepository.createQueryBuilder('users');

    queryBuilder.where('users.email = :email', { email });

    if (isWithPassword) {
      queryBuilder.addSelect('users.password');
    }

    return await queryBuilder.getOne();
  }

  async findOneById(id: string): Promise<User> {
    const queryBuilder = this.usersRepository.createQueryBuilder('users');

    queryBuilder.where('users.id = :id', { id });

    return await queryBuilder.getOne();
  }
}
