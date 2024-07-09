import axios from "axios";
import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable, share} from "rxjs";

export interface ICourseTask {
  content: string,
  createdAt: Date,
  expiration: Date,
  attachmentFileIds: string[],
  userId: string,
  id: string
}

@Injectable({
  providedIn: 'root'
})
export class CourseTaskService {
  private token: string;
  private httpClient: HttpClient;
  private courseTaskObservableCache: {[key: string]: Observable<ICourseTask[]>} = {};
  private courseTaskCache: {[key: string]: ICourseTask[]} = {};

  constructor(httpClient: HttpClient) {
    this.token = window.localStorage.getItem('token') as string;
    this.httpClient = httpClient;
  }

  refreshToken() {
    this.token = window.localStorage.getItem('token') as string;
  }

  clearCache() {
    this.courseTaskCache = {};
    this.courseTaskObservableCache = {};
  }

  createTask(courseId: string, title: string, content: string, files: File[], expiration: Date): Observable<void> {
    let formData = new FormData();
    formData.append('data', JSON.stringify({
      content: content,
      title: title,
      expiration: expiration
    }));
    files.forEach((file) => {
      formData.append('attachments', file);
    });

    return this.httpClient.post<void>(`http://localhost:8080/api/courses/${courseId}/tasks`, formData, {
      headers: {
        'Authorization': `Bearer ${this.token}`
      }
    }).pipe(share());
  }

  getTasks(courseId: string): Observable<ICourseTask[]> {
    if(this.courseTaskCache[courseId]) return new Observable((observer) => {
      observer.next(this.courseTaskCache[courseId]);
    });

    if(this.courseTaskObservableCache[courseId]) return this.courseTaskObservableCache[courseId];

    this.courseTaskObservableCache[courseId] = this.httpClient.get<ICourseTask[]>(`http://localhost:8080/api/courses/${courseId}/tasks`, {
      headers: {
        'Authorization': `Bearer ${this.token}`
      }
    }).pipe(share());

    this.courseTaskObservableCache[courseId].subscribe((posts) => {
      this.courseTaskCache[courseId] = posts;
    });

    return this.courseTaskObservableCache[courseId];
  }
}
