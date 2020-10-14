import { Injectable } from '@angular/core';
import {HttpInterceptor , HttpRequest ,HttpHandler , HttpEvent} from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { Router } from "@angular/router";

import { SuperuserService } from '../shared/superuser.service';

@Injectable()
 export class AuthInterceptor implements HttpInterceptor{
    constructor( public superUserService : SuperuserService , public router : Router) { }
     intercept(req: HttpRequest<any> , next: HttpHandler){
         if(req.headers.get('noauth'))
         return next.handle(req.clone());
         else{
             const clonedreq = req.clone({
                 headers: req.headers.set("Authorization" ,"Mekdi " + this.superUserService.getToken())
             });
             return next.handle(clonedreq).pipe(tap(

                event => {},
                err => {
                    if(err.error.auth == false){
                        this.router.navigateByUrl('/main');
                        
                    }
                }
             )
             );
         }

     }
 }