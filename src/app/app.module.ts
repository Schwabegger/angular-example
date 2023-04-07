import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http'; // Import HttpClientModule

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TodoListComponent } from './todo-list/todo-list.component';
import { EditTodoComponent } from './edit-todo/edit-todo.component';
import { FormsModule } from '@angular/forms'; // Import the FormsModule

@NgModule({
  declarations: [
    AppComponent,
    TodoListComponent,
    EditTodoComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule, // Add FormsModule to the imports array
    HttpClientModule // Add HttpClientModule to imports
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }