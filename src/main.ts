import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { defineCustomElements } from '@ionic/pwa-elements/loader';
import { addIcons } from 'ionicons';
import { starOutline, arrowBackOutline, checkmarkOutline, closeOutline, addOutline, removeOutline } from 'ionicons/icons';

bootstrapApplication(
  AppComponent,
  appConfig
).catch((err) => console.error(err));

addIcons({
  'star-outline': starOutline,
  'arrow-back-outline': arrowBackOutline,
  'checkmark-outline': checkmarkOutline,
  'close-outline': closeOutline,
  'add-outline': addOutline,
  'remove-outline': removeOutline
});

// Carrega os elementos personalizados do Ionic
defineCustomElements(window);
