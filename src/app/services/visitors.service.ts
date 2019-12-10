import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { API_LINK } from './constants';

@Injectable({
  providedIn: 'root'
})
export class VisitorsService {

  api_url: string;
  requestHeader: any = new HttpHeaders();

  constructor( private http: HttpClient ) {
    this.api_url = API_LINK;
    this.requestHeader.append('Content-Type', 'application/json');
  }
	
  art_categories() {
    return this.http.get<any>(this.api_url+'/artcategory/list', {headers: this.requestHeader});
  }

  art_list() {
    return this.http.get<any>(this.api_url+'/artgallery/list', {headers: this.requestHeader});
  }

  placement_year_list() {
    return this.http.get<any>(this.api_url+'/placementyear/details', {headers: this.requestHeader});
  }

  placement_list() {
    return this.http.get<any>(this.api_url+'/placement/details', {headers: this.requestHeader});
  }

  // campus_list() {
  //   return this.http.get<any>(this.api_url+'/placement/details', {headers: this.requestHeader});
  // }
}
