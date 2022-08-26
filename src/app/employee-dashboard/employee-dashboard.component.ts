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
import { EmployeeDashboardService } from './employee.service';
import * as _ from 'underscore';

@Component({
  selector: 'app-employee-dashboard',
  templateUrl: './employee-dashboard.component.html',
  styleUrls: ['./employee-dashboard.component.css'],
})
export class EmployeeDashboardComponent implements OnInit {
  selectEmp = [];
  constructor(
    public service: EmployeesService,
    public router: Router,
    public services: EmployeeDashboardService
  ) {
    monkeyPatchChartJsTooltip();
    monkeyPatchChartJsLegend();
  }

  public barChartOptions: ChartOptions = {
    responsive: true,
    animation: {
      onComplete: function () {
        const chartInstance = this.chart,
          ctx = chartInstance.ctx;

        ctx.textAlign = 'center';
        ctx.textBaseline = 'bottom';

        this.data.datasets.forEach(function (dataset, i) {
          const meta = chartInstance.controller.getDatasetMeta(i);
          meta.data.forEach(function (bar, index) {
            const data = dataset.data[index];
            ctx.fillText(data, bar._model.x, bar._model.y - 5);
          });
        });
      },
    },

    scales: {
      yAxes: [
        {
          display: true,
          ticks: {
            suggestedMin: 0, // minimum will be 0, unless there is a lower value.
            // OR //
            beginAtZero: true, // minimum value will be 0.
          },
        },
      ],
    },
    plugins: {
      datalabels: {
        anchor: 'end',
        align: 'top',
        formatter: Math.round,
        font: {
          weight: 'bold',
        },
      },
    },
  };
  public barChartType: ChartType = 'bar';
  public barChartLegend = true;
  public barChartPlugins = [];
  public barChartLabelsProject: Label[] = [];
  public barChartDataProject: ChartDataSets[] = [{ data: [] }];

  public barChartLabelsTimeSheet: Label[] = [];
  public barChartDataTimeSheet: ChartDataSets[] = [{ data: [] }];

  projectsData = [];
  loginName = '';
  employeeDashboard = [];
  ngOnInit() {
    this.getEmpProjectsList();
    this.loginName = sessionStorage.getItem('name');
    this.getEmployeeCount();
  }

  getEmpProjectsList() {
    this.selectEmp = [];
    this.selectEmp.unshift(
      {
        label: 'Filter By project Name',
        value: null,
      },
    );
    this.service
      .getEmpProjectsList(sessionStorage.getItem('id'))
      .subscribe((data) => {
        if (data['success']) {
          this.projectsData = data['data'];
          const filterDataById = _.uniq(data['data'], 'id');
          filterDataById.forEach((item) => {
            this.selectEmp.push({
              label: item.project_name,
              value: item.id,
            });
          });
          this.projectReport(this.projectsData[0].id);
          this.timeSheetReport(this.projectsData[0].id);

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

  getEmployeeCount() {
    this.services
      .getEmployeeCount(sessionStorage.getItem('id'))
      .subscribe((data) => {
        if (data['success']) {
          console.log(data['data'][0]);
          this.employeeDashboard = data['data'][0];
        }
      });
  }

  projectReport(e) {
    this.barChartLabelsProject = [];
    this.barChartDataProject = [];
    console.log(e);
    const id = e;
    // Approved: 0
    // Hold: 1
    // Reopen: 0
    // Resolved: 3
    this.service.projectReport(id).subscribe((data) => {
      if (data['success']) {
        this.barChartLabelsProject.push(
          'TotalTickets',
          'open',
          'In-Progress',
          'Closed',
          'Awaiting',
          'Approved',
          'Hold',
          'Reopen',
          'Resolved'
        );

        const array = [
          data['data'][0]['totalTickets'],
          data['data'][0]['open'],
          data['data'][0]['inProgress'],
          data['data'][0]['closed'],
          data['data'][0]['Awaiting'],
          data['data'][0]['Approved'],
          data['data'][0]['Hold'],
          data['data'][0]['Reopen'],
          data['data'][0]['Resolved'],
        ];
        this.barChartDataProject = [
          {
            data: array,
            label: 'Count',
            backgroundColor: [
              'rgba(255, 99, 132, 0.2)',
              'rgba(54, 162, 235, 0.2)',
              'rgba(255, 206, 86, 0.2)',
              'rgba(75, 192, 192, 0.2)',
              'rgba(153, 102, 255, 0.2)',
              'rgba(255, 159, 64, 0.2)',
            ],
            borderColor: [
              'rgba(255, 99, 132, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(75, 192, 192, 1)',
              'rgba(153, 102, 255, 1)',
              'rgba(255, 159, 64, 1)',
            ],
            borderWidth: 1,
          },
        ];
      }
    });
  }
  timeSheetReport(e) {
    this.barChartLabelsTimeSheet = [];
    this.barChartDataTimeSheet = [];
    console.log(e);
    const id = e;
    const array = [];
    this.service.timesheetReport(id).subscribe((data) => {
      if (data['success']) {
        data['data'].forEach((lab) => {
          this.barChartLabelsTimeSheet.push(lab.ticket_no);
          array.push(lab.hrs);
        });

        this.barChartDataTimeSheet = [
          {
            data: array,
            label: 'Hours',
            backgroundColor: [
              'rgba(255, 99, 132, 0.2)',
              'rgba(54, 162, 235, 0.2)',
              'rgba(255, 206, 86, 0.2)',
              'rgba(75, 192, 192, 0.2)',
              'rgba(153, 102, 255, 0.2)',
              'rgba(255, 159, 64, 0.2)',
            ],
            borderColor: [
              'rgba(255, 99, 132, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(75, 192, 192, 1)',
              'rgba(153, 102, 255, 1)',
              'rgba(255, 159, 64, 1)',
            ],
            borderWidth: 1,
          },
        ];
      }
    });
  }
}
