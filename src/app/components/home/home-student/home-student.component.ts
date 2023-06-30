import { Component } from '@angular/core';
import { SignInComponent} from "../../login/sign-in/sign-in.component";
import {AuthService} from "../../../shared/services/auth.service";

@Component({
  selector: 'app-home-student',
  templateUrl: './home-student.component.html',
  styleUrls: ['./home-student.component.css'],
})
export class HomeStudentComponent {
  constructor(public authService: AuthService) {}
}
