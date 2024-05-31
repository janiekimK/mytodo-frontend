import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { appCanActivate } from './guard/app.auth.guard';
import { EmployeeListComponent } from './pages/employee-list/employee-list.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { NoAccessComponent } from './pages/no-access/no-access.component';
import { AppRoles } from '../app.roles';
import { EmployeeDetailComponent } from './pages/employee-detail/employee-detail.component';
import { TagListComponent } from './pages/tag-list/tag-list.component';
import { TagDetailComponent } from './pages/tag-detail/tag-detail.component';
import { FolderListComponent } from './pages/folder-list/folder-list.component';
import { TaskListComponent } from './pages/task-list/task-list.component';
import { TaskDetailComponent } from './pages/task-detail/task-detail.component';

const routes: Routes = [
  { path: '', component: DashboardComponent },
  { path: 'dashboard', component: DashboardComponent },
  {
    path: 'tags',
    component: TagListComponent,
    canActivate: [appCanActivate],
    data: { roles: [AppRoles.Read] },
  },
  {
    path: 'tag',
    canActivate: [appCanActivate],
    component: TagDetailComponent,
    pathMatch: 'full',
    data: { roles: [AppRoles.Update] },
  },
  {
    path: 'tag/:id',
    canActivate: [appCanActivate],
    component: TagDetailComponent,
    pathMatch: 'full',
    data: { roles: [AppRoles.Update] },
  },
  {
    path: 'employees',
    component: EmployeeListComponent,
    canActivate: [appCanActivate],
    data: { roles: [AppRoles.Read] },
  },
  {
    path: 'employee',
    canActivate: [appCanActivate],
    component: EmployeeDetailComponent,
    pathMatch: 'full',
    data: { roles: [AppRoles.Admin] },
  },
  {
    path: 'employee/:id',
    canActivate: [appCanActivate],
    component: EmployeeDetailComponent,
    pathMatch: 'full',
    data: { roles: [AppRoles.Admin] },
  },
  {
    path: 'folders',
    component: FolderListComponent,
    canActivate: [appCanActivate],
    data: { roles: [AppRoles.Read] },
  },
  {
    path: 'folder',
    canActivate: [appCanActivate],
    component: FolderListComponent,
    pathMatch: 'full',
    data: { roles: [AppRoles.Admin] },
  },
  {
    path: 'folder/:id',
    canActivate: [appCanActivate],
    component: FolderListComponent,
    pathMatch: 'full',
    data: { roles: [AppRoles.Admin] },
  },
  { path: 'noaccess', component: NoAccessComponent },
  {
    path: 'tasks',
    component: TaskListComponent,
    canActivate: [appCanActivate],
    data: { roles: [AppRoles.Read] },
  },
  {
    path: 'task',
    canActivate: [appCanActivate],
    component: TaskDetailComponent,
    pathMatch: 'full',
    data: { roles: [AppRoles.Admin] },
  },
  {
    path: 'task/:id',
    canActivate: [appCanActivate],
    component: TaskDetailComponent,
    pathMatch: 'full',
    data: { roles: [AppRoles.Admin] },
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
