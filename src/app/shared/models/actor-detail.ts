export type FilmCreditsDto = {
  readonly cast: Array<ActorDetailDto>;
};

export class FilmCredits {
  private constructor(readonly cast: Array<ActorDetail>) {}

  static fromDto(dto: FilmCreditsDto): FilmCredits {
    return new FilmCredits(dto.cast.map(ActorDetail.fromDto));
  }
}

export type ActorDetailDto = {
  readonly character: string;
  readonly name: string;
  readonly order: number;
  readonly profile_path: string;
};

export class ActorDetail {
  private constructor(
    readonly character: string,
    readonly name: string,
    readonly order: number,
    readonly profilePath: string
  ) {}

  static fromDto(dto: ActorDetailDto): ActorDetail {
    return new ActorDetail(dto.character, dto.name, dto.order, dto.profile_path);
  }
}
