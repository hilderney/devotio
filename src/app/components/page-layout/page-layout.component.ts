import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-page-layout',
  templateUrl: './page-layout.component.html',
  styleUrls: ['./page-layout.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule],
})
export class PageLayoutComponent  implements OnInit {
  @Input() title: string = '';
  @Input() imgUrl: string = '';

  constructor(private router: Router) { }

  ngOnInit() {}

  back() {
    this.router.navigate(['../']);
  }

}
