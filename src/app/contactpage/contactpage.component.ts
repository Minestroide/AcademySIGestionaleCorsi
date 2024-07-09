import { Component } from '@angular/core';
import {FormControl, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-contactpage',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './contactpage.component.html',
  styleUrl: './contactpage.component.css'
})
export class ContactpageComponent {

  email = new FormControl('');
  message = new FormControl('');

  onSubmit(event: SubmitEvent) {
    event.preventDefault();
    console.log(this.email.value, this.message.value);
  }

}
