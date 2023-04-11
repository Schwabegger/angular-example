import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import PocketBase from 'pocketbase';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {Router} from "@angular/router"

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

  constructor(private route: ActivatedRoute, private fb: FormBuilder, private router: Router) {
    this.todoForm = this.fb.group({
      // title: ['', Validators.required, Validators.minLength(3)],
      // tasks: ['', Validators.required]
    });
  }

  async ngOnInit() {
    // Fetch the to-do item with the given ID and populate the form fields
    const todoRecords = await this.pb.collection('todos').getFirstListItem('id="' + this.id + '"', {
      expand: 'tasks',
    });
    console.log('Fetched to-do item with ID:', this.id);

    // Create an array of tasks and populate it with the tasks from the to-do item
    const todoTasks:any = [];
    todoRecords.expand['tasks'].forEach((task: any) => {
      todoTasks.push({
        id: task.id,
        name: task.name,
        completed: task.completed,
        changed: false
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

    await this.updateTodo();

    this.router.navigate(['/todos']);
  }

  async updateTodo() {
    let count = 0;
    // Iterate over each task and call updateTask function if the task has been changed
    await Promise.all(this.todo.tasks.map(async (task: any) => {
      if (task.changed){
        await this.updateTask(task.id.toString(), task.completed);
        count++;
      }
    }));
    // Log the number of tasks that were updated
    if(count > 0)
      console.log('Updated ', count ,' tasks');
    else
      console.log('No tasks were updated');

    // Update the to-do item with the given ID and expand the tasks field to return the updated tasks list in the response
    const todoRecord = await this.pb.collection('todos').update(this.id!.toString(), {
      title: this.todo.title,
      expand: 'tasks'
    });
    console.log('Saved to-do item');
    console.log(todoRecord);
  }

  // Update the task with the given ID and set the completed field to the given value
  async updateTask(taskId: string, completed: boolean) {
    const taskRecord = await this.pb.collection('tasks').update(taskId, { completed: completed });
    console.log('Updated task: ', taskId);
    console.log(taskRecord);
  }

  // Toggle the completed field of the task with the given ID
  async toggleTask(taskId: string) {
    this.todo.tasks.forEach((task: any) => {
      if (task.id === taskId) {
        task.completed = !task.completed;
        task.changed = !task.changed;
        console.log('Toggled task: ', taskId, 'from', !task.completed, 'to', task.completed);
      }
    });
  }
}
