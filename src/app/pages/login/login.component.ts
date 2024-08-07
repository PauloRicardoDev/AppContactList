import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from "../../../services/auth.service";
import { Validator } from "../../../utils/validator";
import {ToastrService} from "ngx-toastr";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  openRulesPassword: boolean = false;
  openRecoverPassword: boolean = false;
  openRegisterUser: boolean = false;

  isLoading: boolean = false;

  constructor(private authService: AuthService, private router: Router, private toastr: ToastrService) { }

  async login() {
    this.isLoading = true;

    if (!Validator.isValidEmail(this.email)) {
      this.toastr.error('Email inválido', 'Erro');
      this.isLoading = false;
      return;
    }

    if (!Validator.isValidPassword(this.password)) {
      this.toastr.error('Senha inválida', 'Erro');
      this.isLoading = false;
      return;
    }

    try {
      await this.authService.login(this.email, this.password);
      this.router.navigate(['/home']);
    } catch (error) {
      this.toastr.error('Falha no login. Verifique suas credenciais', 'Erro');
    } finally {
      this.isLoading = false;
    }
  }

  async loginWithGoogle() {
    try {
      await this.authService.loginWithGoogle();
      this.router.navigate(['/home']);
    } catch (error) {
      this.toastr.error('Falha ao fazer login com Google.', 'Erro');
    }
  }

  async recoverPassword() {
    this.isLoading = true;

    if (!Validator.isValidEmail(this.email)) {
      this.toastr.error('Email inválido', 'Erro');
      this.isLoading = false;
      return;
    }

    try {
      await this.authService.recoverPassword(this.email);
      this.email = '';
      this.toastr.warning('Instruções para recuperação de senha enviadas para seu email.',
        'Atenção');
    } catch (error) {
      this.toastr.error('Falha ao tentar recuperar a senha', 'Erro');
    }finally {
      this.isLoading = false;
    }
  }

  async register() {
    this.isLoading = true;
    if (!Validator.isValidEmail(this.email)) {
      this.toastr.error('Email inválido', 'Erro');
      this.isLoading = false;
      return;
    }

    if (!Validator.isValidPassword(this.password)) {
      this.toastr.error('Senha inválida, a senha deve seguir o padrão de segurança', 'Senha inválida');
      this.isLoading = false;
      return;
    }

    try {
      await this.authService.register(this.email, this.password);
      this.router.navigate(['/home']);
    } catch (error) {
      console.error('Registration failed', error);
    } finally {
      this.isLoading = false;
    }

  }

  openRules(){
    this.openRulesPassword = this.openRulesPassword ? false : true;
  }

  openRecover(){
    this.email = '';
    this.password = '';
    this.openRecoverPassword = this.openRecoverPassword ? false : true;
  }

  openRegister(){
    this.email = '';
    this.password = '';
    this.openRegisterUser = this.openRegisterUser ? false : true;
  }

  protected readonly password_rules = password_rules;
}

const password_rules = [
  {
    name:'A senha deve ter pelo menos 8 caracteres.'
  },
  {
    name:'Incluindo uma letra maiúscula.'
  },
  {
    name:'Uma letra minúscula.'
  },
  {
    name:'Um número.'
  },
  {
    name:'Um caractere especial.'
  }
]


