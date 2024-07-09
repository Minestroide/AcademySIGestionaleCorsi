import {Component, effect, OnInit, signal, WritableSignal} from '@angular/core';
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {Router, RouterLink} from "@angular/router";
import {CategoryService, ICategory} from "../services/category.service";
import {IUser, UserService} from "../services/user.service";
import {NgForOf, NgIf} from "@angular/common";
import {CourseService} from "../services/course.service";

@Component({
  selector: 'app-courseform',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    NgIf,
    NgForOf
  ],
  templateUrl: './courseform.component.html',
  styleUrl: './courseform.component.scss'
})
export class CourseformComponent implements OnInit {

  categoryId = new FormControl("");
  name = new FormControl('');
  description = new FormControl('');
  maxParticipants = new FormControl(0);
  banner = new FormControl(undefined);

  private courseService: CourseService;
  private bannerFile: File | undefined = undefined;
  private userService: UserService;
  private categoryService: CategoryService;
  public categories: ICategory[] = [];
  public user: WritableSignal<IUser | undefined> = signal(undefined);
  private router: Router;

  constructor(userService: UserService, categoryService: CategoryService, courseService: CourseService, router: Router) {
    this.userService = userService;
    this.categoryService = categoryService;
    this.courseService = courseService;
    this.router = router;

    effect(() => {
      if(this.user()) {
        this.categoryService.getCategories().subscribe((categories) => {
          this.categories = categories;
        });
      }
    });
  }

  onSubmit(event: SubmitEvent) {
    event.preventDefault();
    console.log(this.categoryId.value, this.name.value, this.description.value, this.bannerFile, this.maxParticipants.value);

    if(!this.categoryId.value || !this.name.value || !this.description.value || !this.bannerFile || !this.maxParticipants.value) {
      return alert("Please fill in all fields.");
    }

    this.courseService.createCourse(this.name.value as string, this.categoryId.value, this.description.value, this.maxParticipants.value, this.bannerFile).subscribe((course) => {
      this.courseService.clearCache();
      this.router.navigateByUrl("/courses");
    });
  }

  ngOnInit() {
    this.user.set(undefined);

    this.userService.getUsersMe().subscribe((user) => {
      this.user.set(user);
    });
  }

  onBannerChange(event: Event) {
    let target = event.target as HTMLInputElement;
    this.bannerFile = target.files?.[0];
  }
}
