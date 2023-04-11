import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EditTodoComponent } from './edit-todo/edit-todo.component';
import { TodoListComponent } from './todo-list/todo-list.component';
import { CreateTodoComponent } from './create-todo/create-todo.component';

const routes: Routes = [
  { path: '', component: TodoListComponent },
  { path: 'todos', component: TodoListComponent },
  { path: 'todos/:id/edit', component: EditTodoComponent },
  { path: 'todos/create', component: CreateTodoComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
