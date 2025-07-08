import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { NoteService } from '../../core/services/note.service';
import { NoteStateService } from '../../core/services/note-state.service';
import { firstValueFrom } from 'rxjs';

export const NoteAccessGuard: CanActivateFn = async (route) => {
  const router = inject(Router);
  const noteService = inject(NoteService);
  const noteStateService = inject(NoteStateService);

  const noteId = route.paramMap.get('id');
  if (!noteId) {
    await router.navigateByUrl('/');
    return false;
  }

  try {
    const noteData = await firstValueFrom(noteService.getNoteById(noteId));

    console.log('[Guard] Nota recebida:', noteData);

    if (noteData?.isDeleted) {
      console.warn('[Guard] Nota está deletada, redirecionando...');
      await router.navigateByUrl('/');
      return false;
    }

    noteStateService.setNote(noteService.createNoteEntity(noteData));
    return true;
  } catch (error) {
    console.error('[Guard] Erro ao carregar nota:', error);
    await router.navigateByUrl('/');
    return false;
  }
};