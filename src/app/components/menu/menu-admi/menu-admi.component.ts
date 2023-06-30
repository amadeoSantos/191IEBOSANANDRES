import { Component } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import {AuthService} from "../../../shared/services/auth.service";
import {ChatService} from "../../../shared/services/ChatService";

@Component({
  selector: 'app-menu-admi',
  templateUrl: './menu-admi.component.html',
  styleUrls: ['./menu-admi.component.css'],
})
export class MenuAdmiComponent {
  home = true;
  documentoRecord = false;
  studentRecord = false;
  staffRecord = false;
  staffQuery = false;
  studentQuery = false;
  reguistrar = false;
  cardQuery= false;

  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(
      map((result) => result.matches),
      shareReplay()
    );
  showChat: boolean = false;


  constructor(private breakpointObserver: BreakpointObserver,
              public authService: AuthService,
              private chatService: ChatService
  ) {
    this.chatService.showChat$.subscribe(showChat => {
      this.showChat = showChat;
    });
  }

  homeAdmin() {
    this.home = true;
    this.documentoRecord = false;
    this.studentRecord = false;
    this.staffQuery = false;
    this.staffRecord = false;
    this.studentQuery = false;
  }
  studentRecords() {
    this.home = false;
    this.documentoRecord = false;
    this.studentRecord = true;
    this.staffRecord = false;
    this.staffQuery = false;
    this.studentQuery = false;
  }
  staffRecords() {
    this.home = false;
    this.documentoRecord = false;
    this.studentRecord = false;
    this.staffRecord = true;
    this.staffQuery = false;
    this.studentQuery = false;
  }

  staffQuerys() {
    this.home = false;
    this.documentoRecord = false;
    this.studentRecord = false;
    this.staffRecord = false;
    this.staffQuery = true;
    this.studentQuery = false;
  }
  studentQuerys() {
    this.home = false;
    this.documentoRecord = false;
    this.studentRecord = false;
    this.staffRecord = false;
    this.staffQuery = false;
    this.studentQuery = true;
  }
  Resgistrar() {
    this.reguistrar = true;
    this.home = false;
    this.documentoRecord = false;
    this.studentRecord = false;
    this.staffRecord = false;
    this.staffQuery = false;
    this.studentQuery = false;
  }

    cardQuerys() {
      this.home = false;
      this.documentoRecord = false;
      this.studentRecord = false;
      this.staffRecord = false;
      this.staffQuery = false;
      this.studentQuery = false;
      this.cardQuery=true;
    }

  toggleChat() {
    this.chatService.toggleChat();
  }
}
