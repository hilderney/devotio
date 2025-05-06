import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { Router, RouterModule } from '@angular/router';
import { PageLayoutSimpleComponent } from '../../../../components/page-layout-simple/page-layout-simple.component';
import { TodaysVerseService } from './todays-verse.service';

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
  todaysVerse: any = null;
  textSize: number = 16;

  constructor(
    private router: Router,
    private service: TodaysVerseService) { }

  ngOnInit(): void {
    // Simula chamada de API
    setTimeout(() => {
      this.service.getTodaysVerse().subscribe(res => {
        this.todaysVerse = res;
      })
    }, 1000);
  }

  backToDevotional() {
    this.router.navigate(['./devotional']);
  }

  decreaseTextSize() {
    this.textSize = Math.max(this.textSize - 2, 12); // Limita o tamanho mínimo
    document.documentElement.style.setProperty('--font-size', `${this.textSize}px`);
  }

  increaseTextSize() {
    this.textSize = Math.min(this.textSize + 2, 32); // Limita o tamanho máximo
    document.documentElement.style.setProperty('--font-size', `${this.textSize}px`);
  }
}



