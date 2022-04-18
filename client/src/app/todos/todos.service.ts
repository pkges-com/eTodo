import { Injectable } from '@angular/core';
import { Md5 } from 'ts-md5';
import { Todo } from './utils/types';
import { UtilsService } from '../core/utils.service';
import { EncryptionService } from '../core/utils/encryption.service';
import { SettingsService } from '../settings/settings.service';
import { Settings } from '../settings/utils/types';
import { debounce, Subject, timer } from 'rxjs';
import { StorageService } from '../core/utils/storage.service';

@Injectable()
export class TodosService {
  private todos: Todo[] = JSON.parse(localStorage.getItem('todos') || '[]');
  private syncTodos$: Subject<void> = new Subject<void>();
  private backgroundSync = true;

  constructor(
    private utilsService: UtilsService,
    private encryptionService: EncryptionService,
    private storageService: StorageService,
    private settingsService: SettingsService
  ) {
    this.syncTodos$
      .pipe(debounce(() => timer(this.backgroundSync ? 10 * 60000 : 5000))) // 10 minutes on background, 5 seconds on action
      .subscribe(() => {
        this.syncTodos();
      });
  }

  getTodos(): Todo[] {
    return this.todos;
  }

  async addTodo(title: Todo['title']): Promise<void> {
    const newTodo = {
      id: this.utilsService.generateUUID(),
      title,
      completed: false,
    };

    this.todos.push(newTodo);
    this.backgroundSync = false;
    this.syncTodos$.next();
  }

  toggleCompleted(todo: Todo, completed: boolean): void {
    todo.completed = completed;
    this.backgroundSync = false;
    this.syncTodos$.next();
  }

  reorderTodos(previousIndex: number, currentIndex: number): void {
    const itemToMove = this.todos.splice(previousIndex, 1)[0];
    this.todos.splice(currentIndex, 0, itemToMove);
    this.backgroundSync = false;
    this.syncTodos$.next();
  }

  async syncTodos(): Promise<void> {
    if (false === this.settings.loggedIn) {
      return;
    }

    const userId = this.settings.user?.id as string;
    const todoPath = `/todos/${userId}`;
    const stringifiedTodos = JSON.stringify(this.todos);
    const todosHash = Md5.hashStr(stringifiedTodos);
    let existingTodos: Todo[] = [];
    this.saveTodosLocally();

    try {
      // Try to prevent a redundant update
      const { hash: existingHash } =
        ((await this.storageService.getMetadata(todoPath)) as any)
          .customMetadata ?? {};

      console.log(`Existing hash: ${existingHash}, new hash: ${todosHash}`);
      if (existingHash === todosHash) {
        return;
      }

      const fetchedTodos = await this.storageService.getRaw(todoPath);
      const decryptedTodos = this.encryptionService.decrypt(fetchedTodos);

      if (decryptedTodos) {
        existingTodos = JSON.parse(decryptedTodos);
      } else {
        // Encrypted with different key, ask for the right one
        await this.settingsService.syncSettingsFromDb();

        return this.syncTodos$.next(); // Try again
      }
    } catch {
      // File Doesn't exist
    }

    const uniqueTodos = new Map();
    [...this.todos, ...existingTodos].forEach((todo, index) => {
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
    const newHash = Md5.hashStr(JSON.stringify(this.todos));
    let encryptedTodos = this.encryptionService.encrypt(
      JSON.stringify(this.todos)
    );

    await this.storageService.uploadRaw(todoPath, encryptedTodos, {
      hash: newHash,
    });

    this.backgroundSync = true;
  }

  saveTodosLocally(): void {
    localStorage.setItem('todos', JSON.stringify(this.todos));
  }

  get settings(): Settings {
    return this.settingsService.getSettings();
  }
}
