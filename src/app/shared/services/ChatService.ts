import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import firebase from "firebase/compat";
import User = firebase.User;
import {AngularFireAuth} from "@angular/fire/compat/auth";

@Injectable({
    providedIn: 'root'
})
export class ChatService {
    private _showChat: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

    constructor(private afAuth: AngularFireAuth) { }

    get showChat$(): Observable<boolean> {
        return this._showChat.asObservable();
    }


    toggleChat(): void {
        this._showChat.next(!this._showChat.value);
    }
}
