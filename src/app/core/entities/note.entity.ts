export class Note {
  constructor(
    public readonly id: string,
    public title: string,
    public content: string,
    public ownerId: string,
    public bannerUrl: string | null = null,
    public createdAt: Date = new Date(),
    public updatedAt: Date = new Date(),
  ) { }

  updateTitle(newTitle: string): void {
    this.title = newTitle.trim();
    this.updatedAt = new Date();
  }

  updateContent(newContent: string): void {
    this.content = newContent;
    this.updatedAt = new Date();
  }

  updateBanner(newBannerUrl: string | null): void {
    this.bannerUrl = newBannerUrl;
    this.updatedAt = new Date();
  }

  clearBanner(): void {
    this.updateBanner(null);
  }
}