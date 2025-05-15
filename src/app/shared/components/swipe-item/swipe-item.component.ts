import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, IonItemSliding } from '@ionic/angular';
import { Router, RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { TasksEnum } from '../../../pages/devotional/state/devotional.models';
import { selectCompletedTasks } from '../../../pages/devotional/state/devotional.selectors';
import { map, take } from 'rxjs';
import { markTaskComplete, unmarkTask } from '../../../pages/devotional/state/devotional.actions';

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
  @Input() task!: TasksEnum;
  private lastX: number = 0;
  isCompleted$ = this.store.select(selectCompletedTasks).pipe(
    map((tasks: string | TasksEnum[]) => tasks.includes(this.task))
  );

  constructor(
    private router: Router,
    private store: Store
  ) {}

  handleSwipe(slidingItem: IonItemSliding, event: any): void {
    if (event.detail && event.detail.side === 'start') {
      this.store.dispatch(markTaskComplete({ task: this.task }));
    } else {
      this.store.dispatch(unmarkTask({ task: this.task }));
    }
    slidingItem.close();
  }

  handleClick(forceMark: boolean = false): void {
    if (!forceMark) {
      // Alterna o status: se está completo, remove; se não, completa
      this.isCompleted$.pipe(
        take(1)
      ).subscribe((isCompleted: boolean) => {
        if (isCompleted) {
          this.store.dispatch(unmarkTask({ task: this.task }));
        } else {
          this.store.dispatch(markTaskComplete({ task: this.task }));
        }
      });
      return;
    }

    this.store.dispatch(markTaskComplete({ task: this.task }));
    if (this.link) {
      this.router.navigate([this.link]);
    }
  }
}
