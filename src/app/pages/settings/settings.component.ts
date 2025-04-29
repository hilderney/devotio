import { Component, OnInit } from '@angular/core';
import { PageLayoutComponent } from '../../components/page-layout/page-layout.component';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
  standalone: true,
  imports: [PageLayoutComponent]
})
export class SettingsComponent  implements OnInit {

  constructor() { }

  ngOnInit() {}

}
