import { ApiProperty } from '@nestjs/swagger';
import { Movie } from '../../movies/movie.entity';

export class GetMoviesRespDto {
  @ApiProperty({
    type: [Movie],
    example: [
      {
        id: 1,
        title: 'Inception',
        publishingYear: 2010,
        poster: 'inception.jpg',
      },
    ],
  })
  movies: Movie[];

  @ApiProperty({ example: 23 })
  totalCount: number;
}
