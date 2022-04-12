import { Injectable } from '@angular/core';
import { Todo } from './utils/types';
import { UtilsService } from '../core/utils.service';
import { EncryptionService } from '../core/utils/encryption.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { SettingsService } from '../settings/settings.service';
import { Settings } from '../settings/utils/types';

@Injectable()
export class TodosService {
  private todos: Todo[] = [];

  constructor(
    private utilsService: UtilsService,
    private encryptionService: EncryptionService,
    private firestore: AngularFirestore,
    private settingsService: SettingsService
  ) {}

  getTodos(): Todo[] {
    // @ts-ignore
    this.todos = Array.from({ length: 2 }, (v, k) => k).map((_, i) => ({
      id: this.utilsService.generateUUID(),
      title: `Todo ${i + 1}`,
      completed: false,
    }));

    return this.todos;
  }

  async addTodo(title: Todo['title']): Promise<void> {
    const newTodo = {
      id: this.utilsService.generateUUID(),
      title,
      completed: false,
    };

    this.todos.push(newTodo);

    if (this.settings.loggedIn) {
      await this.firestore.firestore.app
        .firestore()
        .collection('todos')
        .add({
          id: newTodo.id,
          title: this.encryptionService.encrypt(newTodo.title),
          userId: this.settings.user?.id,
          createdAt: new Date(),
        });
    }
  }

  toggleCompleted(todo: Todo, completed: boolean): void {
    todo.completed = completed;
  }

  get settings(): Settings {
    return this.settingsService.getSettings();
  }
}
