import { Component } from '@angular/core';
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-courseform',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './courseform.component.html',
  styleUrl: './courseform.component.scss'
})
export class CourseformComponent {

  categoryId = new FormControl(0);
  name = new FormControl('');
  description = new FormControl('');
  maxParticipants = new FormControl(0);
  banner = new FormControl(undefined);

  onSubmit(event: SubmitEvent) {
    event.preventDefault();
    console.log(this.categoryId.value, this.name.value, this.description.value, this.banner.value, this.maxParticipants.value);
  }

}
