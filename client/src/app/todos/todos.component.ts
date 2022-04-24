import { Component, OnInit } from '@angular/core';
import { CdkDragDrop } from '@angular/cdk/drag-drop';

import { TodosService } from './todos.service';
import { SettingsService } from '../settings/settings.service';
import { Todo } from './utils/types';

@Component({
  selector: 'todos',
  templateUrl: './todos.component.html',
  styleUrls: ['./todos.component.scss'],
})
export class TodosComponent implements OnInit {
  todos: Todo[] = this.todosService.getTodos();

  constructor(
    protected todosService: TodosService,
    protected settingsService: SettingsService
  ) {}

  ngOnInit(): void {
    this.settingsService.isUserLogged$.subscribe((isLogged) => {
      if ('boolean' !== typeof isLogged) {
        return;
      }

      if (isLogged) {
        this.todosService.syncTodos(true);
      } else {
        this.todosService.removeAndSyncLocally();
      }
    });
  }

  async addTodo(event: KeyboardEvent): Promise<void> {
    if (
      event.target instanceof HTMLInputElement &&
      event.key === 'Enter' &&
      event.target.value.trim() !== ''
    ) {
      await this.todosService.addTodo(event.target.value.trim());
      event.target.value = '';
    }
  }

  toggleEdit(todo: Todo): void {
    todo.editing = !todo.editing;
  }

  editTodo(todo: Todo, event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      todo.editing = false;
      // this.todosService.editTodo(todo);
    }
  }

  clearCompleted(): void {
    this.todosService.clearCompleted();
  }

  toggleCompleted(todo: Todo, completed: boolean): void {
    this.todosService.toggleCompleted(todo, completed);
  }

  drop({ previousIndex, currentIndex }: CdkDragDrop<string[]>) {
    this.todosService.reorderTodos(previousIndex, currentIndex);
  }

  get hasDoneTodos(): boolean {
    return this.todos.some((todo) => todo.completed);
  }
}
