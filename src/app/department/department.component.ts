import { Component, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { DepartmentService } from './department.service';
import { XlsxToJsonService } from '../xlsx-to-json-service';
import * as _ from 'underscore';
declare var $: any;
@Component({
  selector: 'app-department',
  templateUrl: './department.component.html',
  styleUrls: ['./department.component.css'],
})
export class DepartmentComponent implements OnInit {
  constructor(
    private fb: FormBuilder,
    private service: DepartmentService,
    private toastr: ToastrService
  ) {}
  myForm = new FormGroup({});
  depData: any = [];
  editId = '';
  spinner = false;
  submitted = false;
  file = '';
  excelData = [];
  finalExcelData = [];
  private xlsxToJsonService: XlsxToJsonService = new XlsxToJsonService();
  ngOnInit() {
    this.myForm = this.fb.group({
      dept_name: ['', Validators.required],
      status: ['', Validators.required],
    });
    this.departmentDetails();
  }
  get m() {
    return this.myForm.controls;
  }
  departmentForm() {
    this.spinner = true;
    this.submitted = true;
    if (this.myForm.invalid) {
      $('#large-Modal').modal('show');
      this.spinner = false;
      return;
    }
    console.log(this.myForm.value);
    const body = this.myForm.value;
    body.status = JSON.parse(body.status);
    if (this.editId) {
      body['id'] = this.editId;
    }
    this.service.departmentDetailSend(body).subscribe(
      (data) => {
        console.log(data['data']);
        if (data['success']) {
          this.spinner = false;
          if (this.editId) {
            this.toastr.success(`Updated Successfully`);
          } else {
            this.toastr.success(`Department Added Successfully`);
          }

          $('#large-Modal').modal('hide');
          this.clear();
        } else {
          this.spinner = false;
          this.toastr.error(data['message']);
        }
      },
      (err) => {
        this.spinner = false;
      }
    );
  }
  deptAdd() {
    this.myForm.reset();
    this.editId = '';
  }
  departmentDetails() {
    this.depData = [];
    this.spinner = true;
    this.service.get_department().subscribe(
      (data) => {
        if (data['success']) {
         this.depData = data['data'];
         setTimeout(() => {
          this.depData.forEach((ele) => (ele.id = ele.id));
          this.depData.forEach((ele) => (ele.status = ele.status));
          this.depData.forEach((ele) => (ele.status_name = ele.status === 0 ? 'Active' : 'In Active')
          );
          this.depData.forEach((ele) => (ele.dept_name = ele.dept_name));
         
        }, 200);
          console.log(this.depData);
          this.spinner = false;
        } else {
          console.log(data['message']);
          this.spinner = false;
        }
      },
      (err) => {
        this.spinner = false;
      }
    );
  }
  clear() {
    this.myForm.reset();
    this.file = '';
    this.editId = '';
    this.departmentDetails();
    this.spinner = false;
    this.submitted = false;
  }
  edit(item) {
    this.spinner = false;
    this.editId = item.id;
    this.myForm.patchValue({
      dept_name: item.dept_name,
      status: item.status,
    });
  }

  handleFile(event) {
    // console.log(event);
    this.excelData = [];
    let result1 = [];
    if (event) {
      // console.log(`1`);
    }

    const file = event.target.files[0];
    // console.log(file);

    this.xlsxToJsonService.processFileToJson({}, file).subscribe((data) => {
      // console.log(data);
      this.excelData = data['sheets']['Sheet1'];
      result1 = _.toArray(this.excelData);
      // console.log(result1);

      result1.forEach((ele) => {
        this.finalExcelData.push({
              status: ele.status,
              // status_name : ele.status === 0 ? "Active" : "In Active",
              dept_name: ele.dept_name,
        });
      });

      console.log(this.finalExcelData);
      setTimeout(() => {
        event = null;
      }, 3000);

      // this.saveExcel();
    });
    // }
  }
  departmentUpload(){
    this.service.departmentDetailSend(this.finalExcelData).subscribe(
      (data1) => {
        if (data1['success']) {
          this.departmentDetails();
          // this.back();
          this.toastr.success('Bulk Department Added Succefully');
          this.clear();
        } else {
          return this.toastr.error(data1['message']);
        }
      },
      (error) => {
        this.toastr.error('Network Error');
      }
    );
  }
}
