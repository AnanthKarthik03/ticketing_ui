import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { OtherService } from './other.service';
import { XlsxToJsonService } from '../xlsx-to-json-service';
import * as _ from 'underscore';
declare var $: any;
@Component({
  selector: 'app-other',
  templateUrl: './other.component.html',
  styleUrls: ['./other.component.css']
})
export class OtherComponent implements OnInit {

  otherForm!: FormGroup;
  submitted = false;
  spinner = false;
  otherList = [];
  editId = '';
  fileUpload = '';
  excelData = [];
  finalExcelData = [];

  private xlsxToJsonService: XlsxToJsonService = new XlsxToJsonService();
  constructor(
    private fb: FormBuilder,
    private toastr: ToastrService,
    public service: OtherService
  ) { }

  ngOnInit() {
    this.otherForm = this.fb.group({
      others: ['', Validators.required],
      status: ['', Validators.required],
    });
    this.getOther();
  }

  getOther() {
    this.otherList = [];
    this.spinner = true;
    this.service.get_other().subscribe(
      (data) => {
        if (data['success']) {
          this.otherList = data["data"];
          setTimeout(() => {
            
          }, 200);
          data['data'].forEach((ele) => {
            this.otherList.push({
              id: ele.id,
              status: ele.status,
              status_name: ele.status === 0 ? 'Active' : 'In Active',
              others: ele.others,
            });
          });
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
    return this.otherForm.controls;
  }
  onSubmit() {
    this.spinner = true;
    this.submitted = true;
    if (this.otherForm.invalid) {
      $('#large-Modal').modal('show');
      // this.spinner = false;
      return;
    }
    console.log(this.otherForm.value);
    const body = this.otherForm.value;
    body.status = JSON.parse(body.status);
    if (this.editId) {
      body['id'] = this.editId;
    }
    this.service.add_other(body).subscribe(
      (data) => {
        console.log(data['data']);
        if (data['success']) {
          this.spinner = false;
          if (this.editId) {
            this.toastr.success(`Updated Successfully`);
          } else {
            this.toastr.success(`Other Added Successfully`);
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
    this.otherForm.reset();
    this.editId = '';
    this.getOther();
    this.spinner = false;
    this.submitted = false;
    this.fileUpload = '';
  }
  edit(item) {
    this.spinner = false;
    this.editId = item.id;
    this.otherForm.patchValue({
      others: item.others,
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
          other: ele.other,
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

  otherUpload() {
    this.service.add_other(this.finalExcelData).subscribe(
      (data1) => {
        if (data1['success']) {
          // this.back();
          this.toastr.success('Bulk Other Added Succefully');
          this.getOther();
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
