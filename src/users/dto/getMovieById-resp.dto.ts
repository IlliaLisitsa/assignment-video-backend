import { ApiProperty } from '@nestjs/swagger';
import { Movie } from '../../movies/movie.entity';

export class GetMovieByIdRespDto {
  @ApiProperty({ type: Movie })
  movie: Movie;
}
