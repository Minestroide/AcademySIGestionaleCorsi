import { Routes } from '@angular/router';
import {CoursesComponent} from "./courses/courses.component";
import {CoursedetailComponent} from "./coursedetail/coursedetail.component";
import {HomeComponent} from "./home/home.component";
import {CourseformComponent} from "./courseform/courseform.component";
import {LoginComponent} from "./login/login.component";
import {RegisterComponent} from "./register/register.component";
import {PasswordresetComponent} from "./passwordreset/passwordreset.component";
import {ContactpageComponent} from "./contactpage/contactpage.component";
import {CoursepostsComponent} from "./courseposts/courseposts.component";
import {CoursestudentsComponent} from "./coursestudents/coursestudents.component";
import {CoursetasksComponent} from "./coursetasks/coursetasks.component";
import {ContactadminComponent} from "./contactadmin/contactadmin.component";
import {ProfileeditComponent} from "./profileedit/profileedit.component";

export const routes: Routes = [
{
  path: '',
  component: HomeComponent
},
{
  path: 'courses/:id/posts',
  component: CoursepostsComponent
},
{
  path: 'courses/:id/students',
  component: CoursestudentsComponent
},
{
  path: 'courses/:id/tasks',
  component: CoursetasksComponent
},
{
  path: 'courses/new',
  component: CourseformComponent
},
{
  path: 'courses/:id',
  component: CoursedetailComponent
},
{
    path: 'courses',
    component: CoursesComponent
},
{
  path: 'passwordreset',
  component: PasswordresetComponent
},
{
  path: 'login',
  component: LoginComponent
},
{
  path: 'contact',
  component: ContactpageComponent
},
{
  path: 'profile',
  component: ProfileeditComponent
},
{
  path: 'admin/contact',
  component: ContactadminComponent
},
{
  path: 'register',
  component: RegisterComponent
}
];
