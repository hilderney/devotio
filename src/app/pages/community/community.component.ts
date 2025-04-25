import { Component, OnInit } from '@angular/core';
import { PageLayoutComponent } from '../../components/page-layout.component';

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
