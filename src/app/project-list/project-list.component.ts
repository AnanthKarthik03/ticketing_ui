import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { Validators } from '@angular/forms';
import { ProjectService } from './project-list.service';
import { ToastrService } from 'ngx-toastr';
import { CompanyService } from '../components/company/company.service';
import { CustomerService } from '../components/customer/customer.service';

import * as _ from 'underscore';

@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.css'],
})
export class ProjectListComponent implements OnInit {
  myForm!: FormGroup;
  submitted = false;
  viewProject = false;
  spinner = false;

  editId = '';
  companyId = '';
  companyData = [];
  companyName = '';
  customerId = '';
  customerData = [];
  customerName = '';
  projectId = '';
  projectData = [];
  projectName = '';
  role = '';
  empId = '';
  constructor(
    private fb: FormBuilder,
    public router: Router,
    public service: ProjectService,
    private toastr: ToastrService,
    public companyService: CompanyService,
    public projectService: ProjectService,
    public customerService: CustomerService
  ) { }

  ngOnInit() {
    this.role = sessionStorage.getItem('role');
    this.empId = sessionStorage.getItem('id');
    this.companyId = sessionStorage.getItem('companyId');
    this.getCompanyById(this.companyId);
    this.customerId = sessionStorage.getItem('customerId');
    this.getCustomerById(this.companyId);
    this.projectId = sessionStorage.getItem('projectId');
    this.getProjectById(this.projectId);
    this.valiDate();
    this.projectGet();
  }
  getCompanyById(id) {
    this.companyService.get_company().subscribe((data) => {
      if (data['success']) {
        this.companyData = data['data'];
        const temp = _.filter(
          this.companyData,
          (item) => parseInt(item.id, 10) === parseInt(id, 10)
        );
        console.log(this.companyName);
        if (temp.length > 0) {
          this.companyName = temp[0].company_name;
        }
      }
    });
  }
  getCustomerById(id) {
    this.customerService.get_customer(id).subscribe((data) => {
      if (data['success']) {
        this.customerData = data['data'];
        const temp = _.filter(
          this.customerData,
          (item) => parseInt(item.id, 10) === parseInt(id, 10)
        );
        console.log(this.customerName);
        if (temp.length > 0) {
          this.customerName = temp[0].company_name;
        }
      }
    });
  }
  getProjectById(id) {
    this.projectService
      .get_project(
        sessionStorage.getItem('companyId'),
        sessionStorage.getItem('customerId')
      )
      .subscribe((data) => {
        if (data['success']) {
          this.projectData = data['data'];
          const temp = _.filter(
            this.projectData,
            (item) => parseInt(item.id, 10) === parseInt(id, 10)
          );
          console.log(this.projectName);
          if (temp.length > 0) {
            this.projectName = temp[0].project_name;
          }
        }
      });
  }
  company() {
    this.router.navigate(['/company']);
  }
  project() {
    this.router.navigate(['/projects']);
  }
  customer() {
    if (this.role === 'Pm') {
      this.router.navigate(['/pmDashboard']);
    } else {
      this.router.navigate(['/customer']);
    }
  }

  showProjectForm() {
    this.viewProject = true;
    this.myForm.reset();
    this.myForm.controls['company_id'].setValue(this.companyId);
    this.myForm.controls['customer_id'].setValue(this.customerId);
  }
  showProjectsList() {
    this.submitted = false;
    this.viewProject = false;
  }
  get f() {
    return this.myForm.controls;
  }
  valiDate() {
    console.log(this.companyId);
    console.log(this.customerId);

    this.myForm = this.fb.group({
      company_id: this.companyId,
      customer_id: this.customerId,
      project_name: ['', Validators.required],
      project_description: ['', Validators.required],
      start_date: ['', Validators.required],
      end_date: ['', Validators.required],
      project_cost: ['', Validators.required],
      ticket_status: ['', Validators.required],
      status: ['', Validators.required],
    });
  }

  projectConfiguration(item) {
    console.log(item);
    sessionStorage.setItem('project_manager', item.project_manager);
    sessionStorage.setItem('projectId', item.id);
    sessionStorage.setItem('customerId', item.customer_id);
    this.router.navigate(['/projectEmployees']);
  }

  onSubmit() {
    this.spinner = true;
    this.submitted = true;
    if (this.myForm.invalid) {
      this.spinner = false;
      return;
    }
    const body = this.myForm.value;
    if (this.editId) {
      body['id'] = this.editId;
    }
    console.log(this.myForm.value);
    this.service.project_add(body).subscribe((data) => {
      if (data['success']) {
        this.spinner = false;
        if (this.editId) {
          this.toastr.success(`Updated Successfully`);
        } else {
          this.toastr.success(`Project Added Successfully`);
        }
        this.myForm.reset();
        this.editId = '';
        this.showProjectsList();
        this.projectGet();
      } else {
        this.toastr.warning(data['message']);
        this.spinner = false;
      }
      // tslint:disable-next-line:no-unused-expression
      (err) => {
        this.spinner = false;
        this.toastr.warning(data['message']);
      };
    });
  }

  projectGet() {
    // this.spinner = true;
    this.projectData = [];
    this.service.get_project(this.companyId, this.customerId).subscribe(
      (data) => {
        if (data['success']) {
          
          this.spinner = false;
          console.log(data['data']);
          if (this.role === 'Pm') {
            this.projectData = _.filter(
              data['data'],
              (item) =>
                parseInt(item.project_manager, 10) === parseInt(this.empId, 10)
            );
          } else {
            this.projectData = data['data'];
          }
        } else {
          this.spinner = false;
        }
      },
      (err) => {
        this.spinner = false;
      }
    );
  }

  edit(item) {
    this.spinner = false;
    console.log(item);
    this.editId = item.id;
    this.showProjectForm();
    this.myForm.patchValue({
      project_name: item.project_name,
      project_description: item.project_description,
      start_date: new Date(item.start_date),
      end_date: new Date(item.end_date),
      project_cost: item.project_cost,
      ticket_status: item.ticket_status.toString(),
      status: item.status,
    });
  }
}
