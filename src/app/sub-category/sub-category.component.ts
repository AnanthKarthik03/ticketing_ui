import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import * as _ from "underscore";
import { CategoryService } from "../category/category.service";
import { XlsxToJsonService } from "../xlsx-to-json-service";
declare var $: any;
@Component({
  selector: "app-sub-category",
  templateUrl: "./sub-category.component.html",
  styleUrls: ["./sub-category.component.css"],
})
export class SubCategoryComponent implements OnInit {
  categoryForm!: FormGroup;
  submitted = false;
  spinner = false;
  categoryList = [];
  editId = "";
  fileUpload = "";
  excelData = [];
  finalExcelData = [];
  practiceList = [];

  private xlsxToJsonService: XlsxToJsonService = new XlsxToJsonService();
  constructor(
    private fb: FormBuilder,
    private toastr: ToastrService,
    public service: CategoryService
  ) {}

  ngOnInit() {
    this.categoryForm = this.fb.group({
      sub_category: ["", Validators.required],
      c_id: ["", Validators.required],
      status: ["", Validators.required],
    });
    this.getCategory();
    this.practice();
  }
  practice() {
    this.practiceList = [];
    this.spinner = true;
    this.service.get_category().subscribe(
      (data) => {
        if (data["success"]) {
          // this.practiceList = data['data'];
          data["data"].forEach((ele) => {
            this.practiceList.push({
              id: ele.id,
              category: ele.category,
            });
          });
          this.spinner = false;
        } else {
          console.log(data["message"]);
          this.spinner = false;
        }
      },
      (err) => {
        this.spinner = false;
      }
    );
  }
  getCategory() {
    this.categoryList = [];
    this.spinner = true;
    this.service.get_sub_category().subscribe(
      (data) => {
        if (data["success"]) {
          // this.categoryList = data['data'];
          data["data"].forEach((ele) => {
            this.categoryList.push({
              id: ele.id,
              status: ele.status,
              status_name: ele.status === 0 ? "Active" : "In Active",
              sub_category: ele.sub_category,
              category: ele.category,
              c_id: ele.c_id,
            });
          });
          this.spinner = false;
        } else {
          console.log(data["message"]);
          this.spinner = false;
        }
      },
      (err) => {
        this.spinner = false;
      }
    );
  }
  get f() {
    return this.categoryForm.controls;
  }
  onSubmit() {
    this.spinner = true;
    this.submitted = true;
    console.log(this.categoryForm);

    if (this.categoryForm.invalid) {
      $("#large-Modal").modal("show");
      // this.spinner = false;
      return;
    }
    console.log(this.categoryForm.value);
    const body = this.categoryForm.value;
    body.status = JSON.parse(body.status);
    if (this.editId) {
      body["id"] = this.editId;
    }
    this.service.add_sub_category(body).subscribe(
      (data) => {
        console.log(data["data"]);
        if (data["success"]) {
          this.spinner = false;
          if (this.editId) {
            this.toastr.success(`Updated Successfully`);
          } else {
            this.toastr.success(`Category Added Successfully`);
          }

          $("#large-Modal").modal("hide");
          this.clear();
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

  clear() {
    this.categoryForm.reset();
    this.editId = "";
    this.getCategory();
    this.spinner = false;
    this.submitted = false;
    this.fileUpload = "";
  }
  edit(item) {
    console.log(item);
    this.spinner = false;
    this.editId = item.id;
    this.categoryForm.patchValue({
      sub_category: item.sub_category,
      c_id: parseInt(item.c_id, 10),
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
      this.excelData = data["sheets"]["Sheet1"];
      result1 = _.toArray(this.excelData);
      // console.log(result1);

      result1.forEach((ele) => {
        this.finalExcelData.push({
          status: ele.status,
          // status_name: ele.status === 0 ? 'Active' : 'In Active',
          category: ele.category,
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

  categoryUpload() {
    this.service.add_category(this.finalExcelData).subscribe(
      (data1) => {
        if (data1["success"]) {
          // this.back();
          this.toastr.success("Bulk Category Added Succefully");
          this.getCategory();
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
