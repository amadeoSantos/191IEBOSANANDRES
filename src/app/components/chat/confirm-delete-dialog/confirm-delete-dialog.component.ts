import {Component,  OnInit} from '@angular/core';
import {MatDialogRef} from "@angular/material/dialog";
import {Message} from "@angular/compiler/src/i18n/i18n_ast";

@Component({
  selector: 'app-confirm-delete-dialog',
  templateUrl: './confirm-delete-dialog.component.html',
  styleUrls: ['./confirm-delete-dialog.component.scss']
})
export class ConfirmDeleteDialogComponent implements OnInit {
  constructor(public dialogRef: MatDialogRef<ConfirmDeleteDialogComponent>
  ) {}


  ngOnInit(): void {

  }
}

