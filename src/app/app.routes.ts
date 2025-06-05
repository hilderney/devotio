import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent),
  },
  {
    path: '',
    loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent),
    canActivate: [authGuard]
  },
  {
    path: 'devotional',
    loadComponent: () => import('./pages/devotional/devotional.component').then(m => m.DevotionalComponent),
    canActivate: [authGuard]
  },
  {
    path: 'profile',
    loadComponent: () => import('./pages/profile/profile.component').then(m => m.ProfileComponent),
    canActivate: [authGuard]
  },
  {
    path: 'settings',
    loadComponent: () => import('./pages/settings/settings.component').then(m => m.SettingsComponent),
    canActivate: [authGuard]
  },
  {
    path: 'prayers',
    loadComponent: () => import('./pages/prayers/prayers.component').then(m => m.PrayersComponent),
    canActivate: [authGuard]
  },
  {
    path: 'community',
    loadComponent: () => import('./pages/community/community.component').then(m => m.CommunityComponent),
    canActivate: [authGuard]
  },
  {
    path: 'feed',
    loadComponent: () => import('./pages/feed/feed.component').then(m => m.FeedComponent),
    canActivate: [authGuard]
  },
  {
    path: 'devotional/todays-reflection',
    loadComponent: () => import('./pages/devotional/components/todays-reflection/todays-reflection.component').then(m => m.TodaysReflectionComponent),
    canActivate: [authGuard]
  },
  {
    path: 'devotional/todays-verse',
    loadComponent: () => import('./pages/devotional/components/todays-verse/todays-verse.component').then(m => m.TodaysVerseComponent),
    canActivate: [authGuard]
  },
];
