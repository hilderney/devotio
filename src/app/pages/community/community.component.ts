import { Component, OnInit } from '@angular/core';
import { PageLayoutComponent } from '../../shared/components/page-layout/page-layout.component';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-community',
  templateUrl: './community.component.html',
  styleUrls: ['./community.component.scss'],
  standalone: true,
  imports: [
    PageLayoutComponent,
    CommonModule,
    IonicModule
  ]
})
export class CommunityComponent  implements OnInit {

  constructor() { }

  ngOnInit() {}

}
