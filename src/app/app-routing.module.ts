import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EditTodoComponent } from './edit-todo/edit-todo.component';
import { TodoListComponent } from './todo-list/todo-list.component';

const routes: Routes = [
  { path: 'todos', component: TodoListComponent },
  { path: 'todos/:id/edit', component: EditTodoComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
