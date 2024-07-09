import {Component, effect, Input, OnInit, signal, WritableSignal} from '@angular/core';
import {ICourse} from "../course.service";
import {RouterLink} from "@angular/router";
import {IUser, UserService} from "../user.service";
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-course',
  templateUrl: './course.component.html',
  standalone: true,
  imports: [
    RouterLink,
    NgIf
  ],
  styleUrl: './course.component.scss'
})
export class CourseComponent implements OnInit {

  @Input() public course: ICourse | undefined;

  private userService: UserService;

  public user: WritableSignal<IUser | undefined> = signal(undefined);

  public subscribed: boolean = false;

  constructor(userService: UserService) {
    this.userService = userService;

    effect(() => {
      if(!this.user()) {
        this.subscribed = false;
      } else {
        if(!this.course) return;
        console.info(this.course.userIds, this.user()!.id);
        this.subscribed = this.course?.userIds.includes(this.user()!.id);
      }
    });
  }

  ngOnInit() {
    this.user.set(undefined);

    this.userService.getUsersMe().subscribe((user) => {
      this.user.set(user);
    });
  }

}
