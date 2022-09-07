import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { RoleService } from './role.service';
import { XlsxToJsonService } from '../xlsx-to-json-service';
import * as _ from 'underscore';

declare var $: any;
@Component({
  selector: 'app-role',
  templateUrl: './role.component.html',
  styleUrls: ['./role.component.css'],
})
export class RoleComponent implements OnInit {
  rolesForm!: FormGroup;
  submitted = false;
  spinner = false;
  rolesList = [];
  editId = '';
  fileUpload = '';
  excelData = [];
  finalExcelData = [];

  private xlsxToJsonService: XlsxToJsonService = new XlsxToJsonService();
  constructor(
    private fb: FormBuilder,
    private toastr: ToastrService,
    public service: RoleService
  ) { }

  ngOnInit() {
    this.rolesForm = this.fb.group({
      role: ['', Validators.required],
      status: ['', Validators.required],
    });
    this.getRoles();
  }

  getRoles() {
    this.rolesList = [];
    this.spinner = true;
    this.service.get_role().subscribe(
      (data) => {
        if (data['success']) {
           this.rolesList = data["data"];
           setTimeout(() => {
            this.rolesList.forEach((ele) => (ele.id = ele.id));
            this.rolesList.forEach((ele) => (ele.status = ele.status));
            this.rolesList.forEach((ele) => (ele.status_name = ele.status === 0 ? 'Active' : 'In Active')
            );
            this.rolesList.forEach((ele) => (ele.role = ele.role));
            }, 200);
         
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

  get f() {
    return this.rolesForm.controls;
  }
  onSubmit() {
    this.spinner = true;
    this.submitted = true;
    if (this.rolesForm.invalid) {
      $('#large-Modal').modal('show');
      // this.spinner = false;
      return;
    }
    console.log(this.rolesForm.value);
    const body = this.rolesForm.value;
    body.status = JSON.parse(body.status);
    if (this.editId) {
      body['id'] = this.editId;
    }
    this.service.add_role(body).subscribe(
      (data) => {
        console.log(data['data']);
        if (data['success']) {
          this.spinner = false;
          if (this.editId) {
            this.toastr.success(`Updated Successfully`);
          } else {
            this.toastr.success(`Role Added Successfully`);
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

  clear() {
    this.rolesForm.reset();
    this.editId = '';
    this.getRoles();
    this.spinner = false;
    this.submitted = false;
    this.fileUpload = '';
  }
  edit(item) {
    this.spinner = false;
    this.editId = item.id;
    this.rolesForm.patchValue({
      role: item.role,
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
          // status_name: ele.status === 0 ? 'Active' : 'In Active',
          role: ele.role,
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

  roleUpload() {
    this.service.add_role(this.finalExcelData).subscribe(
      (data1) => {
        if (data1['success']) {
          // this.back();
          this.toastr.success('Bulk Roles Added Succefully');
          this.getRoles();
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
