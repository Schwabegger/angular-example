import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import PocketBase from 'pocketbase';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-create-todo',
  templateUrl: './create-todo.component.html',
  styleUrls: ['./create-todo.component.less']
})

export class CreateTodoComponent implements OnInit {
  newTask: string = '';
  newTodo: any = {
    title: '',
    tasks: []
  };
  pb = new PocketBase('https://to-dos.pockethost.io');
  allTasks: any = [];
  selectedTask: string = '';

  // constructor(private toastr: ToastrService, private router: Router) { }
  constructor(private router: Router) { }

  async ngOnInit() {
    await this.fetchAllTasks();
  }

  async fetchAllTasks() {
    const taskRecords = await this.pb.collection('tasks').getList();
    taskRecords.items.forEach((task: any) => {
      this.allTasks.push({
        id: task.id,
        name: task.name
      });
    });

    console.log('Fetched all tasks');
    this.allTasks = this.allTasks.filter((task: any) => !this.newTodo.tasks.some((t: any) => t.id === task.id));
  }

  async onSubmit() {
    if (this.newTodo.title.trim().length === 0 || this.newTodo.tasks.length === 0) {
      console.log('Title or tasks are empty');
      this.showToast('Bitte gib einen Titel und mindestens einen Task ein!', 'Fehler');
      return;
    }

    let record;
    const taskIds: any = [];

    await Promise.all(this.newTodo.tasks.map(async (task: any) => {
      try {
          record = await this.pb.collection('tasks').create({ name: task.name, completed: false }, {'$autoCancel': false});
          taskIds.push(record.id);
      } catch (e) {
        console.log(e);
      }
    }));

    // this.newTodo.tasks.forEach((task: any) => {
    //     record = this.createAllTasks(task, taskIds);
    // });
    console.log('Created new tasks: ', taskIds);

    console.log({ title: this.newTodo.title, tasks: taskIds });

    const todoRecord = await this.pb.collection('todos').create({ title: this.newTodo.title, tasks: taskIds });
    console.log('Created new to-do item: ', todoRecord);

    // Redirect the user to the to-do list
    this.router.navigate(['/todos']);
  }

  async createAllTasks(task: any, taskIds: any) {
    let record;
    try {
      record = await this.pb.collection('tasks').create({ name: task.name, completed: false }).then((record: any) => {
        taskIds.push(record.id);
      });
    } catch (e) {
      console.log(e);
    }
    return record;
  }

  addTask() {
    if (this.newTask.trim().length === 0) {
      this.showToast('Bitte gib einen Tasknamen ein!', 'Fehler');
      return;
    }

    this.newTodo.tasks.push({
      name: this.newTask
    });

    console.log('Added new task: ' + this.newTask);
    this.newTask = '';
  }

  onFormKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      event.preventDefault();
    }
  }

  showToast(message: string, title: string) {
    //  this.toastr.success(message, title);
  }

  async selectedTaskChanged() {
    console.log(this.selectedTask);
    if (this.selectedTask.trim().length === 0) {
      console.log('No task selected');
      return;
    }
    
    this.allTasks = this.allTasks.filter((task: any) => !this.newTodo.tasks.some((t: any) => t.id === task.id));
    let taskRecord = await this.pb.collection('tasks').getFirstListItem('id="' + this.selectedTask + '"', {'$autoCancel': false});

    this.newTodo.tasks.push({
      id: taskRecord.id,
      name: taskRecord['name'],
      completed: taskRecord['completed'],
      changed: false
    });

    console.log('Added new task: ' + this.selectedTask);
    this.selectedTask = '';
  }
}