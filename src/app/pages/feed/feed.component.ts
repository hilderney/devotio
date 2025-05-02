import { Component, OnInit } from '@angular/core';
import { PageLayoutComponent } from '../../components/page-layout/page-layout.component';

@Component({
  selector: 'app-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.scss'],
  standalone: true,
  imports: [
    PageLayoutComponent
  ]
})
export class FeedComponent  implements OnInit {

  constructor() { }

  ngOnInit() {}

}
