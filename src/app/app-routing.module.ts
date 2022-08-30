import { Component, NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CompanyComponent } from './components/company/company.component';
import { CustomerComponent } from './components/customer/customer.component';
import { CountryComponent } from './country/country.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DesignationComponent } from './designation/designation.component';
import { DepartmentComponent } from './department/department.component';
import { EmployeesComponent } from './employees/employees.component';
import { PmDashboardComponent } from './pm-dashboard/pm-dashboard.component';
import { AuthGuard } from './guards/auth.guard';
import { LoginComponent } from './login/login.component';
import { ProfileComponent } from './profile/profile.component';
import { ProjectListComponent } from './project-list/project-list.component';
import { RoleComponent } from './role/role.component';
import { StateComponent } from './state/state.component';
import { ProjectEmployeesComponent } from './project-employees/project-employees.component';
import { EmployeesGroupComponent } from './employees-group/employees-group.component';
import { TicketingListComponent } from './ticketing-list/ticketing-list.component';
import { TicketingAddComponent } from './ticketing-add/ticketing-add.component';
import { EmployeeDashboardComponent } from './employee-dashboard/employee-dashboard.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { ClientDashboardComponent } from './client-dashboard/client-dashboard.component';
import { TimeSheetComponent } from './time-sheet/time-sheet.component';
import { CategoryComponent } from './category/category.component';
import { ProjectReportComponent } from './project-report/project-report.component';
import { TimeReportComponent } from './time-report/time-report.component';
import { ClientReportComponent } from './client-report/client-report.component';
import { TicketingDetailsComponent } from './ticketing-details/ticketing-details.component';
//import { EmployeeReportComponent } from './employee-report/employee-report.component';
import { EmployeeReportComponent } from './employee-report/employee-report.component';
import { SummaryReportComponent } from './summary-report/summary-report.component';
import { OtherComponent } from './other/other.component';
import { OrgTicketsComponent } from './org-tickets/org-tickets.component';
import { PracticeComponent } from './practice/practice.component';
import { SubCategoryComponent } from './sub-category/sub-category.component';
const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: 'Dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'company',
    component: CompanyComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'customer',
    component: CustomerComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'employees',
    component: EmployeesComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'projects',
    component: ProjectListComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'role',
    component: RoleComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'state',
    component: StateComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'country',
    component: CountryComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'designation',
    component: DesignationComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'department',
    component: DepartmentComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [AuthGuard],
  },

  {
    path: 'projectEmployees',
    component: ProjectEmployeesComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'employeesGroup',
    component: EmployeesGroupComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'ticketingList',
    component: TicketingListComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'ticketingAdd',
    component: TicketingAddComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'employeeDashboard',
    component: EmployeeDashboardComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'adminDashboard',
    component: AdminDashboardComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'clientDashboard',
    component: ClientDashboardComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'pmDashboard',
    component: PmDashboardComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'timeSheet',
    component: TimeSheetComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'category',
    component: CategoryComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'projectReport',
    component: ProjectReportComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'timeSheetReport',
    component: TimeReportComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'clientReport',
    component: ClientReportComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'ticketingDetails',
    component: TicketingDetailsComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'employeeReport',
    component: EmployeeReportComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'summaryReports',
    component: SummaryReportComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'Other',
    component: OtherComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'orgTickets',
    component: OrgTicketsComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'practice',
    component: PracticeComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'subCategory',
    component: SubCategoryComponent,
    canActivate: [AuthGuard],
  },
  { path: '', redirectTo: 'Dashboard', pathMatch: 'full' },
  { path: '**', redirectTo: 'Dashboard' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
