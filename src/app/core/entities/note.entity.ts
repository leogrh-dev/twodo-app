// note.entity.ts

export class Note {
  constructor(
    public readonly id: string,
    public title: string,
    public content: string,
    public ownerId: string,
    public bannerUrl: string | null = null,
    public createdAt: Date = new Date(),
    public updatedAt: Date = new Date(),
    public isDeleted: boolean = false,
    public isFavorite: boolean = false,
    public iconUrl: string | null = null
  ) { }

  static create(params: {
    id: string;
    title: string;
    content: string;
    ownerId: string;
    bannerUrl?: string | null;
    createdAt?: Date;
    updatedAt?: Date;
    isDeleted?: boolean;
    isFavorite?: boolean;
    iconUrl?: string | null;
  }): Note {
    return new Note(
      params.id,
      params.title,
      params.content,
      params.ownerId,
      params.bannerUrl ?? null,
      params.createdAt ?? new Date(),
      params.updatedAt ?? new Date(),
      params.isDeleted ?? false,
      params.isFavorite ?? false,
      params.iconUrl ?? null
    );
  }

  updateTitle(newTitle: string): void {
    this.title = newTitle.trim();
    this.touchUpdatedAt();
  }

  updateContent(newContent: string): void {
    this.content = newContent;
    this.touchUpdatedAt();
  }

  updateBanner(newBannerUrl: string | null): void {
    this.bannerUrl = newBannerUrl;
    this.touchUpdatedAt();
  }

  clearBanner(): void {
    this.updateBanner(null);
  }

  private touchUpdatedAt(): void {
    this.updatedAt = new Date();
  }
}