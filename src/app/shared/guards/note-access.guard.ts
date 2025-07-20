import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';

import { NoteService } from '../../core/services/note.service';
import { NoteStateService } from '../../core/services/note-state.service';

/**
 * NoteAccessGuard protege a rota de acesso à nota.
 * Redireciona caso a nota não exista ou esteja deletada.
 */
export const NoteAccessGuard: CanActivateFn = async (route) => {
  // ==============================
  // Injeções de dependência
  // ==============================

  const router = inject(Router);
  const noteService = inject(NoteService);
  const noteStateService = inject(NoteStateService);

  // ==============================
  // Recupera ID da nota da URL
  // ==============================

  const noteId = route.paramMap.get('id');
  if (!noteId) {
    await router.navigateByUrl('/');
    return false;
  }

  // ==============================
  // Tenta carregar a nota
  // ==============================

  try {
    const noteData = await firstValueFrom(noteService.getNoteById(noteId));

    // Verifica se está deletada
    if (noteData?.isDeleted) {
      await router.navigateByUrl('/');
      return false;
    }

    // Armazena no estado global
    noteStateService.setNote(noteService.createNoteEntity(noteData));
    return true;
  } catch {
    await router.navigateByUrl('/');
    return false;
  }
};