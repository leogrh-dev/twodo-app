import { Injectable, signal, computed } from '@angular/core';
import { User } from '../entities/user.entity';

@Injectable({ providedIn: 'root' })
export class UserStateService {

    // ======================
    // Estado interno
    // ======================
    private readonly _user = signal<User | null>(null);

    // ======================
    // Sinais públicos (read-only)
    // ======================
    readonly user$ = this._user.asReadonly();

    // ======================
    // Getters computados
    // ======================
    readonly name = computed(() => this._user()?.name ?? '');
    readonly email = computed(() => this._user()?.email ?? '');
    readonly iconUrl = computed(() => this._user()?.iconUrl ?? null);
    readonly initial = computed(() => this._user()?.name?.charAt(0).toUpperCase() ?? 'U');

    // ======================
    // Métodos públicos
    // ======================

    /** Define o usuário autenticado atual */
    setUser(user: User): void {
        this._user.set(user);
    }

    /** Limpa completamente o estado do usuário */
    clearUser(): void {
        this._user.set(null);
    }

    /** Atualiza apenas o ícone de perfil do usuário */
    updateIconUrl(url: string | null): void {
        const current = this._user();
        if (!current) return;

        this._user.set(current.withIconUrl(url));
    }

    /** Atualiza apenas o nome do usuário */
    updateUserName(newName: string): void {
        const current = this._user();
        if (!current) return;

        this._user.set(current.withName(newName));
    }
}