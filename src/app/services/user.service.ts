import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { User } from '../models/user';
import { API_LINK } from './constants';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  api_url: string;
  requestHeader: any = new HttpHeaders();

	private currentUserSubject: BehaviorSubject<User>;

  constructor( private http: HttpClient ) {
    this.api_url = API_LINK;
    this.requestHeader.append('Content-Type', 'application/json');

    this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
  }

	public get currentUserValue(): User {
		return this.currentUserSubject.value;
	}

  login(sendData: any): Observable<any> {
    return this.http.post<any>(this.api_url+'/student/login', sendData, {headers: this.requestHeader}).pipe(map(response => {
      //--- Set current user details in local storage
			if(response.status == true) {
				localStorage.setItem('currentUser', JSON.stringify(response.data));
				this.currentUserSubject.next(response.data);
      }
      
			return response;
		}));
  }
	
  register(sendData: any): Observable<any> {
    return this.http.post<any>(this.api_url+'/student/insert', sendData, {headers: this.requestHeader});
  }

  logout() {
    //--- Remove user from local storage to log user out
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }
}
