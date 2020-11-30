import { ActorDetail, FilmCredits, FilmCreditsDto } from './actor-detail';

export type FilmDetailDto = {
  readonly adult: boolean;
  readonly budget: number;
  readonly genres: Array<{ id: number; name: string }>;
  readonly title: string;
  readonly poster_path: string;
  readonly id: number;
  readonly release_date: Date;
  readonly runtime: number;
  readonly overview: string;
  readonly vote_average: number;
  readonly vote_count: number;
  readonly actors: Array<ActorDetail>;
};

export class FilmDetail {
  private constructor(
    readonly adult: boolean,
    readonly budget: number,
    readonly genres: Array<string>,
    readonly title: string,
    readonly posterPath: string,
    readonly id: number,
    readonly releaseDate: Date,
    readonly runtime: number,
    readonly overview: string,
    readonly voteAverage: number,
    readonly voteCount: number,
    readonly actors: Array<ActorDetail>
  ) {}

  static fromDto([dto, creditsDto]: [FilmDetailDto, FilmCreditsDto]): FilmDetail {
    const filmCredits = FilmCredits.fromDto(creditsDto);

    return new FilmDetail(
      dto.adult,
      dto.budget,
      dto.genres.map((genre) => genre.name),
      dto.title,
      dto.poster_path,
      dto.id,
      new Date(dto.release_date),
      dto.runtime,
      dto.overview,
      dto.vote_average,
      dto.vote_count,
      filmCredits.cast
    );
  }
}
