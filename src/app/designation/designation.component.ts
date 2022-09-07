import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { DesignationService } from './designation.service';
import { XlsxToJsonService } from '../xlsx-to-json-service';
import * as _ from 'underscore';
declare var $: any;

@Component({
  selector: 'app-designation',
  templateUrl: './designation.component.html',
  styleUrls: ['./designation.component.css'],
})
export class DesignationComponent implements OnInit {
  designationForm!: FormGroup;
  submitted = false;
  spinner = false;
  designationData = [];
  editId = '';
  excelData = [];
  finalExcelData = [];
  fileUpload = '';
  private xlsxToJsonService: XlsxToJsonService = new XlsxToJsonService();
  constructor(
    private fb: FormBuilder,
    private toastr: ToastrService,
    public service: DesignationService
  ) { }

  ngOnInit() {
    this.designationForm = this.fb.group({
      designation: ['', Validators.required],
      status: ['', Validators.required],
    });
    this.getDesignation();
  }

  getDesignation() {
    this.designationData = [];
    this.spinner = true;
    this.service.get_designation().subscribe(
      (data) => {
        if (data['success']) {
           this.designationData = data['data'];
           setTimeout(() => {
            this.designationData.forEach((ele) => (ele.id = ele.id));
            this.designationData.forEach((ele) => (ele.status = ele.status));
            this.designationData.forEach((ele) => (ele.status_name = ele.status === 0 ? 'Active' : 'In Active')
            );
            this.designationData.forEach((ele) => (ele.designation = ele.designation));
           
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
    return this.designationForm.controls;
  }
  onSubmit() {
    this.spinner = true;
    this.submitted = true;
    if (this.designationForm.invalid) {
      $('#large-Modal').modal('show');
      this.spinner = false;
      return;
    }
    console.log(this.designationForm.value);
    const body = this.designationForm.value;
    body.status = JSON.parse(body.status);
    if (this.editId) {
      body['id'] = this.editId;
    }
    this.service.add_designation(body).subscribe(
      (data) => {
        console.log(data['data']);
        if (data['success']) {
          this.spinner = false;
          if (this.editId) {
            this.toastr.success(`Updated Successfully`);
          } else {
            this.toastr.success(`Designation Added Successfully`);
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
  desgAdd() {
    this.designationForm.reset();
    this.editId = '';
  }
  clear() {
    this.designationForm.reset();
    this.editId = '';
    this.getDesignation();
    this.spinner = false;
    this.submitted = false;
    this.fileUpload = '';
  }

  edit(item) {
    this.spinner = false;
    this.editId = item.id;
    this.designationForm.patchValue({
      designation: item.designation,
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
          designation: ele.designation,
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

  designationUpload() {
    this.service.add_designation(this.finalExcelData).subscribe(
      (data1) => {
        if (data1['success']) {
          // this.back();
          this.toastr.success('Bulk Designation Added Succefully');
          this.getDesignation();
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
