import { Component, OnInit } from '@angular/core';
import { PageLayoutComponent } from '../../shared/components/page-layout/page-layout.component';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  standalone: true,
  imports: [PageLayoutComponent]
})
export class ProfileComponent  implements OnInit {

  constructor() { }

  ngOnInit() {}

}
