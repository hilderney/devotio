import { ApplicationConfig, importProvidersFrom, isDevMode } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideIonicAngular } from '@ionic/angular/standalone';
import { provideServiceWorker } from '@angular/service-worker';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { devotionalFeatureKey, devotionalReducer } from './pages/devotional/state/devotional.reducer';
import { DevotionalEffects } from './pages/devotional/state/devotional.effects';
import { HttpClientModule } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideIonicAngular({}),
    provideServiceWorker('ngsw-worker.js', {
        enabled: !isDevMode(),
        registrationStrategy: 'registerWhenStable:30000'
    }),
    provideStore({ [devotionalFeatureKey]: devotionalReducer }),
    provideEffects([DevotionalEffects]),
    provideStoreDevtools({ maxAge: 25 }),
    importProvidersFrom(HttpClientModule)
  ]
};
