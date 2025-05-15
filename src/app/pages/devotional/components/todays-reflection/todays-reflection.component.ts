import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { Router, RouterModule } from '@angular/router';
import { PageLayoutSimpleComponent } from '../../../../shared/components/page-layout-simple/page-layout-simple.component';
import { TodaysReflectionService } from './todays-reflection.service';
import { TodaysReflection } from './todays-reflection.model';

@Component({
  selector: 'app-todays-reflection',
  standalone: true,
  templateUrl: './todays-reflection.component.html',
  styleUrls: ['./todays-reflection.component.scss'],
  imports: [
    CommonModule,
    IonicModule,
    PageLayoutSimpleComponent,
    RouterModule,
  ],
})
export class TodaysReflectionComponent {
  todaysReflection: any = null;

  constructor(
    private service: TodaysReflectionService,
    private router: Router) { }

  ngOnInit(): void {
    setTimeout(() => {
      this.service.getTodaysReflection().subscribe(response => {
        this.todaysReflection = new TodaysReflection(response);
      })
    }, 1000);
  }

  endTask() {
    // TODO registrar conclusão da task
    this.backToDevotional();
  }

  backToDevotional() {
    this.router.navigate(['./devotional']);
  }

  increaseTextSize() {
    console.log('ChangeTextSize: Increase')
  }
  decreaseTextSize() {
    console.log('ChangeTextSize: Deacrease')
  }
}
