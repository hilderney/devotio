import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-page-layout-simple',
  templateUrl: './page-layout-simple.component.html',
  styleUrls: ['./page-layout-simple.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule]
})
export class PageLayoutSimpleComponent  implements OnInit {
  @Input() title: string = ''
  @Input() imgUrl: string = ''

  constructor(private router: Router) { }

  ngOnInit() {}

  backToDevotional() {
    this.router.navigate(['./devotional']);
  }

}
