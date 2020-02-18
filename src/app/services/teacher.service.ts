import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { API_LINK } from './constants';

@Injectable({
  providedIn: 'root'
})
export class TeacherService {

  api_url: string;
  requestHeader: any = new HttpHeaders();

  constructor( private http: HttpClient ) {
    this.api_url = API_LINK;
    this.requestHeader.append('Content-Type', 'application/json');
  }
	
  routine_list(teacher_id:any) {
    return this.http.get<any>(this.api_url+'/routine/teacher/'+teacher_id, {headers: this.requestHeader});
  }
	
  attendance_list(sendData:any) {
    return this.http.post<any>(this.api_url+'/teachers/current-class', sendData, {headers: this.requestHeader});
  }
	
  get_attendance(sendData:any) {
    return this.http.post<any>(this.api_url+'/teachers/get-attendance', sendData, {headers: this.requestHeader});
  }
}
