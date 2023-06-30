import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection} from "@angular/fire/compat/firestore";
import {Observable} from "rxjs";
import {AngularFireAuth} from "@angular/fire/compat/auth";
import {ChatService} from "../../../shared/services/ChatService";

import {AuthService} from "../../../shared/services/auth.service";

export interface Message {
  id?: string;
  sender: string;
  user: string;
  content: string;
  timestamp: Date;
  reply?: string; // Campo para almacenar la respuesta
}
@Component({
  selector: 'app-chat-admi',
  templateUrl: './chat-admi.component.html',
  styleUrls: ['./chat-admi.component.scss']
})
export class ChatAdmiComponent implements OnInit {

  @ViewChild('chatContainer') chatContainerRef!: ElementRef;
  @ViewChild('messageElement') messageElementRef!: ElementRef;

  messagesCollection!: AngularFirestoreCollection<Message>;
  messages!: Observable<Message[]>;

  newMessage: any;

  constructor(private afs: AngularFirestore, private authService: AuthService) { }

  ngOnInit(): void {
    this.authService.getCurrentUser().subscribe(user => {
      if (user) {
        this.messagesCollection = this.afs.collection<Message>('messages', ref => ref.where('sender', '!=', user.uid));
        this.messages = this.messagesCollection.valueChanges();
      }
    });
  }

  closeChat() {

  }
  replyMessage: string = '';
  sendMessage() : void {

  }
}
