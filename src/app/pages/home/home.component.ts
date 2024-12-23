import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from "../../../services/auth.service";
import { ContactService } from "../../../services/contact.service";
import { Observable } from "rxjs";
import { MatTableDataSource } from "@angular/material/table";
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from "@angular/material/sort";
import {Validator} from "../../../utils/validator";
import {ToastrService} from "ngx-toastr";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
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
    private contactService: ContactService,
    private toastr: ToastrService
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
    this.toastr.success('Contato Deletado com sucesso', 'Contato');
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
        this.toastr.error('Email inválido', 'Erro');
        this.contact.email = ''
      }else{
        this.contactService.addContact(this.contact);
        this.toastr.success('Contato Salvo com sucesso', 'Contato');
        this.contact = { name: '', email: '', telephone: '' };
      }
    }
  }
  async logout() {
    await this.authService.logout();
    this.router.navigate(['/login']);
  }


  transform(value: string, maxLength: number = 15): string {
    if (value.length > maxLength) {
      return value.slice(0, maxLength) + "...";
    }
    return value;
  }

  formatTelephone(value: string | number): string {
    const rawValue = value.toString().replace(/\D/g, '');

    if (rawValue.length === 10) {
      // Formato: (XX) XXXX-XXXX
      return rawValue.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    } else if (rawValue.length === 11) {
      // Formato: (XX) XXXXX-XXXX
      return rawValue.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    }

    // Retorna o valor original se não atender aos formatos esperados
    return value.toString();
  }
}
