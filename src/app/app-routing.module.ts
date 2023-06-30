import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SignInComponent } from './components/login/sign-in/sign-in.component';
import { ForgotPasswordComponent } from './components/login/forgot-password/forgot-password.component';
import { VerifyEmailComponent } from './components/login/verify-email/verify-email.component';

// route guard
import { AuthGuard } from './shared/guard/auth.guard';
import {MenuStudentComponent} from "./components/menu/menu-student/menu-student.component";
import {MenuAdmiComponent} from "./components/menu/menu-admi/menu-admi.component";
import {ChatStudentComponent} from "./components/chat/chat-student/chat-student.component";

const routes: Routes = [
  { path: '', redirectTo: 'sign-in', pathMatch: 'full' },
  { path: 'sign-in', component: SignInComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'verify-email-address', component: VerifyEmailComponent },
  {path: 'menu-student', component: MenuStudentComponent, canActivate: [AuthGuard]},
  {path: 'menu-admi', component: MenuAdmiComponent, canActivate: [AuthGuard]},
  { path: 'chat-student', component: ChatStudentComponent },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})

export class AppRoutingModule {}
