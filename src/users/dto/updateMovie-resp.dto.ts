import { ApiProperty } from '@nestjs/swagger';
import { Movie } from '../../movies/movie.entity';

export class UpdateMovieRespDto {
  @ApiProperty({ type: Movie })
  movie: Movie;
}
