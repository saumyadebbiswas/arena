import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import { UserService } from '../services';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  
  constructor(
    public userService: UserService,
    private router: Router
  ) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    if(this.checkAdmin()) {
      return true;
    } else {
      this.router.navigate(['course']);
      return false;
    }
  }

  checkAdmin() {
    if(this.userService.currentUserValue) {
      let user_info = this.userService.currentUserValue;

      if(user_info.user_type == 'admin') {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

}
