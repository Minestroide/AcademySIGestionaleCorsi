import axios from "axios";
import {Injectable} from "@angular/core";
import {Observable, share} from "rxjs";
import {HttpClient} from "@angular/common/http";

export interface IUser {
  name: string,
  surname: string,
  username: string,
  id: string,
  roleIds: string[]
}

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private usersCache: {[key: string]: IUser} = {};
  private usersObservableCache: {[key: string]: Observable<IUser>} = {};
  private selfUserObservable: Observable<IUser> | undefined = undefined;
  private selfUser: IUser | undefined = undefined;
  private token: string;

  private httpClient: HttpClient;

  constructor(httpClient: HttpClient) {
    this.token = window.localStorage.getItem("token") as string;

    this.httpClient = httpClient;
  }

  clearCache() {
    this.selfUserObservable = undefined;
    this.selfUser = undefined;
  }

  refreshToken() {
    this.token = window.localStorage.getItem("token") as string;
  }

  getUsersMe() {
    if(this.selfUser) {
      return new Observable<IUser>((subscriber) => {
        subscriber.next(this.selfUser as IUser);
      });
    }

    if(this.selfUserObservable) {
      console.info("Returning cached user.")
      return this.selfUserObservable;
    }

    console.info("Fetching user.");
    this.selfUserObservable = this.httpClient.get<IUser>("http://localhost:8080/api/users/@me", {
      headers: {
        "Authorization": `Bearer ${this.token}`
      }
    }).pipe(share());

    this.selfUserObservable.subscribe((user) => {
      this.selfUser = user;
    });

    return this.selfUserObservable;
  }

  getUser(userId: string): Observable<IUser> {
    if(this.usersCache[userId]) {
      return new Observable<IUser>((subscriber) => {
        subscriber.next(this.usersCache[userId]);
      });
    }

    if(this.usersObservableCache[userId]) {
      return this.usersObservableCache[userId];
    }

    this.usersObservableCache[userId] = this.httpClient.get<IUser>(`http://localhost:8080/api/users/${userId}`, {
      headers: {
        "Authorization": `Bearer ${this.token}`
      }
    }).pipe(share());

    this.usersObservableCache[userId].subscribe((user) => {
      this.usersCache[userId] = user;
    });

    return this.usersObservableCache[userId];
  }
}
