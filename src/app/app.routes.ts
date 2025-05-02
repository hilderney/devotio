import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent) },
  { path: 'devotional', loadComponent: () => import('./pages/devotional/devotional.component').then(m => m.DevotionalComponent) },
  { path: 'profile', loadComponent: () => import('./pages/profile/profile.component').then(m => m.ProfileComponent) },
  { path: 'settings', loadComponent: () => import('./pages/settings/settings.component').then(m => m.SettingsComponent) },
  { path: 'prayers', loadComponent: () => import('./pages/prayers/prayers.component').then(m => m.PrayersComponent) },
  { path: 'community', loadComponent: () => import('./pages/community/community.component').then(m => m.CommunityComponent) },
  { path: 'feed', loadComponent: () => import('./pages/feed/feed.component').then(m => m.FeedComponent) },
  { path: 'devotional/todays-reflection', loadComponent: () => import('./pages/devotional/components/todays-reflection/todays-reflection.component').then(m => m.TodaysReflectionComponent) },
  { path: 'devotional/todays-verse', loadComponent: () => import('./pages/devotional/components/todays-verse/todays-verse.component').then(m => m.TodaysVerseComponent) },
];
