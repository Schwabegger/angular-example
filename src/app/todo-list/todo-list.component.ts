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
  styleUrls: ['./todo-list.component.css']
})

export class TodoListComponent implements OnInit {
  todos: any[] = [];
  pb = new PocketBase('https://to-dos.pockethost.io');

  constructor(private http: HttpClient, private router: Router) { }

  deleteTodo(id: string) {
    this.deleteTodoAsync(id).then(() => {
      this.todos = this.todos.filter(todo => todo.id !== id);
    });
  }

  async deleteTodoAsync(id: string): Promise<void> {
    await this.pb.collection('todos').delete(id);
  }

  async ngOnInit() {
    // this.pb.collection('todos').subscribe('*', function (e) {
    //   console.log(e.record);
    // });

    const records = await this.pb.collection('todos').getList(1, 50, {
      sort: '-created',
      expand: 'tasks',
    });
    this.todos = structuredClone(records.items);

    // this.http.get<Todo[]>('https://to-dos.pockethost.io/api/collections/todos/records').subscribe(
    //   response => {
    //     this.todos = response;
    //   },
    //   error => {
    //     console.log('Error retrieving todos:', error);
    //   }
    // );
  }

  edit(id: string) {
    console.log('edit', id);
    this.router.navigate(['/edit', id]);
  }
}