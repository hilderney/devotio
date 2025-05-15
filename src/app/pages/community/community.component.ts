import { Component, OnInit } from '@angular/core';
import { PageLayoutComponent } from '../../shared/components/page-layout/page-layout.component';

@Component({
  selector: 'app-community',
  templateUrl: './community.component.html',
  styleUrls: ['./community.component.scss'],
  standalone: true,
  imports: [PageLayoutComponent]
})
export class CommunityComponent  implements OnInit {

  constructor() { }

  ngOnInit() {}

}
