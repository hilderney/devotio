import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { MainCardComponent } from '../../components/main-card/main-card.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  standalone: true,
  imports: [
    IonicModule,
    RouterModule,
    MainCardComponent
  ],
})
export class HomeComponent  implements OnInit {

  constructor() {}

  ngOnInit() {}

}
