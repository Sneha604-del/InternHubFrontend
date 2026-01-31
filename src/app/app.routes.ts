import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { HomeComponent } from './components/home/home.component';
import { DocumentationComponent } from './components/documentation/documentation.component';
import { ProfileComponent } from './components/profile/profile.component';
import { SecurityComponent } from './components/security/security.component';
import { InternshipsComponent } from './components/internships/internships.component';
import { ApplyComponent } from './components/apply/apply.component';
import { NotificationsComponent } from './components/notifications/notifications.component';
import { HelpSupportComponent } from './components/help-support/help-support.component';
import { FavoritesComponent } from './components/favorites/favorites.component';
import { GroupCreateComponent } from './components/group-create/group-create.component';
import { GroupsListComponent } from './components/groups-list/groups-list.component';
import { GroupDetailsComponent } from './components/group-details/group-details.component';
import { GroupInvitationsComponent } from './components/group-invitations/group-invitations.component';
import { GroupEditComponent } from './components/group-edit/group-edit.component';

import { CompanyJoinComponent } from './components/company-join/company-join.component';
import { CompanySelectionComponent } from './components/company-selection/company-selection.component';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'home', component: HomeComponent },
  { path: 'documentation', component: DocumentationComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'security', component: SecurityComponent },
  { path: 'internships', component: InternshipsComponent },
  { path: 'apply', component: ApplyComponent },
  { path: 'notifications', component: NotificationsComponent },
  { path: 'help-support', component: HelpSupportComponent },
  { path: 'favorites', component: FavoritesComponent },
  { path: 'groups', component: GroupsListComponent },
  { path: 'group-create', component: GroupCreateComponent },
  { path: 'group-edit/:id', component: GroupEditComponent },
  { path: 'group-details/:id', component: GroupDetailsComponent },
  { path: 'group-invitations', component: GroupInvitationsComponent },
  { path: 'company-join', component: CompanyJoinComponent },
  { path: 'company-selection/:groupId', component: CompanySelectionComponent },

];
