import axios from "axios";
import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable, share} from "rxjs";

export interface ICoursePost {
  content: string,
  createdAt: Date,
  attachmentFileIds: string[],
  userId: string,
  id: string
}

@Injectable({
  providedIn: 'root'
})
export class CoursePostService {
  private token: string;
  private httpClient: HttpClient;
  private coursePostObservableCache: {[key: string]: Observable<ICoursePost[]>} = {};
  private coursePostCache: {[key: string]: ICoursePost[]} = {};

  constructor(httpClient: HttpClient) {
    this.token = window.localStorage.getItem('token') as string;
    this.httpClient = httpClient;
  }

  refreshToken() {
    this.token = window.localStorage.getItem('token') as string;
  }

  clearCache() {
    this.coursePostCache = {};
    this.coursePostObservableCache = {};
  }

  createPost(courseId: string, content: string, files: File[]): Observable<void> {
    let formData = new FormData();
    formData.append('data', JSON.stringify({
      content: content
    }));
    files.forEach((file) => {
      formData.append('attachments', file);
    });

    return this.httpClient.post<void>(`http://localhost:8080/api/courses/${courseId}/posts`, formData, {
      headers: {
        'Authorization': `Bearer ${this.token}`
      }
    }).pipe(share());
  }

  getPosts(courseId: string): Observable<ICoursePost[]> {
    if(this.coursePostCache[courseId]) return new Observable((observer) => {
      observer.next(this.coursePostCache[courseId]);
    });

    if(this.coursePostObservableCache[courseId]) return this.coursePostObservableCache[courseId];

    this.coursePostObservableCache[courseId] = this.httpClient.get<ICoursePost[]>(`http://localhost:8080/api/courses/${courseId}/posts`, {
      headers: {
        'Authorization': `Bearer ${this.token}`
      }
    }).pipe(share());

    this.coursePostObservableCache[courseId].subscribe((posts) => {
      this.coursePostCache[courseId] = posts;
    });

    return this.coursePostObservableCache[courseId];
  }
}
