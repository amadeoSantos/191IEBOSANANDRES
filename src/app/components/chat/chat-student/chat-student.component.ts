import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import { ChatService } from "../../../shared/services/ChatService";
import {AngularFirestore, AngularFirestoreCollection} from "@angular/fire/compat/firestore";

import {Observable} from "rxjs";
import {AngularFireAuth} from "@angular/fire/compat/auth";

import { map } from 'rxjs/operators';
import {MatDialog} from "@angular/material/dialog";
interface Message {
  id?: string;
  sender: string;
  content: string;
  user:string;
  timestamp: any;
}
@Component({
  selector: 'app-chat-student',
  templateUrl: './chat-student.component.html',
  styleUrls: ['./chat-student.component.scss']
})
export class ChatStudentComponent implements OnInit {

  @ViewChild('chatContainer') chatContainerRef!: ElementRef;
  @ViewChild('messageElement') messageElementRef!: ElementRef;
  showChat: boolean = false;
  messagesCollection: AngularFirestoreCollection<Message>;
  messages: Observable<Message[]>;
  newMessage!: string;
  currentUser!: string;
  constructor(private afAuth: AngularFireAuth,
              private chatService: ChatService,
              private afs: AngularFirestore
  ) {
    this.chatService.showChat$.subscribe(showChat => {
      this.showChat = showChat;
    });
    this.messagesCollection = this.afs.collection<Message>('messages');
    this.messages = this.messagesCollection.valueChanges();
    this.messages = this.messagesCollection.valueChanges().pipe(
        map(messages => messages.sort((a, b) => a.timestamp - b.timestamp))
    );
    if (this.showChat) {
      setTimeout(() => {
        const chatContainer = this.chatContainerRef.nativeElement;
        const messageElement = this.messageElementRef.nativeElement;

        chatContainer.scrollTop = messageElement.offsetTop;
      }, 0);
    }
  }

  ngOnInit(): void {
    this.afAuth.authState.subscribe(user => {
      if (user) {
        this.currentUser = user.uid;
      }
    });
  }
  sendMessage() {
    this.afAuth.authState.subscribe(user => {
      if (user) {
    if (this.newMessage) {
      const message: Message = {
        sender: this.currentUser,
        user: user.displayName ?? '',
        content: this.newMessage,
        timestamp: new Date()
      };
      this.messagesCollection.add(message)
          .then(docRef => {
            const messageId = docRef.id;
            // Actualizar el mensaje con el identificador del documento
            message.id = messageId;
            console.log(message.id)
            this.newMessage = '';
          })
          .catch(error => {
            console.error('Error al agregar el mensaje:', error);
          });
    }
      }
    });
  }
  deleteMessage(message: Message): void {
    this.messages = this.messagesCollection.snapshotChanges().pipe(
        map(actions => {
          return actions.map(a => {
            const data = a.payload.doc.data() as Message;
            const id = a.payload.doc.id;
            return { id, ...data };
          });
        })
    );

        // Eliminar el mensaje de Firestore
        this.messagesCollection.doc(message.id).delete().then(() => {
          console.log('Message deleted successfully'+ message.id);
        }).catch((error) => {
          console.error('Error deleting message:', error);
        });

  }

  closeChat() {
    // Aquí puedes implementar la lógica para cerrar el chat

    this.chatService.toggleChat();
  }

  formatTimestamp(timestamp: { seconds: number, nanoseconds: number }): string {
    const milliseconds = timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000;
    const date = new Date(milliseconds);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
}
