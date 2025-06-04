import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { MainCardComponent } from '../../shared/components/main-card/main-card.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonicModule,
    RouterModule,
    MainCardComponent
  ],
})
export class HomeComponent  implements OnInit {

  constructor() {}

  ngOnInit() {}

}
