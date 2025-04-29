import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, IonItemSliding } from '@ionic/angular';

@Component({
  selector: 'app-devotional-item',
  standalone: true,
  templateUrl: './devotional-item.component.html',
  styleUrls: ['./devotional-item.component.scss'],
  imports: [
    CommonModule,
    IonicModule
  ]
})
export class DevotionalItemComponent {
  @Input() title: string = '';
  isCompleted: boolean = false;
  private lastX: number = 0;

  constructor() {}

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

  handleClick() {
    this.isCompleted = !this.isCompleted;
  }

  // TODO: Registrar o status de conclusão dos itens
}
