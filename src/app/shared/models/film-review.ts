export type FilmReviewsResultDto = {
  readonly results: Array<FilmReviewDto>;
};

export type FilmReviewDto = {
  readonly author: string;
  readonly content: string;
  readonly created_at: Date;
  readonly updated_at: Date;
  readonly author_details: { readonly avatar_path: string };
};

export class FilmReview {
  private constructor(
    readonly author: string,
    readonly content: string,
    readonly createdAt: Date,
    readonly updatedAt: Date,
    readonly authorAvatarPath: string
  ) {}

  static fromDto(dto: FilmReviewDto): FilmReview {
    return new FilmReview(
      dto.author,
      dto.content,
      new Date(dto.created_at),
      new Date(dto.updated_at),
      dto.author_details.avatar_path
    );
  }
}
