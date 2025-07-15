import { Injectable, signal, computed } from '@angular/core';
import { User } from '../entities/user.entity';

@Injectable({ providedIn: 'root' })
export class UserStateService {
    readonly user = signal<User | null>(null);

    readonly user$ = this.user.asReadonly();
    readonly userName = computed(() => this.user()?.name ?? '');
    readonly userEmail = computed(() => this.user()?.email ?? '');
    readonly iconUrl = computed(() => this.user()?.iconUrl ?? null);
    readonly userInitial = computed(() => this.user()?.name?.charAt(0).toUpperCase() ?? 'U');

    setUser(user: User): void {
        this.user.set(user);
    }

    updateIconUrl(url: string | null): void {
        const current = this.user();
        if (!current) return;

        this.user.set(current.withIconUrl(url));
    }

    updateUserName(newName: string): void {
        const current = this.user();
        if (!current) return;

        this.user.set(current.withName(newName));
    }
}