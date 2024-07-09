import {Component, effect, OnInit, signal, WritableSignal} from '@angular/core';
import {NgForOf, NgIf} from "@angular/common";
import {ActivatedRoute, RouterLink} from "@angular/router";
import {CourseService, ICourse} from "../services/course.service";
import {ICoursePost} from "../services/coursepost.service";
import {IUser, UserService} from "../services/user.service";
import {CourseTaskService, ICourseTask} from "../services/coursetask.service";
import {FormControl, FormsModule, ReactiveFormsModule} from "@angular/forms";

@Component({
  selector: 'app-coursetasks',
  standalone: true,
  imports: [
    NgForOf,
    NgIf,
    RouterLink,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './coursetasks.component.html',
  styleUrl: './coursetasks.component.css'
})
export class CoursetasksComponent implements OnInit {

  public course: ICourse | undefined;
  public userCache: {[key: string]: IUser} = {};
  public user: WritableSignal<IUser | undefined> = signal(undefined);
  public update: WritableSignal<number> = signal(0);
  private userService: UserService;
  public authorized: boolean = false;
  private courseService: CourseService;
  private courseTaskService: CourseTaskService;
  public error: string | undefined = undefined;
  private activatedRoute: ActivatedRoute;
  public tasks: ICourseTask[] = [];
  fileControl: FormControl = new FormControl('');
  newTaskContent: FormControl = new FormControl('');
  newTaskTitle: FormControl = new FormControl('');
  newTaskExpiration: FormControl = new FormControl('');
  newTaskFiles: File[] = [];

  constructor(courseService: CourseService, activatedRoute: ActivatedRoute, userService: UserService, courseTaskService: CourseTaskService) {
    this.courseService = courseService;
    this.activatedRoute = activatedRoute;
    this.userService = userService;
    this.courseTaskService = courseTaskService;

    effect(() => {
      console.info("Updating course tasks...");
      this.update();
      if(this.user()) {
        this.authorized = true;

        this.activatedRoute.params.subscribe((params) => {
          let courseId = params['id'];
          if(!courseId) {
            this.error = "No course ID provided.";
            console.error("No course ID provided.")
            return;
          }


          this.courseService.getCourse(courseId).subscribe((course) => {
            this.course = course;

            console.info("Getting tasks...")
            this.courseTaskService.getTasks(courseId).subscribe((tasks) => {
              this.tasks = tasks;

              this.tasks.forEach((task) => {
                this.userService.getUser(task.userId).subscribe((user) => {
                  this.userCache[task.userId] = user;
                });
              });
            });

            this.course.userIds.forEach((userId) => {
              this.userService.getUser(userId).subscribe((user) => {
                this.userCache[userId] = user;
              });
            });
          });
        });
      } else {
        console.info("Not authorized.")
      }
    });
  }

  ngOnInit(): void {
    this.user.set(undefined);

    this.userService.getUsersMe().subscribe((user) => {
      this.user.set(user);
    });

  }

  onFileInputChange(event: Event) {
    let target = event.target as HTMLInputElement;
    this.newTaskFiles = Array.from(target.files || []);
  }

  onSubmitTask(event: SubmitEvent) {
    event.preventDefault();
    console.info(this.newTaskContent.value);

    if(!this.course) return;

    this.courseTaskService.createTask(this.course.id, this.newTaskTitle.value as string, this.newTaskContent.value as string, this.newTaskFiles, new Date(this.newTaskExpiration.value)).subscribe(() => {
      console.info("Task created.");
      this.courseTaskService.clearCache();
      this.fileControl.setValue('');
      this.newTaskTitle.setValue('');
      this.newTaskContent.setValue('');
      this.newTaskExpiration.setValue('');
      this.update.update((x) => x + 1);
      console.info("Cache cleared.");
    });
  }
}
