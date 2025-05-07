import { Component, OnInit } from '@angular/core';
import { PageLayoutComponent } from '../../components/page-layout/page-layout.component';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { SwipeItemComponent } from '../../components/swipe-item/swipe-item.component';
import { DevotionalService } from './devotional.service';
import { TasksEnum } from '../../shared/enums/tasks.enum';

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
  isDevotionalLoaded = false;

  constructor(private service: DevotionalService) { }

  ngOnInit() {
    this.reloadTasks();
  }

  reloadTasks() {
    setTimeout(() => {
      this.service.getCompletedTasks().subscribe(response => {
        console.log('RESPONSE: ', response);
        this.tasks.push(response);
        console.log(this.tasks);
        this.isDevotionalLoaded = true;
      })
    }, 1000);
  }

}
