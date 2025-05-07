import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { Router, RouterModule } from '@angular/router';
import { PageLayoutSimpleComponent } from '../../../../components/page-layout-simple/page-layout-simple.component';
import { TodaysVerseService } from './todays-verse.service';
import { ITodaysVerse, TodaysVerse } from './todays-verse.model';

@Component({
  selector: 'app-todays-verse',
  standalone: true,
  templateUrl: './todays-verse.component.html',
  styleUrls: ['./todays-verse.component.scss'],
  imports: [
    CommonModule,
    IonicModule,
    PageLayoutSimpleComponent,
    RouterModule,
  ],
})
export class TodaysVerseComponent {
  todaysVerse!: ITodaysVerse;
  textSize = 16;

  constructor(
    private router: Router,
    private service: TodaysVerseService) { }

  ngOnInit(): void {
    // Simula chamada de API
    setTimeout(() => {
      this.service.getTodaysVerse().subscribe(response => {
        this.todaysVerse = new TodaysVerse(response);
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



