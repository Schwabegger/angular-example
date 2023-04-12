import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import PocketBase from 'pocketbase';
import { Router } from "@angular/router"

@Component({
  selector: 'app-edit-todo',
  templateUrl: './edit-todo.component.html',
  styleUrls: ['./edit-todo.component.less']
})

export class EditTodoComponent implements OnInit {
  pb = new PocketBase('https://to-dos.pockethost.io');
  id = this.route.snapshot.paramMap.get('id');
  todo: any;
  allTasks: any = [];
  newTask: string = '';
  selectedTask: string = '';

  constructor(private route: ActivatedRoute, private router: Router) { }

  async ngOnInit() {
    // Fetch the to-do item with the given ID and populate the form fields
    const todoRecords = await this.pb.collection('todos').getFirstListItem('id="' + this.id + '"', {
      expand: 'tasks',
    });
    console.log('Fetched to-do item with ID:', this.id);
    
    // Create an array of tasks and populate it with the tasks from the to-do item
    const todoTasks: any = [];
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
    this.allTasks = this.allTasks.filter((task: any) => !this.todo.tasks.some((t: any) => t.id === task.id));
  }

  async addTask() {
    if (this.newTask.trim().length === 0) {
      this.showToast('Bitte gib einen Tasknamen ein!', 'Fehler');
      return;
    }

    let taskRecord = await this.pb.collection('tasks').create({name: this.newTask, completed: false}, {'$autoCancel': false});

    this.todo.tasks.push({
      id: taskRecord.id,
      name: this.newTask,
      completed: false,
      changed: false
    });

    console.log('Added new task: ' + this.newTask);
    this.newTask = '';
  }

  async deleteTask(taskId: string) {
    this.todo.tasks = this.todo.tasks.filter((task: any) => task.id !== taskId);
  }

  showToast(message: string, title: string) {
    //  this.toastr.success(message, title);
  }

  onFormKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      event.preventDefault();
    }
  }

  async onSubmit() {
    await this.updateTodo();
    this.router.navigate(['/todos']);
  }

  async updateTodo() {
    let count = 0;
    const taskIds:any = [];
    // Iterate over each task and call updateTask function if the task has been changed
    await Promise.all(this.todo.tasks.map(async (task: any) => {
      if (task.changed) {
        await this.updateTask(task.id.toString(), task.completed);
        count++;
      }
      taskIds.push(task.id);
    }));

    // Log the number of tasks that were updated
    if (count > 0)
      console.log('Updated ', count, ' tasks');
    else
      console.log('No tasks were updated');

    // Update the to-do item with the given ID and expand the tasks field to return the updated tasks list in the response
    const todoRecord = await this.pb.collection('todos').update(this.id!.toString(), {
      title: this.todo.title,
      tasks: taskIds,
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

  async selectedTaskChanged() {
    console.log(this.selectedTask);
    if (this.selectedTask.trim().length === 0) {
      console.log('No task selected');
      return;
    }
    
    this.allTasks = this.allTasks.filter((task: any) => !this.todo.tasks.some((t: any) => t.id === task.id));
    let taskRecord = await this.pb.collection('tasks').getFirstListItem('id="' + this.selectedTask + '"', {'$autoCancel': false});

    this.todo.tasks.push({
      id: taskRecord.id,
      name: taskRecord['name'],
      completed: taskRecord['completed'],
      changed: false
    });

    console.log('Added new task: ' + this.selectedTask);
    this.selectedTask = '';
  }
}
