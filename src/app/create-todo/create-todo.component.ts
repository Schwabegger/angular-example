import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import PocketBase from 'pocketbase';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-create-todo',
  templateUrl: './create-todo.component.html',
  styleUrls: ['./create-todo.component.less']
})

export class CreateTodoComponent implements OnInit {
  newTodo = { title: '', tasks: [] };
  todoForm: FormGroup;
  pb = new PocketBase('https://to-dos.pockethost.io');

  constructor(private router: Router) {
    this.todoForm = new FormBuilder().group({
      // title: ['', Validators.required],
      // tasks: ['', Validators.required]
    });
   }
  
  ngOnInit(): void {
  }

  async onSubmit() {
    if (this.todoForm.invalid) {
      console.log('Form is invalid');
      return;
    }
    
    const todoRecord = await this.pb.collection('todos').create(this.newTodo);
    console.log('Created new to-do item');
    console.log(todoRecord);
    
    // Redirect the user to the to-do list
    this.router.navigate(['/todo-list']);
  }
}