import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import PocketBase from 'pocketbase';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-edit-todo',
  templateUrl: './edit-todo.component.html',
  styleUrls: ['./edit-todo.component.less']
})

export class EditTodoComponent implements OnInit {
  todoForm: FormGroup;
  pb = new PocketBase('https://to-dos.pockethost.io');
  id = this.route.snapshot.paramMap.get('id');
  todo: any;

  constructor(private route: ActivatedRoute, private fb: FormBuilder) {
    this.todoForm = this.fb.group({
      // title: ['', Validators.required],
      // tasks: ['', Validators.required]
    });
  }

  async ngOnInit() {
    // Fetch the to-do item with the given ID and populate the form fields
    const todoRecords = await this.pb.collection('todos').getFirstListItem('id="' + this.id + '"', {
      expand: 'tasks',
    });
    console.log('Fetched to-do item with ID:', this.id);
    // this.todo = structuredClone(todoRecords);

    const todoTasks:any = [];
    todoRecords.expand['tasks'].forEach((task: any) => {
      todoTasks.push({
        id: task.id,
        name: task.name,
        completed: task.completed
      });
    });

    this.todo = {
      id: todoRecords.id,
      title: todoRecords['title'],
      tasks: todoTasks
    };
    console.log(this.todo);
    console.log('🤙🏿');
  }

  async addTask() {

  }

  async onSubmit() {
    if (this.todoForm.invalid) {
      console.log('Form is invalid');
      return;
    }

    // const updateTodo = {
    //   title: this.todo.title,
    //   tasks: this.todo.expand.tasks
    // };
    // console.log(updateTodo);

    await this.updateTodo();
  }

  async updateTodo() {
    // console.log(this.todo.expand.tasks[0].completed);
    // this.todo.expand.tasks[0].completed = false;
    // console.log(this.todo);

    this.todo.tasks.forEach((task: any) => {
      console.log(task.completed);
    });

    return;

    // Iterate over each task and call updateTask function
    await Promise.all(this.todo.expand.tasks.map(async (task: any) => {
      await this.updateTask(task.id.toString(), task.completed);
    }));
    console.log('Updated all tasks');

    const todoRecord = await this.pb.collection('todos').update(this.id!.toString(), this.todo, {
      expand: 'tasks'
    });
    console.log('Saved to-do item');
    console.log(todoRecord);
  }

  async updateTask(taskId: string, completed: boolean) {
    const taskRecord = await this.pb.collection('tasks').update(taskId, { completed: completed });
    console.log('Updated task: ', taskId);
    console.log(taskRecord);
  }
}
