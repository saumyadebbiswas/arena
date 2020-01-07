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
    return this.http.get<any>(this.api_url+'/student/activelist', {headers: this.requestHeader});
  }
	
  batch_insert(sendData: any): Observable<any> {
    return this.http.post<any>(this.api_url+'/batch/insert', sendData, {headers: this.requestHeader});
  }
	
  batch_edit(sendData: any): Observable<any> {
    return this.http.post<any>(this.api_url+'/batch/edit', sendData, {headers: this.requestHeader});
  }
	
  active_batch_list() {
    return this.http.get<any>(this.api_url+'/batch/activelist', {headers: this.requestHeader});
  }
	
  batch_details(batch_id: any) {
    return this.http.get<any>(this.api_url+'/batch/details/'+batch_id, {headers: this.requestHeader});
  }
	
  teacher_list() {
    return this.http.get<any>(this.api_url+'/teachers/details', {headers: this.requestHeader});
  }
}
