import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { API_LINK } from './constants';

@Injectable({
  providedIn: 'root'
})
export class ActiveStudentService {

  api_url: string;
  requestHeader: any = new HttpHeaders();

  constructor( private http: HttpClient ) {
    this.api_url = API_LINK;
    this.requestHeader.append('Content-Type', 'application/json');
  }
	
  routine_list(student_id:any) {
    return this.http.get<any>(this.api_url+'/routine/student/'+student_id, {headers: this.requestHeader});
  }
	
  all_attendance(sendData:any) {
    return this.http.post<any>(this.api_url+'/student/attendance-list', sendData, {headers: this.requestHeader});
  }
}
