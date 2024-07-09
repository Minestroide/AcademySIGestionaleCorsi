import { Component } from '@angular/core';
import {FormControl, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {Router, RouterLink} from "@angular/router";
import {ContactService} from "../services/contact.service";

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

  private contactService: ContactService;
  private router: Router;

  constructor(contactService: ContactService, router: Router) {
    this.contactService = contactService;
    this.router = router;
  }

  email = new FormControl('');
  message = new FormControl('');

  onSubmit(event: SubmitEvent) {
    event.preventDefault();
    console.log(this.email.value, this.message.value);

    if(!this.email.value || !this.message.value) return;

    this.contactService.createContact(this.message.value, this.email.value).subscribe(() => {
      this.router.navigateByUrl("/");
    });
  }

}
