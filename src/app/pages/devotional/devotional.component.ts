import { Component, OnInit } from '@angular/core';
import { PageLayoutComponent } from '../../shared/components/page-layout/page-layout.component';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { SwipeItemComponent } from '../../shared/components/swipe-item/swipe-item.component';
import { DevotionalService } from './devotional.service';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { selectCompletedTasks } from './state/devotional.selectors';
import { TasksEnum } from './state/devotional.models';

@Component({
  selector: 'app-devotional',
  templateUrl: './devotional.component.html',
  styleUrls: ['./devotional.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonicModule,
    PageLayoutComponent,
    SwipeItemComponent]
})
export class DevotionalComponent  implements OnInit {

  taskEnum = TasksEnum;
  tasks: TasksEnum[] = [];
  completedTasks$: Observable<TasksEnum[]>;

  isDevotionalLoaded = false;

  constructor(
    private store: Store,
    private service: DevotionalService) {
    this.completedTasks$ = this.store.select(selectCompletedTasks);
    }

  ngOnInit() {
    // this.reloadTasks();
    this.completedTasks$.subscribe((tasks) => {
      console.log(tasks);
      this.isDevotionalLoaded = true;
    });
  }

  // reloadTasks() {
  //   setTimeout(() => {
  //     this.service.getCompletedTasks().subscribe(response => {
  //       console.log('RESPONSE: ', response);
  //       this.tasks.push(response);
  //       console.log(this.tasks);
  //       this.isDevotionalLoaded = true;
  //     })
  //   }, 1000);
  // }

}
