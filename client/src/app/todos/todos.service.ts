import { Injectable } from '@angular/core';
import { debounce, Subject, timer } from 'rxjs';
import { NzI18nService } from 'ng-zorro-antd/i18n';
import { NzModalService } from 'ng-zorro-antd/modal';
import { Md5 } from 'ts-md5';

import { Todo } from './utils/types';
import { UtilsService } from '../core/utils.service';
import { EncryptionService } from '../core/utils/encryption.service';
import { SettingsService } from '../settings/settings.service';
import { Settings } from '../settings/utils/types';
import { StorageService } from '../core/utils/storage.service';

@Injectable()
export class TodosService {
  private todos: Todo[] = JSON.parse(localStorage.getItem('todos') || '[]');
  private syncTodos$: Subject<void> = new Subject<void>();
  private backgroundSync = true;
  lastSync: Date | null = null;

  constructor(
    private utilsService: UtilsService,
    private encryptionService: EncryptionService,
    private storageService: StorageService,
    private settingsService: SettingsService,
    private translationService: NzI18nService,
    private modal: NzModalService
  ) {
    this.syncTodos$
      .pipe(debounce(() => timer(this.backgroundSync ? 10 * 60000 : 5000))) // 10 minutes on background, 5 seconds on action
      .subscribe(() => {
        this.syncTodos(this.backgroundSync);
      });
  }

  getTodos(): Todo[] {
    return this.todos;
  }

  async addTodo(title: Todo['title']): Promise<void> {
    const newTodo = {
      id: this.utilsService.generateUUID(),
      title,
      synced: false,
      completed: false,
    };

    this.todos.push(newTodo);
    this.backgroundSync = false;
    this.syncTodos$.next();
  }

  clearCompleted(): void {
    const cleanedTodos = this.todos.filter((todo) => !todo.completed);
    this.todos.splice(0, this.todos.length, ...cleanedTodos);
    this.backgroundSync = false;
    this.syncTodos$.next();
  }

  toggleCompleted(
    fromIndex: number,
    toIndex: number,
    completed: boolean
  ): void {
    for (let i = fromIndex; i <= toIndex; i++) {
      this.todos[i].completed = completed;
    }
    this.backgroundSync = false;
    this.syncTodos$.next();
  }

  reorderTodos(previousIndex: number, currentIndex: number): void {
    const itemToMove = this.todos.splice(previousIndex, 1)[0];
    this.todos.splice(currentIndex, 0, itemToMove);
    this.backgroundSync = false;
    this.syncTodos$.next();
  }

  async syncTodos(pull = false, isInitial = false): Promise<void> {
    this.lastSync = null;
    this.saveTodosLocally();

    if (false === this.settings.loggedIn) {
      return;
    }

    await new Promise<void>((resolve) => {
      this.settingsService.settingsReady$.subscribe({
        next: (isReady) => {
          if (isReady) {
            resolve();
          }
        },
      });
    });

    const userId = this.settings.user?.id as string;
    const todoPath = `/todos/${userId}`;
    const stringifiedTodos = JSON.stringify(this.todos);
    const todosHash = Md5.hashStr(stringifiedTodos);
    let fetchedTodos: string = '';
    let decryptedTodos: string = '';
    let existingTodos: Todo[] = [];

    try {
      // Try to prevent a redundant update
      const { hash: existingHash } =
        ((await this.storageService.getMetadata(todoPath)) as any)
          .customMetadata ?? {};

      if (existingHash === todosHash) {
        this.lastSync = new Date();
        return;
      }

      fetchedTodos = await this.storageService.getRaw(todoPath);
    } catch {
      // Didn't found previously synced todos
    }

    try {
      if (fetchedTodos.length) {
        decryptedTodos = this.encryptionService.decrypt(fetchedTodos);
        existingTodos = JSON.parse(decryptedTodos);
      }
    } catch {
      if (false === isInitial) {
        // Only if that's not the first sync
        this.modal.warning({
          nzTitle: this.translationService.translate('Todos.refresh_title'),
          nzContent: this.translationService.translate(
            'Todos.refresh_description'
          ),
          nzMaskClosable: false,
          nzCancelDisabled: true,
          nzClosable: false,
          nzKeyboard: false,
          nzOnOk: () => {
            window.location.reload();
          },
        });

        await new Promise(() => {}); // Wait for modal forever until a refresh
      }
    }

    if (false === pull) {
      existingTodos = []; // we will override the saved existing
    }

    const unSyncedTodos = this.todos.filter((todo) => !todo.synced);
    const uniqueTodos = new Map();
    const todosToSync = pull
      ? [...existingTodos, ...unSyncedTodos]
      : [...this.todos, ...existingTodos];
    todosToSync.forEach((todo, index) => {
      if (!uniqueTodos.has(todo.id)) {
        uniqueTodos.set(todo.id, todo);
      }
    });

    this.todos.splice(
      0,
      this.todos.length,
      ...Array.from(uniqueTodos.values())
    );
    this.saveTodosLocally();
    todosToSync.forEach((todo) => {
      todo.synced = true;
    });
    const newHash = Md5.hashStr(JSON.stringify(this.todos));
    let encryptedTodos = this.encryptionService.encrypt(
      JSON.stringify(this.todos)
    );

    await this.storageService.uploadRaw(todoPath, encryptedTodos, {
      hash: newHash,
    });

    this.lastSync = new Date();
    this.backgroundSync = true;
    this.syncTodos$.next();
  }

  removeAndSyncLocally() {
    this.todos.splice(0, this.todos.length);
    this.saveTodosLocally();
  }

  saveTodosLocally(): void {
    localStorage.setItem('todos', JSON.stringify(this.todos));
  }

  get settings(): Settings {
    return this.settingsService.getSettings();
  }

  destroy(): void {
    this.syncTodos$.unsubscribe();
  }
}
