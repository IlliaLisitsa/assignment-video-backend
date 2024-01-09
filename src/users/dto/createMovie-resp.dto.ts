import { ApiProperty } from '@nestjs/swagger';
import { Movie } from '../../movies/movie.entity';

export class CreateMovieRespDto {
  @ApiProperty({ type: Movie })
  movie: Movie;
}
