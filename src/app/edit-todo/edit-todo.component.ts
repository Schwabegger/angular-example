import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import PocketBase from 'pocketbase';

@Component({
  selector: 'app-edit-todo',
  templateUrl: './edit-todo.component.html',
  styleUrls: ['./edit-todo.component.less']
})

export class EditTodoComponent implements OnInit {
  constructor(private route: ActivatedRoute) {}
  pb = new PocketBase('https://to-dos.pockethost.io');
  todo: any;

  async ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    // Fetch the to-do item with the given ID and populate the form fields
    const record = await this.pb.collection('todos').getFirstListItem('id={{ id }}', {
      expand: 'tasks',
    });
    console.log('Fetched to-do item with ID:', id);
    this.todo = structuredClone(record);
  }
}
