import { Component, OnInit, Renderer2 } from '@angular/core';
import { Observable } from 'rxjs';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { map, shareReplay } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthService } from "../../../shared/services/auth.service";
import { HttpClient } from "@angular/common/http";
import { ChatService } from "../../../shared/services/ChatService";

declare var ChatwootWidgetAPI: any;

@Component({
  selector: 'app-menu-student',
  templateUrl: './menu-student.component.html',
  styleUrls: ['./menu-student.component.scss'],
})
export class MenuStudentComponent implements OnInit {
  statuscard = false;
  statushome = true;
  statusdocument = false;
  calendar = false;
  statusperfil = false;
  statusdocumentos = false;
  isHandset$: Observable<boolean> = this.breakpointObserver
      .observe(Breakpoints.Handset)
      .pipe(
          map((result) => result.matches),
          shareReplay()
      );

  constructor(
      private router: Router,
      private breakpointObserver: BreakpointObserver,
      public authService: AuthService,
      private chatService: ChatService,
      private renderer: Renderer2,
      private http: HttpClient
  ) {
    // Suscribirse a los cambios en la variable showChat del servicio de chat
    this.chatService.showChat$.subscribe(showChat => {
      this.showChat = showChat;
    });
  }

  ngOnInit() {
    this.loadChatwootWidget();
  }

  // Método para cambiar a la vista de inicio del estudiante
  homeStudent() {
    this.statushome = true;
    this.statusdocument = false;
    this.calendar = false;
    this.statuscard = false;
    this.statusperfil = false;
    this.statusdocumentos = false;
  }

  // Método para cambiar a la vista de documentos del estudiante
  documetStudent() {
    this.statushome = false;
    this.statusdocument = true;
    this.calendar = false;
    this.statuscard = false;
    this.statusperfil = false;
    this.statusdocumentos = false;
  }

  // Método para cambiar a la vista del calendario
  calendario() {
    this.calendar = true;
    this.statushome = false;
    this.statusdocument = false;
    this.statuscard = false;
    this.statusperfil = false;
    this.statusdocumentos = false;
  }

  // Método para cambiar a la vista de la boleta de calificaciones
  card() {
    this.calendar = false;
    this.statushome = false;
    this.statusdocument = false;
    this.statuscard = true;
    this.statusperfil = false;
    this.statusdocumentos = false;
  }

  // Método para cambiar a la vista del perfil del estudiante
  perfil() {
    this.calendar = false;
    this.statushome = false;
    this.statusdocument = false;
    this.statuscard = false;
    this.statusperfil = true;
    this.statusdocumentos = false;
  }

  // Método para cambiar a la vista de documentos
  documentos() {
    this.calendar = false;
    this.statushome = false;
    this.statusdocument = false;
    this.statuscard = false;
    this.statusperfil = false;
    this.statusdocumentos = true;
  }

  // Método para abrir la vista de chat
  openChat() {
    this.router.navigate(['/chat-student']);
  }

  // Cargar el widget de Chatwoot
  loadChatwootWidget() {
    this.http.get('assets/chatwoot-widget.html', { responseType: 'text' }).subscribe(response => {
      const chatwootScript = this.renderer.createElement('script');
      chatwootScript.innerHTML = response;
      this.renderer.appendChild(document.body, chatwootScript);
    });
  }

  // Variable para controlar la visualización del chat
  showChat: boolean = false;

  // Método para alternar la visualización del chat
  toggleChat() {
    this.chatService.toggleChat();
  }
}
