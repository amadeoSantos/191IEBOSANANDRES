import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import {
  AngularFirestore,
  AngularFirestoreModule,
} from '@angular/fire/compat/firestore';
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';
import { environment } from '../environments/environment';
import { MenuStudentComponent } from './components/menu/menu-student/menu-student.component';

// components
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { SignInComponent } from './components/login/sign-in/sign-in.component';
import { ForgotPasswordComponent } from './components/login/forgot-password/forgot-password.component';
import { VerifyEmailComponent } from './components/login/verify-email/verify-email.component';

// routing
import { AppRoutingModule } from './app-routing.module';

// service

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NZ_I18N } from 'ng-zorro-antd/i18n';
import { es_ES } from 'ng-zorro-antd/i18n';
import { registerLocaleData } from '@angular/common';
import es from '@angular/common/locales/es';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { DocumentQueryComponent } from './components/document/document-query/document-query.component';
import {DocumentRecordComponent} from './components/document/student-record/document-record.component';
import { HomeStudentComponent } from './components/home/home-student/home-student.component';
import { ReportCardComponent } from './components/document/report-card/report-card.component';
import { HomeAdmiComponent } from './components/home/home-admi/home-admi.component';
import { HomeStaffComponent } from './components/home/home-staff/home-staff.component';
import { ProfileComponent } from './components/profile/profile.component';
import { CalendarioComponent } from './components/calendario/calendario.component';
import { MenuAdmiComponent } from './components/menu/menu-admi/menu-admi.component';
import { StudentQueryComponent } from './components/student/student-query/student-query.component';
import { StaffQueryComponent } from './components/staff/staff-query/staff-query.component';
import { StaffRecordComponent } from './components/staff/staff-record/staff-record.component';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzFormModule } from 'ng-zorro-antd/form';
import { MatGridListModule } from '@angular/material/grid-list';
import { NzCarouselModule } from 'ng-zorro-antd/carousel';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { MatToolbarModule } from '@angular/material/toolbar';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { DocumentsRecordComponent } from './components/document/documents-record/documents-record.component';
import {NzIconModule} from "ng-zorro-antd/icon";
import { MessageComponent } from './shared/Material/message/message.component';
import { MatDialogModule, MAT_DIALOG_SCROLL_STRATEGY } from '@angular/material/dialog';
import {MatButtonModule} from "@angular/material/button";
import { DocumentModalComponent } from './components/document/document-modal/document-modal.component';
import { ReportCardRecordComponent } from './components/document/report-card-record/report-card-record.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { AsignaturasComponent } from './components/asignaturas/asignaturas.component';

import 'firebase/firestore';
import firebase from "firebase/compat";
import User = firebase.User;
import {OnlyNumberDirective} from "./shared/only-number.directive";
import { ChatStudentComponent } from './components/chat/chat-student/chat-student.component';
import {MatMenuModule} from "@angular/material/menu";
import { EditMessageDialogComponentComponent } from './components/chat/edit-message-dialog-component/edit-message-dialog-component.component';
import { ConfirmDeleteDialogComponent } from './components/chat/confirm-delete-dialog/confirm-delete-dialog.component';
import { ChatAdmiComponent } from './components/chat/chat-admi/chat-admi.component';
import {StudentRecordComponent} from "./components/student/student-record/student-record.component";
registerLocaleData(es);

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    SignInComponent,
    ForgotPasswordComponent,
    VerifyEmailComponent,
    MenuStudentComponent,
    DocumentQueryComponent,
    DocumentRecordComponent,
    HomeStudentComponent,
    ReportCardComponent,
    HomeAdmiComponent,
    HomeStaffComponent,
    ProfileComponent,
    CalendarioComponent,
    MenuAdmiComponent,
    StudentQueryComponent,
    DocumentRecordComponent,
    StaffQueryComponent,
    StaffRecordComponent,
    DocumentsRecordComponent,
    MessageComponent,
    DocumentModalComponent,
    ReportCardRecordComponent,
    AsignaturasComponent,
      OnlyNumberDirective,
      ChatStudentComponent,
      EditMessageDialogComponentComponent,
      ConfirmDeleteDialogComponent,
      ChatAdmiComponent,
      StudentRecordComponent


  ],
    imports: [
        BrowserModule,
        AngularFireModule.initializeApp(environment.firebase),
        AngularFireAuthModule,
        AngularFirestoreModule,
        AngularFireStorageModule,
        AngularFireDatabaseModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        FormsModule,
        HttpClientModule,
        NzTableModule,
        NzButtonModule,
        NzSelectModule,
        NzFormModule,
        MatGridListModule,
        NzCarouselModule,
        NzAvatarModule,
        MatSidenavModule,
        MatListModule,
        NzLayoutModule,
        MatToolbarModule,
        NzBadgeModule,
        NzDropDownModule,
        MatIconModule,
        MatCardModule,
        NzIconModule,
        MatDialogModule,
        MatButtonModule,
        MatSnackBarModule,
        MatMenuModule


    ],
    exports: [OnlyNumberDirective],
  providers: [

    { provide: NZ_I18N, useValue: es_ES },
    AngularFirestore,

  ],

  bootstrap: [AppComponent],
})
export class AppModule {}
