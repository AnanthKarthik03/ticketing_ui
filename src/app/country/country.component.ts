import { Component, OnInit } from "@angular/core";
import { Validators } from "@angular/forms";
import { FormBuilder } from "@angular/forms";
import { FormGroup } from "@angular/forms";
import { CountryService } from "./country.service";
import { ToastrService } from "ngx-toastr";
import { XlsxToJsonService } from "../xlsx-to-json-service";
import * as _ from "underscore";
declare var $: any;

@Component({
  selector: "app-country",
  templateUrl: "./country.component.html",
  styleUrls: ["./country.component.css"],
})
export class CountryComponent implements OnInit {
  myForm = new FormGroup({});
  editId = "";
  conData: any = [];
  spinner = false;
  submitted = false;
  file = "";
  excelData = [];
  finalExcelData = [];
  private xlsxToJsonService: XlsxToJsonService = new XlsxToJsonService();

  constructor(
    private fb: FormBuilder,
    private service: CountryService,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.myForm = this.fb.group({
      country_code: ["", Validators.required],
      country_name: ["", Validators.required],
    });
    this.countryDetails();
  }
  get m() {
    return this.myForm.controls;
  }
  countryAdd() {
    this.myForm.reset();
    this.editId = "";
  }
  countryForm() {
    this.spinner = true;
    this.submitted = true;

    if (this.myForm.invalid) {
      // this.spinner = false;
      return;
    }
    const body = this.myForm.value;

    if (this.editId) {
      body["id"] = this.editId;
    }

    this.service.countryDetailSend(body).subscribe(
      (data) => {
        if (data["success"]) {
          $("#large-Modal").modal("hide");

          this.spinner = false;
          if (this.editId) {
            this.toastr.success(`Updated Successfully`);
          } else {
            this.toastr.success(`Customer Added Successfully`);
          }
          this.countryDetails();
        } else {
          this.spinner = false;
          this.toastr.error(data["message"]);
        }
      },
      (err) => {
        this.spinner = false;
      }
    );
  }
  countryDetails() {
    this.spinner = true;
    this.service.get_country().subscribe(
      (data) => {
        if (data["success"]) {
          this.conData = data["data"];
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
  edit(con) {
    this.editId = con.id;
    this.spinner = false;
    this.myForm.patchValue({
      country_code: con.country_code,
      country_name: con.country_name,
    });
  }

  clear() {
    this.myForm.reset();
    this.editId = "";
    this.file = "";
    this.countryDetails();
    this.spinner = false;
    this.submitted = false;
  }

  handleFile(event) {
    this.excelData = [];
    let result1 = [];
    if (event) {
    }

    const file = event.target.files[0];

    this.xlsxToJsonService.processFileToJson({}, file).subscribe((data) => {
      this.excelData = data["sheets"]["Sheet1"];
      result1 = _.toArray(this.excelData);

      result1.forEach((ele) => {
        this.finalExcelData.push({
          country_code: ele.country_code,
          country_name: ele.country_name,
        });
      });

      setTimeout(() => {
        event = null;
      }, 3000);

      // this.saveExcel();
    });
    // }
  }
  countryUpload() {
    this.service.countryDetailSend(this.finalExcelData).subscribe(
      (data1) => {
        if (data1["success"]) {
          // this.back();
          this.countryDetails();
          this.toastr.success("Bulk Country Added Succefully");
        } else {
          return this.toastr.error(data1["message"]);
        }
      },
      (error) => {
        this.toastr.error("Network Error");
      }
    );
  }
}
