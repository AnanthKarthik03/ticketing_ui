import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { CustomerService } from "../components/customer/customer.service";
import { ChartType, ChartOptions, ChartDataSets } from "chart.js";
import {
  SingleDataSet,
  Label,
  monkeyPatchChartJsLegend,
  monkeyPatchChartJsTooltip,
} from "ng2-charts";

@Component({
  selector: "app-admin-dashboard",
  templateUrl: "./admin-dashboard.component.html",
  styleUrls: ["./admin-dashboard.component.css"],
})
export class AdminDashboardComponent implements OnInit {
  userName = "";
  roleId = "";
  viewCustomer = false;
  customerData = [];
  constructor(public service: CustomerService, public router: Router) {
    monkeyPatchChartJsTooltip();
    monkeyPatchChartJsLegend();
  }
  companyId = "";
  companiesList = [];
  dashboardCount = [];

  // Pie
  public pieChartOptions: ChartOptions = {
    responsive: true,
  };
  public pieChartLabels: Label[] = ["Employees", "Budget", "Customers"];
  public pieChartData: SingleDataSet = [300, 500, 100];
  public pieChartType: ChartType = "pie";
  public pieChartLegend = true;
  public pieChartPlugins = [];

  public barChartOptions: ChartOptions = {
    responsive: true,
  };
  public barChartLabels: Label[] = [
    "2006",
    "2007",
    "2008",
    "2009",
    "2010",
    "2011",
    "2012",
  ];
  public barChartType: ChartType = "bar";
  public barChartLegend = true;
  public barChartPlugins = [];

  public barChartData: ChartDataSets[] = [
    { data: [65, 59, 80, 81, 56, 55, 40], label: "Companys" },
    { data: [28, 48, 40, 19, 86, 27, 90], label: "Customers" },
  ];
  ngOnInit() {
    this.companyId = sessionStorage.getItem("companyId");
    this.getCustomers();
    this.getDashboardCount();
    this.userName = sessionStorage.getItem("name");
    this.roleId = sessionStorage.getItem("role");
  }

  getCustomers() {
    this.service.get_customer(this.companyId).subscribe((data) => {
      if (data["success"]) {
        this.companiesList = data["data"];
      }
    });
  }

  getDashboardCount() {
    this.service.getCountDashboard(this.companyId).subscribe((data) => {
      if (data["success"]) {
        this.dashboardCount = data["data"][0];
      }
    });
  }

  goto(item) {
    this.router.navigate(["/customer"]);
  }
  showCustomerForm() {
    this.viewCustomer = true;
  }
  showCustomerList() {
    this.viewCustomer = false;
  }
}
