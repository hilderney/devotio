import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, IonItemSliding } from '@ionic/angular';
import { Router, RouterModule } from '@angular/router';
import { provideClientHydration } from '@angular/platform-browser';

@Component({
  selector: 'app-swipe-item',
  standalone: true,
  templateUrl: './swipe-item.component.html',
  styleUrls: ['./swipe-item.component.scss'],
  imports: [
    CommonModule,
    RouterModule,
    IonicModule,
  ]
})
export class SwipeItemComponent {
  @Input() title: string = '';
  @Input() link!: string;
  @Input('completed') isCompleted: boolean = false;
  private lastX: number = 0;

  constructor(private router: Router) {}

  onSwipe(slidingItem: IonItemSliding, event: any) {
    if (event.detail.side === 'start') {
      console.log('Swipe para a DIREITA COMPLETAR');
      // TODO Completar a task atual
      this.isCompleted = true;
    } else {
      // TODO RemoverCompletar a task atual
      console.log('Swipe para a ESQUERDA REMOVER COMPLETO');
      this.isCompleted = false;
    }
    slidingItem.close();
  }

  handleClick(forceMark: boolean = false) {
    if (!forceMark) {
      console.log('Clique TOOGLE COMPLETAR');
      // TODO Completar ou Remover Completar da task atual
      this.isCompleted = !this.isCompleted;
      return;
    }

    console.log('Clique COMPLETAR');
    // TODO Completar a task atual
    this.isCompleted = true;

    if (this.link) {
      this.router.navigate([this.link]);
    }
  }
}
