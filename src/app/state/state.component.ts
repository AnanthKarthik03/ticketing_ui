import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { Validators } from '@angular/forms';
import { StateService } from './state.service';
import { ToastrService } from 'ngx-toastr';
import { CountryService } from '../country/country.service';
import * as _ from 'underscore';
import { XlsxToJsonService } from '../xlsx-to-json-service';
import { isNgTemplate } from '@angular/compiler';

declare var $: any;
@Component({
  selector: 'app-state',
  templateUrl: './state.component.html',
  styleUrls: ['./state.component.css'],
})
export class StateComponent implements OnInit {
  stateForm = new FormGroup({});
  constructor(
    public router: Router,
    private formBuilder: FormBuilder,
    public service: StateService,
    private toastr: ToastrService,
    private countryService: CountryService
  ) {}
  spinner = false;
  submitted = false;
  editId = '';
  stateList = [];
  countryList = [];
  fileUpload = '';
  excelData = [];
  finalExcelData = [];

  private xlsxToJsonService: XlsxToJsonService = new XlsxToJsonService();
  ngOnInit() {
    this.countryDetails();
    this.valiDate();
    this.getState();
  }
  valiDate() {
    this.stateForm = this.formBuilder.group({
      country_id: ['', Validators.required],
      state_name: ['', Validators.required],
      city: ['', Validators.required],
      gst_code: ['', Validators.required],
    });
  }
  get f() {
    return this.stateForm.controls;
  }
  submit() {
    this.spinner = true;
    this.submitted = true;
    if (this.stateForm.invalid) {
      // this.spinner = false;
      $('#large-Modal').modal('show');
      return;
    }
    console.log(this.stateForm.value);
    const body = this.stateForm.value;
    console.log(this.editId);
    if (this.editId) {
      body['id'] = this.editId;
    }
    console.log(body);
    this.service.add_state(body).subscribe(
      (data) => {
        console.log(data['data']);
        if (data['success']) {
          this.getState();
          this.spinner = false;
          if (this.editId) {
            this.toastr.success(`Updated Successfully`);
          } else {
            this.toastr.success(`State Added Successfully`);
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
    this.stateForm.reset();
    this.editId = '';
    this.spinner = false;
    this.submitted = false;
    this.fileUpload = '';
  }

  getState() {
    this.stateList = [];
    this.spinner = true;
    this.service.get_state().subscribe(
      (data) => {
        if (data['success']) {
           this.stateList = data['data'];
          
          setTimeout(() => {
            this.stateList.forEach((ele) => (ele.id = ele.id));
            this.stateList.forEach((ele) => (ele.country_id = ele.country_id));
            this.stateList.forEach((ele) => (ele.country_name = ele.country_id));
            this.stateList.forEach((ele) => (ele.city = ele.city));
            this.stateList.forEach((ele) => (ele.gst_code = ele.gst_code));

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

  edit(item) {
    console.log(item);
    this.spinner = false;
    this.editId = item.id;
    this.stateForm.patchValue({
      country_id: item.country_id,
      state_name: item.state_name,
      city: item.city,
      gst_code: item.gst_code,
    });
  }

  // countryDetails1() {
  //   this.countryService.get_country().subscribe((data) => {
  //     console.log(data['data']);
  //     if (data['success']) {
  //       this.countryList.unshift({
  //         label: 'Select Country',
  //         value: null,
  //       });
  //       data['data'].forEach((item) => {
  //         this.countryList.push({
  //           label: item.country_name,
  //           value: item.id,
  //         });
  //       });
  //     }
  //   });
  // }

  countryDetails() {
    this.countryService.get_country().subscribe((data) => {
      if (data['success']) {
        this.countryList = data['data'];
        console.log(this.countryList);
      } else {
        this.countryList = [];
      }
    });
  }

  getCountryName(id) {
    const data = _.filter(
      this.countryList,
      (item) => parseInt(item.id, 10) === parseInt(id, 10)
    );
    console.log(data);
    if (data.length > 0) {
      return data[0].country_name;
    } else {
      return '-';
    }
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
          country_id: ele.country_id,
          state_name: ele.state_name,
          city: ele.city,
          gst_code: ele.gst_code,
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

  stateUpload() {
    this.service.add_state(this.finalExcelData).subscribe(
      (data1) => {
        if (data1['success']) {
          // this.back();
          this.toastr.success('Bulk State Added Succefully');
          this.getState();
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
