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

  @Input() title: string = '';
  @Input() imgUrl: string = '';
  @Input() descricao: string = '';

  constructor() { }

  ngOnInit() {}

}
