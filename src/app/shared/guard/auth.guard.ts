import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from '@angular/router';
import { AuthService } from '../../shared/services/auth.service';
import { Observable } from 'rxjs';
import {AngularFireAuth} from "@angular/fire/compat/auth";

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements  CanActivate {
  constructor(private afAuth: AngularFireAuth, private router: Router) {
  }

  canActivate(): Observable<boolean> {
    return this.afAuth.authState.pipe(
        map(user => {
          if (user) {
            return true; // Usuario autenticado, permite el acceso a la ruta protegida
          } else {
            this.router.navigate(['/sign-in']); // Redirige al usuario a la página de inicio de sesión
            return false; // Usuario no autenticado, bloquea el acceso a la ruta protegida
          }
        })
    );
  }
}
