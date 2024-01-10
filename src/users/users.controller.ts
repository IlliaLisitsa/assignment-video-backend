import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  Request,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { GetMoviesRespDto } from './dto/getMovies-resp.dto';
import { MoviesService } from '../movies/movies.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateMovieReqDto } from './dto/createMovie-req.dto';
import { UsersService } from './users.service';
import { extname } from 'path';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { CreateMovieRespDto } from './dto/createMovie-resp.dto';
import { ConfigService } from '@nestjs/config';
import { UpdateMovieRespDto } from './dto/updateMovie-resp.dto';
import { UpdateMovieReqDto } from './dto/updateMovie-req.dto';
import { DeleteMovieRespDto } from './dto/deleteMovie-resp.dto';
import { GetMovieByIdRespDto } from './dto/getMovieById-resp.dto';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly moviesService: MoviesService,
    private configService: ConfigService,
  ) {}

  @ApiResponse({ status: 200, type: GetMoviesRespDto })
  @HttpCode(200)
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('movies')
  async getAllUsersMovies(
    @Request() req,
    @Query('skipPages') skipPages: number,
    @Query('pageSize') pageSize: number,
  ): Promise<GetMoviesRespDto> {
    const { movies, totalCount } =
      await this.moviesService.getMoviesByUserIdWithTotal(
        req.user.id,
        skipPages,
        pageSize,
      );

    return { movies, totalCount };
  }

  @ApiResponse({ status: 200, type: GetMovieByIdRespDto })
  @HttpCode(200)
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('movies/:movieId')
  async getMovieById(
    @Param('movieId') movieId: number,
  ): Promise<GetMovieByIdRespDto> {
    const movie = await this.moviesService.getMovieById(movieId);

    return { movie };
  }

  @ApiResponse({ status: 200, type: CreateMovieRespDto })
  @HttpCode(200)
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './client',
        filename: (req, file, cb) => {
          const randomName = `${new Date().getTime()}-${Math.round(
            Math.random() * 10000,
          ).toString(5)}`;

          cb(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
      limits: { fileSize: 1000000 },
    }),
  )
  @Post('movies')
  async createMovie(
    @UploadedFile()
    file: Express.Multer.File,
    @Request() req,
    @Body() createMovieDto: CreateMovieReqDto,
  ): Promise<CreateMovieRespDto> {
    if (!file) {
      throw new BadRequestException('File required');
    }

    const allowedTypes = ['.png', '.jpeg', '.jpg'];

    if (!allowedTypes.includes(extname(file.originalname).toLowerCase())) {
      throw new BadRequestException('Invalid file type');
    }

    if (file.size > 1000000) {
      throw new BadRequestException('File size exceeds limit');
    }

    const user = await this.usersService.findOneById(req.user.id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const ROOT_URL = this.configService.get('ROOT_URL');

    const posterUrl = `${ROOT_URL}/${file.filename}`;

    const movie = await this.moviesService.createMovie(
      user,
      createMovieDto,
      posterUrl,
    );

    delete movie.user;

    return { movie };
  }

  @ApiResponse({ status: 200, type: UpdateMovieRespDto })
  @HttpCode(200)
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './client',
        filename: (req, file, cb) => {
          const randomName = `${new Date().getTime()}-${Math.round(
            Math.random() * 10000,
          ).toString(5)}`;

          cb(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
      limits: { fileSize: 1000000 },
    }),
  )
  @Patch('movies/:movieId')
  async updateMovie(
    @UploadedFile()
    file: Express.Multer.File,
    @Param('movieId') movieId: number,
    @Request() req,
    @Body() createMovieDto: UpdateMovieReqDto,
  ): Promise<UpdateMovieRespDto> {
    if (file) {
      const allowedTypes = ['.png', '.jpeg', '.jpg'];

      if (!allowedTypes.includes(extname(file.originalname).toLowerCase())) {
        throw new BadRequestException('Invalid file type');
      }

      if (file.size > 1000000) {
        throw new BadRequestException('File size exceeds limit');
      }
    }

    const user = await this.usersService.findOneById(req.user.id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const ROOT_URL = this.configService.get('ROOT_URL');

    const posterUrl = file ? `${ROOT_URL}/${file.filename}` : undefined;

    const movie = await this.moviesService.updateMovie(
      movieId,
      user,
      createMovieDto,
      posterUrl,
    );

    return { movie };
  }

  @ApiResponse({ status: 200, type: DeleteMovieRespDto })
  @HttpCode(200)
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete('movies/:movieId')
  async deleteMovie(
    @Param('movieId') movieId: number,
    @Request() req,
  ): Promise<DeleteMovieRespDto> {
    const user = await this.usersService.findOneById(req.user.id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    await this.moviesService.removeMovie(movieId, user);

    return { success: true };
  }
}
