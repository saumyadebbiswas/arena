import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { API_LINK } from './constants';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StaffWorkService {

  api_url: string;
  requestHeader: any = new HttpHeaders();

  constructor( private http: HttpClient ) {
    this.api_url = API_LINK;
    this.requestHeader.append('Content-Type', 'application/json');
  }
	
  active_student_list() {
    return this.http.get<any>(this.api_url+'/student/activefreelist', {headers: this.requestHeader});
  }
	
  teacher_list() {
    return this.http.get<any>(this.api_url+'/teachers/details', {headers: this.requestHeader});
  }
	
  teacher_routine_list(sendData: any) {
    return this.http.post<any>(this.api_url+'/teachers/routine-details', sendData, {headers: this.requestHeader});
  }
	
  batch_insert(sendData: any): Observable<any> {
    return this.http.post<any>(this.api_url+'/batch/insert', sendData, {headers: this.requestHeader});
  }
	
  batch_edit(sendData: any): Observable<any> {
    return this.http.post<any>(this.api_url+'/batch/edit', sendData, {headers: this.requestHeader});
  }
	
  batch_remove(batch_id: any) {
    return this.http.delete<any>(this.api_url+'/batch/remove/'+batch_id, {headers: this.requestHeader});
  }
	
  active_batch_list() {
    return this.http.get<any>(this.api_url+'/batch/activelist', {headers: this.requestHeader});
  }
	
  batch_details(batch_id: any) {
    return this.http.get<any>(this.api_url+'/batch/details/'+batch_id, {headers: this.requestHeader});
  }
	
  routine_list(batch_id: any) {
    return this.http.get<any>(this.api_url+'/routine/detailbybatch/'+batch_id, {headers: this.requestHeader});
  }
	
  // routine_of_students(batch_id: any) {
  //   return this.http.get<any>(this.api_url+'/routine/studentsdetails/'+batch_id, {headers: this.requestHeader});
  // }
	
  routine_day_assign(sendData: any): Observable<any> {
    return this.http.post<any>(this.api_url+'/routine/day/insert', sendData, {headers: this.requestHeader});
  }
	
  routine_day_edit(sendData: any): Observable<any> {
    return this.http.post<any>(this.api_url+'/routine/day/edit', sendData, {headers: this.requestHeader});
  }
	
  routine_day_alter(sendData: any): Observable<any> {
    return this.http.post<any>(this.api_url+'/routine/day/alter', sendData, {headers: this.requestHeader});
  }
	
  routine_day_remove(sendData: any): Observable<any> {
    return this.http.post<any>(this.api_url+'/routine/day/remove', sendData, {headers: this.requestHeader});
  }
}
