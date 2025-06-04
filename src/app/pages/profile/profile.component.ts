import { Component, OnInit } from '@angular/core';
import { PageLayoutComponent } from '../../shared/components/page-layout/page-layout.component';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  standalone: true,
  imports: [
    PageLayoutComponent,
    CommonModule,
    IonicModule
  ]
})
export class ProfileComponent  implements OnInit {

  constructor() { }

  ngOnInit() {}

}
