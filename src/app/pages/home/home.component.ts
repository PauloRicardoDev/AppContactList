import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from "../../../services/auth.service";
import { ContactService } from "../../../services/contact.service";
import { Observable } from "rxjs";
import { MatTableDataSource } from "@angular/material/table";
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from "@angular/material/sort";
import {Validator} from "../../../utils/validator";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  textError: string = '';
  contacts!: Observable<any[]>;
  contact: any = { name: '', email: '', telephone: '' };
  isEditMode: boolean = false;
  userName$: Observable<string | null> | undefined;
  displayedColumns: string[] = ['name', 'email', 'telephone', 'actions'];
  dataSource = new MatTableDataSource<any>();

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;


  constructor(
    private authService: AuthService,
    private router: Router,
    private contactService: ContactService
  ) { }

  ngOnInit() {
    this.userName$ = this.authService.getEmail();
    this.contacts = this.contactService.getContacts();
    this.contacts.subscribe(contacts => {
      this.dataSource.data = contacts.sort((a, b) => a.name.localeCompare(b.name));
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  editContact(contact: any) {
    this.contact = { ...contact };
    this.isEditMode = true;
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 500);
  }

  deleteContact(key: string) {
    this.contactService.deleteContact(key);
  }

  addNewContact() {
    this.contact = { name: '', email: '', telephone: '' };
    this.isEditMode = false;
  }

  saveContact() {
    if (this.isEditMode) {
      this.contactService.updateContact(this.contact.key, this.contact);
      this.contact = { name: '', email: '', telephone: '' };
    } else {
      if (!Validator.isValidEmail(this.contact.email)) {
        this.textError = 'Email inválido.';
        this.contact.email = ''
      }else{
        this.contactService.addContact(this.contact);
        this.contact = { name: '', email: '', telephone: '' };
      }
    }
  }
  async logout() {
    await this.authService.logout();
    this.router.navigate(['/login']);
  }
}
