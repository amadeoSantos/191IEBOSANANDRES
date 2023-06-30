import { Component } from '@angular/core';
import { NzButtonSize } from 'ng-zorro-antd/button';
interface Person {
  key: string;
  name: string;
}
@Component({
  selector: 'app-document-query',
  templateUrl: './document-query.component.html',
  styleUrls: ['./document-query.component.css'],
})
export class DocumentQueryComponent {
  size: NzButtonSize = 'large';
  checked = false;
  listOfData: Person[] = [
    {
      key: '1',
      name: 'CURP',
    },
    {
      key: '2',
      name: 'ACTA',
    },
    {
      key: '3',
      name: 'CERTIFICADO MEDICO',
    },
    {
      key: '4',
      name: 'CERTIFICADO SECUNDARIA',
    },
  ];

  listo() {}
}
