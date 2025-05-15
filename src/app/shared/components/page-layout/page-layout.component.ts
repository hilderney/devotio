import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-page-layout',
  templateUrl: './page-layout.component.html',
  styleUrls: ['./page-layout.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule],
})
export class PageLayoutComponent implements OnInit {
  @Input() title: string = '';
  @Input() imgUrl: string = '';
  @Input('show-footer') showFooter = false;
  @Input('back-to') backTo = '';
  @Output('backButtonClick') backButtonEmitter = new EventEmitter();
  @Output('increaseTextClick') increaseTextSizeEmitter = new EventEmitter();
  @Output('decreaseTextClick') decreaseTextSizeEmitter = new EventEmitter();

  constructor(private router: Router) { }

  ngOnInit() { }

  handleBackButton() {
    this.router.navigate(['../']);
  }

  handleDecreaseTextSize() {
    this.decreaseTextSizeEmitter.emit();
  }

  handleIncreaseTextSize() {
    this.increaseTextSizeEmitter.emit();
  }

}
