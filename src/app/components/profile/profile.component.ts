import { Component } from '@angular/core';
import {AuthService} from "../../shared/services/auth.service";
import {SignInComponent} from "../login/sign-in/sign-in.component";


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent {
  constructor(public authService: SignInComponent) {}
}
