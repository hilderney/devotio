import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { Router, RouterModule } from '@angular/router';
import { PageLayoutSimpleComponent } from '../../../../components/page-layout-simple/page-layout-simple.component';

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

  constructor(private router: Router) { }

  ngOnInit(): void {
    // Simula chamada de API
    setTimeout(() => {
      this.todaysReflection = mock;
    }, 1000);
  }

  backToDevotional() {
    this.router.navigate(['./devotional']);
  }
}


const mock = {
  title: 'Confiança em Deus',
  author: 'Equipe Devotio',
  reflection: 'Muitas vezes queremos controlar tudo, mas a verdadeira paz vem quando entregamos nossos caminhos a Deus.',
  verse: 'Salmos 37:5',
  text: 'Entrega o teu caminho ao Senhor; confia nele, e o mais ele fará.',
}
