import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import * as _ from 'underscore';
import { CategoryService } from '../category/category.service';
import { XlsxToJsonService } from '../xlsx-to-json-service';
import { ExcelService } from 'src/app/excel.service';
import * as moment from 'moment';
//import { Console } from "console";
declare var $: any;
@Component({
  selector: 'app-practice',
  templateUrl: './practice.component.html',
  styleUrls: ['./practice.component.css']
})
export class PracticeComponent implements OnInit {

  practiceForm!: FormGroup;
  submitted = false;
  spinner = false;
  practiceList = [];
  editId = '';
  fileUpload = '';
  excelData = [];
  finalExcelData = [];

  private xlsxToJsonService: XlsxToJsonService = new XlsxToJsonService();
  constructor(
    private fb: FormBuilder,
    private toastr: ToastrService,
    public service: CategoryService,
    private excelService: ExcelService,
  ) { }

  ngOnInit() {
    this.practiceForm = this.fb.group({
      practice: ['', Validators.required],
      status: ['', Validators.required],
    });
    this.getPractice();
  }
  getPractice() {
    this.practiceList = [];
    this.spinner = true;
    this.service.get_practice().subscribe(
      (data) => {
        if (data['success']) {
           this.practiceList = data['data'];
           setTimeout(() => {
            this.practiceList.forEach((ele) => (ele.id = ele.id));
            this.practiceList.forEach((ele) => (ele.status = ele.status));
            this.practiceList.forEach((ele) => (ele.status_name = ele.status === 0 ? 'Active' : 'In Active')
            );
            this.practiceList.forEach((ele) => (ele.practice = ele.practice));
            
          }, 200);
        
          this.spinner = false;
        } else {
         
          this.spinner = false;
        }
      },
      (err) => {
        this.spinner = false;
      }
    );
  }
  get f() {
    return this.practiceForm.controls;
  }
  onSubmit() {
    this.spinner = true;
    this.submitted = true;
    if (this.practiceForm.invalid) {
      $('#large-Modal').modal('show');
      // this.spinner = false;
      return;
    }
  
    const body = this.practiceForm.value;
    body.status = JSON.parse(body.status);
    if (this.editId) {
      body['id'] = this.editId;
    }
    this.service.add_practice(body).subscribe(
      (data) => {
      
        if (data['success']) {
          this.spinner = false;
          if (this.editId) {
            this.toastr.success(`Updated Successfully`);
          } else {
            this.toastr.success(`Practice Added Successfully`);
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
    this.practiceForm.reset();
    this.editId = '';
    this.getPractice();
    this.spinner = false;
    this.submitted = false;
    this.fileUpload = '';
  }
  edit(item) {
  
    this.spinner = false;
    this.editId = item.id;
    this.practiceForm.patchValue({
      practice: item.practice,
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
          practice: ele.practice,
          status: ele.status,
        });
      });
     
      setTimeout(() => {
        event = null;
      }, 3000);

      // this.saveExcel();
    });
    // }
  }

  excelDownload() {
    this.excelData = [];
    this.practiceList.forEach((ele) => {
      this.excelData.push({
        Practice: ele.practice,
        Status: ele.status === 0 ? 'Active' : 'InActive'
      });
    });
    this.excelService.exportAsExcelFile(
      this.excelData,
      `Practice Report - ${moment().format('YYYY-MM-DD')} `
    );
  }

  practiceUpload() {
    this.service.add_practice(this.finalExcelData).subscribe(
      (data1) => {
        if (data1['success']) {
          // this.back();
          this.toastr.success('Bulk practice Added Succefully');
          this.getPractice();
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
