import axios from "axios";
import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable, share} from "rxjs";

export interface IContact {
  content: string,
  email: string,
  id: string
}

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  private token: string;
  private httpClient: HttpClient;
  private contactsObservable: Observable<IContact[]> | undefined = undefined;
  private contacts: IContact[] | undefined = undefined;

  constructor(httpClient: HttpClient) {
    this.token = window.localStorage.getItem('token') as string;
    this.httpClient = httpClient;
  }

  refreshToken() {
    this.token = window.localStorage.getItem('token') as string;
  }

  clearCache() {
    this.contacts = undefined;
    this.contactsObservable = undefined;
  }

  createContact(content: string, email: string): Observable<void> {
    return this.httpClient.post<void>(`http://localhost:8080/api/contacts`, {
      content: content,
      email: email
    }, {}).pipe(share());
  }

  getContacts(): Observable<IContact[]> {
    if(this.contacts) return new Observable((observer) => {
      observer.next(this.contacts);
    });

    if(this.contactsObservable) return this.contactsObservable;

    this.contactsObservable = this.httpClient.get<IContact[]>(`http://localhost:8080/api/contacts`, {
      headers: {
        "Authorization": `Bearer ${this.token}`
      }
    }).pipe(share());

    this.contactsObservable.subscribe((contacts) => {
      this.contacts = contacts;
    });

    return this.contactsObservable;
  }

  deleteContact(contactId: string) {
    return this.httpClient.delete<void>(`http://localhost:8080/api/contacts/${contactId}`, {
      headers: {
        "Authorization": `Bearer ${this.token}`
      }
    }).pipe(share());
  }
}
