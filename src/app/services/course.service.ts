import axios from "axios";
import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable, share} from "rxjs";

export interface ICourse {
  name: string,
  categoryId: string,
  description: string,
  id: string,
  maxParticipants: number,
  userIds: string[]
}

@Injectable({
  providedIn: 'root'
})
export class CourseService {
  private courses: ICourse[] | undefined = undefined;
  private myCourses: ICourse[] | undefined = undefined;
  private token: string;
  private httpClient: HttpClient;
  private courseObservableCache: {[key: string]: Observable<ICourse>} = {};
  private courseCache: {[key: string]: ICourse} = {};
  private myCoursesObservable: Observable<ICourse[]> | undefined = undefined;
  private coursesObservable: Observable<ICourse[]> | undefined = undefined;

  constructor(httpClient: HttpClient) {
    this.token = window.localStorage.getItem('token') as string;
    this.httpClient = httpClient;
  }

  refreshToken() {
    this.token = window.localStorage.getItem('token') as string;
  }

  clearCache() {
    this.courses = undefined;
    this.myCourses = undefined;
    this.myCoursesObservable = undefined;
    this.coursesObservable = undefined;
    this.courseObservableCache = {};
  }

  getCourses(): Observable<ICourse[]> {
    if(this.courses) return new Observable((observer) => {
      observer.next(this.courses);
    });

    if(this.coursesObservable) return this.coursesObservable;

    this.coursesObservable = this.httpClient.get<ICourse[]>("http://localhost:8080/api/courses").pipe(share());

    this.coursesObservable.subscribe((courses) => {
      this.courses = courses;
    });

    return this.coursesObservable;
  }

  getMyCourses(): Observable<ICourse[]> {
    if(this.myCourses) return new Observable((observer) => {
      observer.next(this.myCourses);
    });

    if(this.myCoursesObservable) return this.myCoursesObservable;

    this.myCoursesObservable = this.httpClient.get<ICourse[]>("http://localhost:8080/api/courses/@me", {
      headers: {
        "Authorization": `Bearer ${this.token}`
      }
    }).pipe(share());

    this.myCoursesObservable.subscribe((courses) => {
      this.myCourses = courses;
    });

    return this.myCoursesObservable;
  }

  getCourse(id: string): Observable<ICourse> {
    if(this.courseCache[id]) return new Observable((observer) => {
      observer.next(this.courseCache[id]);
    });

    if(this.courseObservableCache[id]) return this.courseObservableCache[id];

    this.courseObservableCache[id] = this.httpClient.get<ICourse>(`http://localhost:8080/api/courses/${id}`).pipe(share());

    this.courseObservableCache[id].subscribe((course) => {
      this.courseCache[id] = course;
    });

    return this.courseObservableCache[id];
  }

  createCourse(name: string, categoryId: string, description: string, maxParticipants: number, banner: File): Observable<ICourse> {
    let formData = new FormData();
    formData.append("data", JSON.stringify({
      name,
      categoryId,
      description,
      maxParticipants
    }));
    formData.append("banner", banner);

    return this.httpClient.post<ICourse>("http://localhost:8080/api/courses", formData, {
      headers: {
        "Authorization": `Bearer ${this.token}`
      }
    });
  }

  subscribeToCourse(courseId: string): Observable<void> {
    return this.httpClient.post<void>(`http://localhost:8080/api/courses/${courseId}/subscribe`, {}, {
      headers: {
        "Authorization": `Bearer ${this.token}`
      }
    }).pipe(share());
  }

  unsubscribeFromCourse(courseId: string): Observable<void> {
    return this.httpClient.post<void>(`http://localhost:8080/api/courses/${courseId}/unsubscribe`, {}, {
      headers: {
        "Authorization": `Bearer ${this.token}`
      }
    }).pipe(share());
  }
}
