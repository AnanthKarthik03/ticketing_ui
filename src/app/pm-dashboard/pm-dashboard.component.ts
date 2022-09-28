import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { ProjectService } from "../project-list/project-list.service";
import { ChartType, ChartOptions, ChartDataSets } from "chart.js";
import {
  SingleDataSet,
  Label,
  monkeyPatchChartJsLegend,
  monkeyPatchChartJsTooltip,
} from "ng2-charts";
import { PmService } from "./pm.service";
import * as _ from "underscore";

@Component({
  selector: "app-pm-dashboard",
  templateUrl: "./pm-dashboard.component.html",
  styleUrls: ["./pm-dashboard.component.css"],
})
export class PmDashboardComponent implements OnInit {
  constructor(
    public service: ProjectService,
    public router: Router,
    public services: PmService
  ) {
    monkeyPatchChartJsTooltip();
    monkeyPatchChartJsLegend();
  }
  loginName: any;
  empId = "";
  projectsList = [];
  pmDashbordData = [];
  projectsData = [];
  selectEmp = [];

  // Pie
  public pieChartOptions: ChartOptions = {
    responsive: true,
  };
  public pieChartLabels: Label[] = ["Open", "In Progress", "Closed"];
  public pieChartData: SingleDataSet = [300, 500, 100];
  public pieChartType: ChartType = "pie";
  public pieChartLegend = true;
  public pieChartPlugins = [];

  public barChartOptions: ChartOptions = {
    responsive: true,
  };
  public barChartLabels: Label[] = [
    "2015",
    "2016",
    "2017",
    "2018",
    "2019",
    "2020",
    "2021",
  ];
  public barChartType: ChartType = "bar";
  public barChartLegend = true;
  public barChartPlugins = [];
  public barChartLabelsProject: Label[] = [];
  public barChartDataProject: ChartDataSets[] = [{ data: [] }];

  public barChartLabelsTimeSheet: Label[] = [];
  public barChartDataTimeSheet: ChartDataSets[] = [{ data: [] }];

  public barChartData: ChartDataSets[] = [
    { data: [65, 59, 80, 81, 56, 55, 40], label: "Customers" },
    { data: [28, 48, 40, 19, 86, 27, 90], label: "Projects" },
  ];
  ngOnInit() {
    this.getEmpProjectsList();
    this.empId = sessionStorage.getItem("id");
    this.loginName = sessionStorage.getItem("name");
    this.pmDashboardCount();
    this.getProjectsList();
    sessionStorage.setItem("projectId", null);
    sessionStorage.setItem("customerId", null);
  }

  getProjectsList() {
    this.service.getPMProjectsList(this.empId).subscribe((data) => {
      if (data["success"]) {
        this.projectsList = data["data"];
      }
    });
  }

  getEmpProjectsList() {
    this.selectEmp = [];
    this.selectEmp.unshift({
      label: "Filter By project Name",
      value: null,
    });
    this.service
      .getPMProjectsList(sessionStorage.getItem("id"))
      .subscribe((data) => {
        if (data["success"]) {
          this.projectsList = data["data"];
          const filterDataById = _.uniq(data["data"], "id");
          filterDataById.forEach((item) => {
            this.selectEmp.push({
              label: item.project_name,
              value: item.id,
            });
          });
          this.projectReport(this.projectsData[0].id);
          this.timeSheetReport(this.projectsData[0].id);
        }
      });
  }

  pmDashboardCount() {
    this.service.pmDashboardCount(this.empId).subscribe((data) => {
      if (data["success"]) {
        this.pmDashbordData = data["data"];
      }
    });
  }

  goto(item) {
    sessionStorage.setItem("companyId", item.company_id);
    sessionStorage.setItem("customerId", item.customer_id);
    sessionStorage.setItem("project_manager", item.project_manager);
    sessionStorage.setItem("projectId", item.id);
    this.router.navigate(["/ticketingList"]);
  }

  projectReport(e) {
    this.barChartLabelsProject = [];
    this.barChartDataProject = [];

    const id = e;
    // Approved: 0
    // Hold: 1
    // Reopen: 0
    // Resolved: 3
    this.services.projectReport(id).subscribe((data) => {
      if (data["success"]) {
        this.barChartLabelsProject.push(
          "TotalTickets",
          "open",
          "In-Progress",
          "Closed",
          "Awaiting",
          "Approved",
          "Hold",
          "Reopen",
          "Resolved"
        );

        const array = [
          data["data"][0]["totalTickets"],
          data["data"][0]["open"],
          data["data"][0]["inProgress"],
          data["data"][0]["closed"],
          data["data"][0]["Awaiting"],
          data["data"][0]["Approved"],
          data["data"][0]["Hold"],
          data["data"][0]["Reopen"],
          data["data"][0]["Resolved"],
        ];
        this.barChartDataProject = [
          {
            data: array,
            label: "Count",
            backgroundColor: [
              "rgba(255, 99, 132, 0.2)",
              "rgba(54, 162, 235, 0.2)",
              "rgba(255, 206, 86, 0.2)",
              "rgba(75, 192, 192, 0.2)",
              "rgba(153, 102, 255, 0.2)",
              "rgba(255, 159, 64, 0.2)",
            ],
            borderColor: [
              "rgba(255, 99, 132, 1)",
              "rgba(54, 162, 235, 1)",
              "rgba(255, 206, 86, 1)",
              "rgba(75, 192, 192, 1)",
              "rgba(153, 102, 255, 1)",
              "rgba(255, 159, 64, 1)",
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

    const id = e;
    const array = [];
    this.services.timesheetReport(id).subscribe((data) => {
      if (data["success"]) {
        data["data"].forEach((lab) => {
          this.barChartLabelsTimeSheet.push(lab.ticket_no);
          array.push(lab.hrs);
        });

        this.barChartDataTimeSheet = [
          {
            data: array,
            label: "Hours",
            backgroundColor: [
              "rgba(255, 99, 132, 0.2)",
              "rgba(54, 162, 235, 0.2)",
              "rgba(255, 206, 86, 0.2)",
              "rgba(75, 192, 192, 0.2)",
              "rgba(153, 102, 255, 0.2)",
              "rgba(255, 159, 64, 0.2)",
            ],
            borderColor: [
              "rgba(255, 99, 132, 1)",
              "rgba(54, 162, 235, 1)",
              "rgba(255, 206, 86, 1)",
              "rgba(75, 192, 192, 1)",
              "rgba(153, 102, 255, 1)",
              "rgba(255, 159, 64, 1)",
            ],
            borderWidth: 1,
          },
        ];
      }
    });
  }
}
