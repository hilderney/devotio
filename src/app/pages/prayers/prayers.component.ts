import { Component, OnInit } from '@angular/core';
import { PageLayoutComponent } from '../../components/page-layout.component';

@Component({
  selector: 'app-prayers',
  templateUrl: './prayers.component.html',
  styleUrls: ['./prayers.component.scss'],
  standalone: true,
  imports: [PageLayoutComponent]
})
export class PrayersComponent  implements OnInit {

  constructor() { }

  ngOnInit() {}

}
