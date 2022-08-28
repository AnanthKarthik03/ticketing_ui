import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginComponent } from './login/login.component';
import { HeaderComponent } from './header/header.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { CompanyComponent } from './components/company/company.component';
import { CalendarModule } from 'primeng/calendar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { RadioButtonModule } from 'primeng/radiobutton';
import { TableModule } from 'primeng/table';
import { MultiSelectModule } from 'primeng/multiselect';
import { SliderModule } from 'primeng/slider';
import { ProgressBarModule } from 'primeng/progressbar';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { CustomerComponent } from './components/customer/customer.component';
import { CustomerSidebarComponent } from './customer-sidebar/customer-sidebar.component';
import { EmployeesComponent } from './employees/employees.component';
import { ProfileComponent } from './profile/profile.component';
import { GenderPipe } from './pipes/gender.pipe';
import { DataTableModule } from 'ng-angular8-datatable';
import { ProjectListComponent } from './project-list/project-list.component';
import { SettingSidebarComponent } from './setting-sidebar/setting-sidebar.component';
import { RoleComponent } from './role/role.component';
import { StateComponent } from './state/state.component';
import { CountryComponent } from './country/country.component';
import { DesignationComponent } from './designation/designation.component';
import { DepartmentComponent } from './department/department.component';
import { ProjectEmployeesComponent } from './project-employees/project-employees.component';
import { EmployeesGroupComponent } from './employees-group/employees-group.component';
import { ProjectSidebarComponent } from './project-sidebar/project-sidebar.component';
import { TicketingListComponent } from './ticketing-list/ticketing-list.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { TicketingAddComponent } from './ticketing-add/ticketing-add.component';
import { EmployeeDashboardComponent } from './employee-dashboard/employee-dashboard.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { ClientDashboardComponent } from './client-dashboard/client-dashboard.component';
import { PmDashboardComponent } from './pm-dashboard/pm-dashboard.component';
import { TimeSheetComponent } from './time-sheet/time-sheet.component';
import { ChartsModule } from 'ng2-charts';
import { FullCalendarModule } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import timeGridPlugin from '@fullcalendar/timegrid';
import { CategoryComponent } from './category/category.component';
import { ProjectReportComponent } from './project-report/project-report.component';
import { ClientReportComponent } from './client-report/client-report.component';
import { TimeReportComponent } from './time-report/time-report.component';
import { TicketingDetailsComponent } from './ticketing-details/ticketing-details.component';
//import { EmployeeReportComponent } from './employee-report/employee-report.component';
import { EmployeeReportComponent } from './employee-report/employee-report.component';
import { SummaryReportComponent } from './summary-report/summary-report.component';
import { OtherComponent } from './other/other.component';
import { ProjectSummaryComponent } from './project-summary/project-summary.component';
import { OrgTicketsComponent } from './org-tickets/org-tickets.component';

FullCalendarModule.registerPlugins([
  dayGridPlugin,
  interactionPlugin,
  listPlugin,
  timeGridPlugin
]);
@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    LoginComponent,
    HeaderComponent,
    SidebarComponent,
    CompanyComponent,
    CustomerComponent,
    CustomerSidebarComponent,
    ProfileComponent,
    EmployeesComponent,
    GenderPipe,
    ProjectListComponent,
    SettingSidebarComponent,
    RoleComponent,
    StateComponent,
    CountryComponent,
    DesignationComponent,
    DepartmentComponent,
    ProjectEmployeesComponent,
    EmployeesGroupComponent,
    ProjectSidebarComponent,
    TicketingListComponent,
    TicketingAddComponent,
    EmployeeDashboardComponent,
    AdminDashboardComponent,
    ClientDashboardComponent,
    PmDashboardComponent,
    TimeSheetComponent,
    CategoryComponent,
    ProjectReportComponent,
    ClientReportComponent,
    TimeReportComponent,
    TicketingDetailsComponent,
    EmployeeReportComponent,
    SummaryReportComponent,
    OtherComponent,
    ProjectSummaryComponent,
    OrgTicketsComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    DropdownModule,
    InputTextModule,
    InputTextareaModule,
    RadioButtonModule,
    CalendarModule,
    DataTableModule,
    TableModule,
    MultiSelectModule,
    SliderModule,
    FullCalendarModule ,
    ProgressBarModule,
    ChartsModule,
    ToastrModule.forRoot(),
    NgMultiSelectDropDownModule.forRoot(),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
