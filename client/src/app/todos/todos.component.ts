import { Component, OnInit } from '@angular/core';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

import { TodosService } from './todos.service';
import { Todo } from './utils/types';

@Component({
  selector: 'todos',
  templateUrl: './todos.component.html',
  styleUrls: ['./todos.component.scss'],
})
export class TodosComponent implements OnInit {
  todos: Todo[] = [];

  constructor(protected todosService: TodosService) {}

  ngOnInit(): void {}

  addTodo(event: KeyboardEvent): void {
    if (
      event.target instanceof HTMLInputElement &&
      event.key === 'Enter' &&
      event.target.value.trim() !== ''
    ) {
      this.todosService.addTodo(event.target.value.trim());
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

  toggleCompleted(todo: Todo, completed: boolean): void {
    this.todosService.toggleCompleted(todo, completed);
  }

  drop({ previousIndex, currentIndex }: CdkDragDrop<string[]>) {
    moveItemInArray(this.todos, previousIndex, currentIndex);
  }
}
