import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import { Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user$: Observable<firebase.User | null>;

  constructor(private afAuth: AngularFireAuth) {
    this.user$ = this.afAuth.authState;
  }

  getUserId(): Observable<string | null> {
    return this.user$.pipe(map(user => user ? user.uid : null));
  }

  getEmail(): Observable<string | null> {
    return this.user$.pipe(
      map(user => {
        console.log('User:', user); // Log para depuração
        return user ? user.email : null;
      })
    );
  }

  async register(email: string, password: string): Promise<void> {

    try {
      await this.afAuth.createUserWithEmailAndPassword(email, password);
      console.log('Registro realizado com sucesso');
    } catch (error) {
      console.error('Erro ao registrar: ', error);
    }
  }

  async login(email: string, password: string): Promise<void> {
    try {
      await this.afAuth.signInWithEmailAndPassword(email, password);
      console.log('Login realizado com sucesso');
    } catch (error) {
      console.error('Erro ao fazer login: ', error);
    }
  }

  async loginWithGoogle(): Promise<void> {
    try {
      const provider = new firebase.auth.GoogleAuthProvider();
      await this.afAuth.signInWithPopup(provider);
      console.log('Login com Google realizado com sucesso');
    } catch (error) {
      console.error('Erro ao fazer login com Google: ', error);
    }
  }

  async recoverPassword(email: string): Promise<void> {
    try {
      await this.afAuth.sendPasswordResetEmail(email);
      console.log('Email de recuperação de senha enviado');
    } catch (error) {
      console.error('Erro ao enviar email de recuperação: ', error);
    }
  }

  async logout(): Promise<void> {
    try {
      await this.afAuth.signOut();
      console.log('Logout realizado com sucesso');
    } catch (error) {
      console.error('Erro ao fazer logout: ', error);
    }
  }
}
