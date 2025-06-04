import { Component, OnInit } from '@angular/core';
import { PageLayoutComponent } from '../../shared/components/page-layout/page-layout.component';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.scss'],
  standalone: true,
  imports: [
    PageLayoutComponent,
    CommonModule,
    IonicModule
  ]
})
export class FeedComponent  implements OnInit {

  constructor() { }

  ngOnInit() {}

}
