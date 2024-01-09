import { Module } from '@nestjs/common';
import { MoviesService } from './movies.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Movie } from './movie.entity';
import { User } from '../users/user.entity';
import { FilesModule } from '../files/files.module';

@Module({
  providers: [MoviesService],
  imports: [TypeOrmModule.forFeature([Movie, User]), FilesModule],
  exports: [MoviesService],
})
export class MoviesModule {}
