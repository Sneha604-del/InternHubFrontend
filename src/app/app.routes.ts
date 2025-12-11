import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { HomeComponent } from './components/home/home.component';
import { DocumentationComponent } from './components/documentation/documentation.component';
import { ProfileComponent } from './components/profile/profile.component';
import { InternshipsComponent } from './components/internships/internships.component';
import { ApplyComponent } from './components/apply/apply.component';
import { NotificationsComponent } from './components/notifications/notifications.component';
import { HelpSupportComponent } from './components/help-support/help-support.component';
import { FavoritesComponent } from './components/favorites/favorites.component';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'home', component: HomeComponent },
  { path: 'documentation', component: DocumentationComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'internships', component: InternshipsComponent },
  { path: 'apply', component: ApplyComponent },
  { path: 'notifications', component: NotificationsComponent },
  { path: 'help-support', component: HelpSupportComponent },
  { path: 'favorites', component: FavoritesComponent }
];
