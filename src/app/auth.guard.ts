// src/app/auth.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Observable } from 'rxjs';
import { map, tap, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private afAuth: AngularFireAuth, private router: Router) { }

  canActivate(): Observable<boolean> {
    return this.afAuth.authState.pipe(
      take(1),
      map(user => !!user),
      tap(isAuthenticated => {
        if (!isAuthenticated) {
          alert("Dados inválidos - Verifique suas credenciais e corrija-as.")
          this.router.navigate(['/login']);
        } else {
          console.log('Acesso permitido. Usuário autenticado.');
        }
      })
    );
  }
}
