import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Movie } from './movie.entity';
import { CreateMovieReqDto } from '../users/dto/createMovie-req.dto';
import { User } from '../users/user.entity';
import { join } from 'path';
import { FilesService } from '../files/files.service';
import { UpdateMovieReqDto } from '../users/dto/updateMovie-req.dto';

@Injectable()
export class MoviesService {
  constructor(
    @InjectRepository(Movie) private moviesRepository: Repository<Movie>,
    private readonly filesService: FilesService,
  ) {}

  async createMovie(
    user: User,
    createMovieDto: CreateMovieReqDto,
    posterUrl: string,
  ): Promise<Movie> {
    const movie = this.moviesRepository.create({
      title: createMovieDto.title,
      poster: posterUrl,
      publishingYear: createMovieDto.publishingYear,
      user,
    });

    return await this.moviesRepository.save(movie);
  }

  async updateMovie(
    movieId: number,
    user: User,
    updateMovieDto: UpdateMovieReqDto,
    posterUrl?: string,
  ): Promise<Movie> {
    const movie = await this.removePosterFile(movieId, user.id, posterUrl);

    movie.poster = posterUrl || movie.poster;
    movie.title = updateMovieDto.title || movie.title;
    movie.publishingYear =
      updateMovieDto.publishingYear || movie.publishingYear;

    return await this.moviesRepository.save(movie);
  }

  async removeMovie(movieId: number, user: User): Promise<void> {
    const movie = await this.removePosterFile(movieId, user.id);

    await this.moviesRepository.delete(movie.id);
  }

  async getMoviesByUserIdWithTotal(
    userId: string,
    skipPages: number,
    pageSize: number,
  ): Promise<{ movies: Movie[]; totalCount: number }> {
    const [movies, totalCount] = await this.moviesRepository
      .createQueryBuilder('movie')
      .leftJoin('movie.user', 'user')
      .where('user.id = :userId', { userId })
      .skip(skipPages * pageSize)
      .take(pageSize)
      .getManyAndCount();

    return { movies, totalCount };
  }

  getMoviesByUserId(userId: string): Promise<Movie[]> {
    return this.moviesRepository
      .createQueryBuilder('movie')
      .leftJoin('movie.user', 'user')
      .where('user.id = :userId', { userId })
      .getMany();
  }

  async removePosterFile(
    movieId: number,
    userId: number,
    posterUrl?: string,
  ): Promise<Movie> {
    const existingMovie = await this.getMovieById(movieId, userId);

    if (!existingMovie) {
      if (posterUrl) {
        this.filesService.removeFileFromFS(posterUrl);
      }

      throw new NotFoundException(`Movie with ID ${movieId} not found`);
    }

    const poster = existingMovie.poster;

    if (poster) {
      const fileName = new URL(poster).pathname.replace('/', '');
      const filePath = join(__dirname, '..', '..', 'client', fileName);

      if (posterUrl) {
        this.filesService.removeFileFromFS(filePath);
      }
    }

    delete existingMovie.user;

    return existingMovie;
  }

  async getMovieById(id: number, userId?: number): Promise<Movie> {
    const query = this.moviesRepository
      .createQueryBuilder('movie')
      .where('movie.id = :id', { id });

    if (userId) {
      query
        .leftJoinAndSelect('movie.user', 'user')
        .andWhere('user.id = :userId', { userId });
    }

    return await query.getOne();
  }
}
