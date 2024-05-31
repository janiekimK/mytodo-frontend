import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { appCanActivate } from './guard/app.auth.guard';
import { EmployeeListComponent } from './pages/employee-list/employee-list.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { NoAccessComponent } from './pages/no-access/no-access.component';
import { AppRoles } from '../app.roles';
import { EmployeeDetailComponent } from './pages/employee-detail/employee-detail.component';

const routes: Routes = [
  { path: '', component: DashboardComponent },
  { path: 'dashboard', component: DashboardComponent },
  {
    path: 'vehicles',
    component: VehicleListComponent,
    canActivate: [appCanActivate],
    data: { roles: [AppRoles.Read] },
  },
  {
    path: 'vehicle',
    canActivate: [appCanActivate],
    component: VehicleDetailComponent,
    pathMatch: 'full',
    data: { roles: [AppRoles.Admin] },
  },
  {
    path: 'vehicle/:id',
    canActivate: [appCanActivate],
    component: VehicleDetailComponent,
    pathMatch: 'full',
    data: { roles: [AppRoles.Admin] },
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
    path: 'departments',
    component: DepartmentListComponent,
    canActivate: [appCanActivate],
    data: { roles: [AppRoles.Read] },
  },
  {
    path: 'department',
    canActivate: [appCanActivate],
    component: DepartmentDetailComponent,
    pathMatch: 'full',
    data: { roles: [AppRoles.Admin] },
  },
  {
    path: 'department/:id',
    canActivate: [appCanActivate],
    component: DepartmentDetailComponent,
    pathMatch: 'full',
    data: { roles: [AppRoles.Admin] },
  },
  {
    path: 'vehicle-usages',
    component: VehicleUsageListComponent,
    canActivate: [appCanActivate],
    data: { roles: [AppRoles.Read] },
  },
  {
    path: 'vehicle-usage',
    canActivate: [appCanActivate],
    component: VehicleUsageDetailComponent,
    pathMatch: 'full',
    data: { roles: [AppRoles.Update] },
  },
  {
    path: 'vehicle-usage/:id',
    canActivate: [appCanActivate],
    component: VehicleUsageDetailComponent,
    pathMatch: 'full',
    data: { roles: [AppRoles.Update] },
  },
  { path: 'noaccess', component: NoAccessComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
