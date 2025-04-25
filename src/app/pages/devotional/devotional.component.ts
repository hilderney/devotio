import { Component, OnInit } from '@angular/core';
import { PageLayoutComponent } from '../../components/page-layout.component';

@Component({
  selector: 'app-devotional',
  templateUrl: './devotional.component.html',
  styleUrls: ['./devotional.component.scss'],
  standalone: true,
  imports: [PageLayoutComponent]
})
export class DevotionalComponent  implements OnInit {

  constructor() { }

  ngOnInit() {}

}
