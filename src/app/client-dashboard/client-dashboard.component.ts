import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EmployeesService } from '../employees/employees.service';
import { ChartType, ChartOptions, ChartDataSets } from 'chart.js';
import {
  SingleDataSet,
  Label,
  monkeyPatchChartJsLegend,
  monkeyPatchChartJsTooltip,
} from 'ng2-charts';
import { EmployeeDashboardService } from '../employee-dashboard/employee.service';
@Component({
  selector: 'app-client-dashboard',
  templateUrl: './client-dashboard.component.html',
  styleUrls: ['./client-dashboard.component.css'],
})
export class ClientDashboardComponent implements OnInit {
  constructor(
    public service: EmployeesService,
    public router: Router,
    public services: EmployeeDashboardService
  ) {
    monkeyPatchChartJsTooltip();
    monkeyPatchChartJsLegend();
  }
  projectsData = [];
  loginName = '';
  clientDashboard = [];
  // Pie
  public pieChartOptions: ChartOptions = {
    responsive: true,
  };
  public pieChartLabels: Label[] = ['Open', 'In Progress', 'Closed'];
  public pieChartData: SingleDataSet = [300, 500, 100];
  public pieChartType: ChartType = 'pie';
  public pieChartLegend = true;
  public pieChartPlugins = [];

  public barChartOptions: ChartOptions = {
    responsive: true,
  };
  public barChartLabels: Label[] = [
    '2015',
    '2016',
    '2017',
    '2018',
    '2019',
    '2020',
    '2021',
  ];
  public barChartType: ChartType = 'bar';
  public barChartLegend = true;
  public barChartPlugins = [];

  public barChartData: ChartDataSets[] = [
    { data: [65, 59, 80, 81, 56, 55, 40], label: 'Customers' },
    { data: [28, 48, 40, 19, 86, 27, 90], label: 'Projects' },
  ];
  ngOnInit() {
    this.loginName = sessionStorage.getItem('name');
    this.getEmpProjectsList();
    this.getClientCount();
  }

  getEmpProjectsList() {
    this.service
      .getEmpProjectsList(sessionStorage.getItem('companyId'))
      .subscribe((data) => {
        if (data['success']) {
          this.projectsData = data['data'];

          console.log(data['data']);
        }
      });
  }

  gotoProjects(item) {
    console.log(item);
    sessionStorage.setItem('companyId', item.company_id);
    sessionStorage.setItem('customerId', item.customer_id);
    sessionStorage.setItem('project_manager', item.project_manager);
    sessionStorage.setItem('projectId', item.id);
    this.router.navigate(['/ticketingList']);
  }

  getClientCount() {
    this.services
      .getClientCount(sessionStorage.getItem('companyId'))
      .subscribe((data) => {
        if (data['success']) {
          console.log(data['data'][0]);
          this.clientDashboard = data['data'][0];
        }
      });
  }
}
