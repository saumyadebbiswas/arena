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
	
  personal_course_insert(sendData: any): Observable<any> {
    return this.http.post<any>(this.api_url+'/application/detail/course/insert', sendData, {headers: this.requestHeader});
  }
	
  personal_course_edit(sendData: any): Observable<any> {
    return this.http.post<any>(this.api_url+'/application/detail/course/edit', sendData, {headers: this.requestHeader});
  }
	
  personal_course_remove(sendData: any): Observable<any> {
    return this.http.post<any>(this.api_url+'/application/detail/course/remove', sendData, {headers: this.requestHeader});
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
	
  educatuion_grad_type_update(sendData: any): Observable<any> {
    return this.http.post<any>(this.api_url+'/application/education/editdegree', sendData, {headers: this.requestHeader});
  }
	
  activity_detail(student_id: any) {
    return this.http.get<any>(this.api_url+'/application/activities/student/'+student_id, {headers: this.requestHeader});
  }
	
  activities_insert(sendData: any): Observable<any> {
    return this.http.post<any>(this.api_url+'/application/activity/insert', sendData, {headers: this.requestHeader});
  }
	
  activities_update(sendData: any): Observable<any> {
    return this.http.post<any>(this.api_url+'/application/activity/edit', sendData, {headers: this.requestHeader});
  }
	
  official_detail(student_id: any) {
    return this.http.get<any>(this.api_url+'/application/officials/student/'+student_id, {headers: this.requestHeader});
  }
	
  official_insert(sendData: any): Observable<any> {
    return this.http.post<any>(this.api_url+'/application/official/insert', sendData, {headers: this.requestHeader});
  }
	
  official_update(sendData: any): Observable<any> {
    return this.http.post<any>(this.api_url+'/application/official/edit', sendData, {headers: this.requestHeader});
  }
	
  official_confirm(sendData: any): Observable<any> {
    return this.http.post<any>(this.api_url+'/application/official/confirm', sendData, {headers: this.requestHeader});
  }
}
