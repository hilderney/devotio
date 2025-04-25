import { Component, Input, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-main-card',
  templateUrl: './main-card.component.html',
  styleUrls: ['./main-card.component.scss'],
  standalone: true,
  imports: [IonicModule],

})
export class MainCardComponent  implements OnInit {

  @Input() titulo: string = '';
  @Input() imagemUrl: string = '';
  @Input() descricao: string = '';

  constructor() { }

  ngOnInit() {}

}
