import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import PocketBase from 'pocketbase';

export interface ITodo {
  id: string;
  title: string;
  tasks: {
    id: string;
    name: string;
    completed: boolean;
  }[];
}

export class Todo {
  constructor(id: string, title: string, tasks: { id: string, name: string, completed: boolean }[]) {
    this.id = id;
    this.title = title;
    this.tasks = tasks;
  }
  id: string;
  title: string;
  tasks: {
    id: string;
    name: string;
    completed: boolean;
  }[];
}

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.less']
})

export class TodoListComponent implements OnInit {
  constructor(private http: HttpClient, private router: Router) { }
  todos: any[] = [];
  pb = new PocketBase('https://to-dos.pockethost.io');
  page = 1;
  showConfirmation = false;
  selectedTodoId = '';

  async previousPage() {
    if (this.page > 1) {
      this.page--;
      await this.fetchTodos(this.page * 10 - 9, this.page * 10);
    }
    else {
      console.log('Already on first page');
    }
  }

  async nextPage() {
    try {
      this.page++;
      await this.fetchTodos(this.page * 10 - 9, this.page * 10);
    } catch (e) {
      this.page--;
      console.log('No more records');
    }
  }

  async ngOnInit() {
    // this.pb.collection('todos').subscribe('*', function (e) {
    //   console.log(e.record);
    // });

    // const allRecords = await this.pb.collection('todos').getFullList({
    //   sort: '-created',
    //   expand: 'tasks',
    // });
    // console.log('Fetched all records');
    // this.todos = structuredClone(allRecords);

    await this.fetchTodos(1, 10);

    // this.http.get<Todo[]>('https://to-dos.pockethost.io/api/collections/todos/records').subscribe(
    //   response => {
    //     this.todos = response;
    //   },
    //   error => {
    //     console.log('Error retrieving todos:', error);
    //   }
    // );
  }

  async fetchTodos(start: number, end: number) {
    const records = await this.pb.collection('todos').getList(start, end, {
      sort: '-created',
      expand: 'tasks',
    });
    console.log('Fetched records from', start, 'to', end);
    this.todos = structuredClone(records.items);
  }

  confirmDelete(todoId:string) {
    this.showConfirmation = true;
    this.selectedTodoId = todoId;
  }

  async delete() {
    this.showConfirmation = false;
    await this.deleteTodoAsync(this.selectedTodoId);
  }

  async cancelDelete() {
    this.showConfirmation = false;
  }

  async deleteTodoAsync(id: string): Promise<void> {
    await this.pb.collection('todos').delete(id).then(() => {
      console.log('Deleted todo with ID:', id);
      this.todos = this.todos.filter(todo => todo.id !== id);
    });
  }
}