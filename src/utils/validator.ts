export class Validator {
  static isValidEmail(email: string): boolean {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  }

  static isValidPassword(password: string): boolean {
    // Requisitos: pelo menos 8 caracteres, uma letra maiúscula, uma letra minúscula, um número e um caractere especial
    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$!%*?&])[A-Za-z\d@$#!%*?&]{8,}$/;
    return passwordPattern.test(password);
  }
}
