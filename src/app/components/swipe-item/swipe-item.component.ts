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
  isCompleted: boolean = false;
  private lastX: number = 0;

  constructor(private router: Router) {}

  onSwipe(slidingItem: IonItemSliding, event: any) {
    if (event.detail.side === 'start') {
      console.log('Swipe para a DIREITA');
      this.isCompleted = true;
    } else {
      console.log('Swipe para a ESQUERDA');
      this.isCompleted = false;
    }
    slidingItem.close();
  }

  handleClick(forceMark: boolean = false) {
    if (!forceMark) {
      this.isCompleted = !this.isCompleted;
      return;
    }

    this.isCompleted = true;

    if (this.link) {
      this.router.navigate([this.link]);
    }
  }

  // TODO: Registrar o status de conclusão dos itens
}
