import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { API_LINK } from './constants';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApplicationService {

  api_url: string;
  requestHeader: any = new HttpHeaders();

  constructor( private http: HttpClient ) {
    this.api_url = API_LINK;
    this.requestHeader.append('Content-Type', 'application/json');
  }
	
  student_detail(student_id: any) {
    return this.http.get<any>(this.api_url+'/application/details/'+student_id, {headers: this.requestHeader});
  }
	
  personal_insert(sendData: any): Observable<any> {
    return this.http.post<any>(this.api_url+'/application/detail/insert', sendData, {headers: this.requestHeader});
  }
	
  personal_update(sendData: any): Observable<any> {
    return this.http.post<any>(this.api_url+'/application/detail/edit', sendData, {headers: this.requestHeader});
  }
	
  education_detail(student_id: any) {
    return this.http.get<any>(this.api_url+'/application/educations/student/'+student_id, {headers: this.requestHeader});
  }
	
  educatuion_insert(sendData: any): Observable<any> {
    return this.http.post<any>(this.api_url+'/application/education/insert', sendData, {headers: this.requestHeader});
  }
	
  educatuion_update(sendData: any): Observable<any> {
    return this.http.post<any>(this.api_url+'/application/education/edit', sendData, {headers: this.requestHeader});
  }
}
