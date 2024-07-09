import {Component, effect, OnInit, signal, WritableSignal} from '@angular/core';
import {CourseService, ICourse} from "../course.service";
import {IUser, UserService} from "../user.service";
import {ActivatedRoute, RouterLink} from "@angular/router";
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {NgForOf, NgIf} from "@angular/common";
import {CoursePostService, ICoursePost} from "../coursepost.service";

@Component({
  selector: 'app-courseposts',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgIf,
    RouterLink,
    NgForOf
  ],
  templateUrl: './courseposts.component.html',
  styleUrl: './courseposts.component.css'
})
export class CoursepostsComponent implements OnInit {

  public course: ICourse | undefined;
  public posts: ICoursePost[] = [];
  public userCache: {[key: string]: IUser} = {};
  public user: WritableSignal<IUser | undefined> = signal(undefined);
  public update: WritableSignal<number> = signal(0);
  private userService: UserService;
  public authorized: boolean = false;
  private courseService: CourseService;
  public error: string | undefined = undefined;
  private activatedRoute: ActivatedRoute;
  private coursePostService: CoursePostService;
  newPostContent: FormControl = new FormControl('');
  fileControl: FormControl = new FormControl('');
  newPostFiles: File[] = [];


  constructor(courseService: CourseService, activatedRoute: ActivatedRoute, userService: UserService, coursePostService: CoursePostService) {
    this.courseService = courseService;
    this.activatedRoute = activatedRoute;
    this.userService = userService;
    this.coursePostService = coursePostService;

    effect(() => {
      console.info(this.update());
      if(this.user()) {
        console.info("User is logged in.")
        this.authorized = true;

        this.activatedRoute.params.subscribe((params) => {
          let courseId = params['id'];
          if(!courseId) {
            this.error = "No course ID provided.";
            return;
          }

          this.courseService.getCourse(courseId).subscribe((course) => {
            this.course = course;
          });

          this.coursePostService.getPosts(courseId).subscribe((posts) => {
            this.posts = posts;

            this.posts.forEach((post) => {
              this.userService.getUser(post.userId).subscribe((user) => {
                this.userCache[post.userId] = user;
              });
            });
          });
        });
      }
    });
  }

  ngOnInit(): void {

    this.userService.getUsersMe().subscribe((user) => {
      this.user.set(user);
    });

  }

  onFileInputChange(event: Event) {
    let target = event.target as HTMLInputElement;
    console.info(target.files);
    this.newPostFiles = Array.from(target.files || []);
    console.info(this.newPostFiles)
  }

  onSubmitPost(event: SubmitEvent) {
    event.preventDefault();
    console.info(this.newPostContent.value);

    if(!this.course) return;
    if(!this.newPostContent.value) return;

    this.coursePostService.createPost(this.course.id, this.newPostContent.value, this.newPostFiles).subscribe((post) => {
      this.newPostContent.setValue('');
      this.fileControl.setValue('');
      this.newPostFiles = [];
      this.coursePostService.clearCache();
      this.update.set(this.update() + 1);
    });
  }
}
