import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss']
})
export class MessageComponent  {
  @Input() mensaje!: string;
  @Input() titulo!:string;

  @Output() cerrar = new EventEmitter<void>();

  cerrarDialogo(): void {
    this.cerrar.emit();
  }

}
