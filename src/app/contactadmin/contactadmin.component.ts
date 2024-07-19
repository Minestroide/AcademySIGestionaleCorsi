import {Component, OnInit} from '@angular/core';
import {ContactService, IContact} from "../services/contact.service";
import {NgForOf} from "@angular/common";
import {UserService} from "../services/user.service";

@Component({
  selector: 'app-contactadmin',
  standalone: true,
  imports: [
    NgForOf
  ],
  templateUrl: './contactadmin.component.html',
  styleUrl: './contactadmin.component.css'
})
export class ContactadminComponent implements OnInit {

  private contactService: ContactService;
  private userService: UserService;
  public contacts: IContact[] = [];

  constructor(contactService: ContactService, userService: UserService) {
    this.contactService = contactService;
    this.userService = userService;
  }

  ngOnInit() {
    console.info("Fetching contacts.");
    this.userService.getUsersMe().subscribe((user) => {
      this.contactService.getContacts().subscribe((contacts) => {
        console.info(contacts);
        this.contacts = contacts;
      });
    });
  }

  deleteContact(event: MouseEvent, contactId: string) {
    event.preventDefault();
    this.contactService.deleteContact(contactId).subscribe(() => {
      this.contacts = this.contacts.filter((contact) => contact.id !== contactId);
    });
  }
}
