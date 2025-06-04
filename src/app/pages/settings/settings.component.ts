import { Component, OnInit } from '@angular/core';
import { PageLayoutComponent } from '../../shared/components/page-layout/page-layout.component';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
  standalone: true,
  imports: [
    PageLayoutComponent,
    CommonModule,
    IonicModule
  ]
})
export class SettingsComponent  implements OnInit {

  constructor() { }

  ngOnInit() {}

}
