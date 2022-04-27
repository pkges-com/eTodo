import { Component } from '@angular/core';
import { environment } from 'src/environments/environment';
import { SettingsService } from './settings/settings.service';
import { TodosService } from './todos/todos.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  version = environment.appVersion;

  constructor(
    private settingsService: SettingsService,
    private todoService: TodosService
  ) {}

  get isLoggedIn(): boolean {
    return this.settingsService.getSettings().loggedIn;
  }

  get lastSync(): Date | null {
    return this.todoService.lastSync;
  }
}
