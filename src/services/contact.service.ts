import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { AuthService } from './auth.service';
import { switchMap, map } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ContactService {

  constructor(private db: AngularFireDatabase, private authService: AuthService) { }

  private getContactsRef(userId: string) {
    return this.db.list(`/contacts/${userId}`);
  }

  getContacts() {
    return this.authService.getUserId().pipe(
      switchMap(userId => {
        if (userId) {
          return this.getContactsRef(userId).snapshotChanges().pipe(
            map(changes =>
              changes.map(c => ({ key: c.payload.key, ...(c.payload.val() as object) }))
            )
          );
        } else {
          return of([]);
        }
      })
    );
  }

  addContact(contact: any) {
    this.authService.getUserId().pipe(
      switchMap(userId => {
        if (userId) {
          return this.getContactsRef(userId).push(contact);
        } else {
          return of(null);
        }
      })
    ).subscribe();
  }

  updateContact(key: string, contact: any) {
    this.authService.getUserId().pipe(
      switchMap(userId => {
        if (userId) {
          return this.getContactsRef(userId).update(key, contact);
        } else {
          return of(null);
        }
      })
    ).subscribe();
  }

  deleteContact(key: string) {
    this.authService.getUserId().pipe(
      switchMap(userId => {
        if (userId) {
          return this.getContactsRef(userId).remove(key);
        } else {
          return of(null);
        }
      })
    ).subscribe();
  }
}
