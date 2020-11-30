import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../shared/services/authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  showRegisterView = false;

  constructor(private readonly authService: AuthenticationService, private readonly router: Router) {}

  login(username: string, password: string): void {
    const loggedInSuccessfuly = this.authService.login(username, password);

    if (!loggedInSuccessfuly) {
      alert('We could not log you in with the provided information');
    }
    this.router.navigate(['movies']);
  }

  register(username: string, password: string, passwordAgain: string, email: string): void {
    if (username.length * password.length * passwordAgain.length * email.length === 0) {
      alert('Fill out all the fields!');
      return;
    }
    if (username.length < 4 || username.length > 22) {
      alert('Username length must be between 4 and 22!');
      return;
    }
    if (password !== passwordAgain) {
      alert('Passwords did not match!');
      return;
    }
    if (password.length < 6) {
      alert('Password must be at least 6 characters long!');
      return;
    }
    const registeredSuccessfuly = this.authService.register(username, password, email);
    if (!registeredSuccessfuly) {
      alert('Username is already taken!');
      return;
    }
    this.router.navigate(['movies']);
  }
}
