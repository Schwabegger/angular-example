import { Component, OnInit } from '@angular/core';

interface Task {
  name: string;
  completed: boolean;
}

interface Todo {
  title: string;
  tasks: Task[];
}

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.css']
})
export class TodoListComponent implements OnInit {

  todos: Todo[] = [
    {
      title: 'Grocery Shopping',
      tasks: [
        { name: 'Buy milk', completed: false },
        { name: 'Buy bread', completed: true },
        { name: 'Buy eggs', completed: false }
      ]
    },
    {
      title: 'House Cleaning',
      tasks: [
        { name: 'Clean bathroom', completed: true },
        { name: 'Vacuum living room', completed: true },
        { name: 'Wash dishes', completed: false }
      ]
    },
    // Add more todos here
  ];

  constructor() { }

  ngOnInit() {
  }

}
