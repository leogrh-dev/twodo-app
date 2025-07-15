export class User {
    constructor(
        public readonly id: string,
        public readonly name: string,
        public readonly email: string,
        public readonly phone: string,
        public readonly emailVerified: boolean = false,
        public readonly iconUrl: string | null = null,
    ) { }

    get initial(): string {
        return this.name?.charAt(0)?.toUpperCase() ?? 'U';
    }

    withIconUrl(newIconUrl: string | null): User {
        return new User(
            this.id,
            this.name,
            this.email,
            this.phone,
            this.emailVerified,
            newIconUrl,
        );
    }

    withName(newName: string): User {
        return new User(
            this.id,
            newName,
            this.email,
            this.phone,
            this.emailVerified,
            this.iconUrl,
        );
    }
}