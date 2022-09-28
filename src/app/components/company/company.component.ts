import { Component, OnInit } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { Router } from "@angular/router";
import { FormBuilder } from "@angular/forms";
import { Validators } from "@angular/forms";
import { CompanyService } from "./company.service";
import { environment } from "src/environments/environment";
import { ToastrService } from "ngx-toastr";
import * as _ from "underscore";
@Component({
  selector: "app-company",
  templateUrl: "./company.component.html",
  styleUrls: ["./company.component.css"],
})
export class CompanyComponent implements OnInit {
  viewCompany = false;
  companyForm = new FormGroup({});
  typeOfBusiness = [];
  itemImage = "";
  companyData = [];
  imagePath = "";
  editId = "";
  submitted = false;
  spinner = false;
  employeeId = false;
  role = "";
  cId = "";
  constructor(
    public router: Router,
    private formBuilder: FormBuilder,
    public service: CompanyService,
    private toastr: ToastrService
  ) {}
  ngOnInit() {
    this.role = sessionStorage.getItem("role");
    this.cId = sessionStorage.getItem("companyId");
    this.get_company();
    this.typeOfBusiness.push(
      {
        label: "Select Buisness Type",
        value: null,
      },
      { label: "Business", value: "0" },
      { label: "Individual", value: "1" }
    );
    this.valiDate();
    this.imagePath = environment.company_logo;
  }
  dashboard() {
    this.router.navigate(["/Dashboard"]);
    if (this.role === "Admin") {
      this.router.navigate(["/adminDashboard"]);
    }
  }
  adminDashboard() {
    this.router.navigate(["/adminDashboard"]);
  }
  customer(item) {
    sessionStorage.setItem("companyId", item.id);
    sessionStorage.setItem("emp_prefix", item.emp_prefix);
    this.router.navigate(["/customer"]);
  }
  employee(item) {
    sessionStorage.setItem("companyId", item.id);
    sessionStorage.setItem("emp_prefix", item.emp_prefix);
    this.router.navigate(["/employees"]);
  }
  showEmployeeId() {
    this.employeeId = true;
  }
  hideEmployeeId() {
    this.employeeId = false;
  }

  showCompanyForm = () => {
    this.viewCompany = true;
    this.companyForm.reset();
    this.submitted = false;
    this.spinner = false;
  };
  showCompanyList = () => {
    this.viewCompany = false;
    this.spinner = false;
  };
  get f() {
    return this.companyForm.controls;
  }

  // Validation Funcation of company Form
  valiDate() {
    this.companyForm = this.formBuilder.group({
      id: [""],
      company_logo: [""],
      company_name: ["", Validators.required],
      company_contact_details: ["", Validators.required],
      company_email_id: ["", [Validators.required, Validators.email]],
      company_legal_name: ["", Validators.required],
      company_website: ["", Validators.required],
      type_of_business: ["", Validators.required],
      company_identification_number: ["", Validators.required],
      office_address_line1: ["", Validators.required],
      office_address_line2: [""],
      city: ["", Validators.required],
      state: ["", Validators.required],
      pincode: ["", Validators.required],
      tan: ["", Validators.required],
      pan: ["", Validators.required],
      tan_circle_number: ["", Validators.required],
      form_16_signatory: [""],
      gst_number: ["", Validators.required],
      pf_signatory: [""],
      pf_number: ["", Validators.required],
      pt_signatory: [""],
      pf_signatory_father: [""],
      pf_signatory_designation: [""],
      esi_number: ["", Validators.required],
      esi_signatory_designation: ["", Validators.required],
      esi_signatory: [""],
      pt_number: ["", Validators.required],
      esi_signatory_father: [""],
      date_of_incorporation: [new Date(), Validators.required],
      pf_registration_date: [new Date(), Validators.required],
      esi_registration_date: [new Date(), Validators.required],
      pt_registration_date: [new Date(), Validators.required],
      emp_prefix: [""],
    });
  }

  submit() {
    this.spinner = true;
    this.submitted = true;
    if (this.companyForm.invalid) {
      this.spinner = false;
      return;
    }

    if (this.editId) {
      this.companyForm.value.id = this.editId;
    }
    const body = this.prepareSave();
    this.service.add_company(body).subscribe((data) => {
      if (data["success"]) {
        this.spinner = false;
        if (this.editId) {
          this.toastr.success(`Updated Successfully`);
        } else {
          this.toastr.success(`Company Added Successfully`);
        }
        this.companyForm.reset();
        this.editId = "";
        this.showCompanyList();
        this.get_company();
      } else {
        this.spinner = false;
        this.toastr.warning(data["message"]);
      }
    });
  }
  get_company() {
    this.spinner = true;
    this.service.get_company().subscribe(
      (data) => {
        if (data["success"]) {
          this.spinner = false;

          if (this.role === "Admin") {
            this.companyData = _.filter(
              data["data"],
              (item) => parseInt(item.id, 10) === parseInt(this.cId, 10)
            );
          } else {
            this.companyData = data["data"];
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
  onFileChange(event) {
    // const reader = new FileReader();

    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.itemImage = file;
    }
  }

  private prepareSave(): any {
    const input = new FormData();
    input.append("logo", this.itemImage);
    input.append("data", JSON.stringify(this.companyForm.value));
    return input;
  }

  edit(item) {
    this.spinner = false;

    this.editId = item.id;
    this.showCompanyForm();
    this.companyForm.patchValue({
      company_email_id: item.company_email_id,
      gst_number: item.gst_number,
      company_name: item.company_name,
      company_logo: item.company_logo,
      company_contact_details: item.company_contact_details,
      company_legal_name: item.company_legal_name,
      company_website: item.company_website,
      type_of_business: item.type_of_business,
      company_identification_number: item.company_identification_number,
      // cit_location: item.cit_location,
      office_address_line1: item.office_address_line1,
      office_address_line2: item.office_address_line2,
      city: item.city,
      state: item.state,
      pincode: item.pincode,
      tan: item.tan,
      pan: item.pan,
      tan_circle_number: item.tan_circle_number,
      form_16_signatory: item.form_16_signatory,
      pf_signatory: item.pf_signatory,
      pf_number: item.pf_number,
      pt_signatory: item.pt_signatory,
      pf_signatory_father: item.pf_signatory_father,
      pf_signatory_designation: item.pf_signatory_designation,
      esi_number: item.esi_number,
      esi_signatory_designation: item.esi_signatory_designation,
      esi_signatory: item.esi_signatory,
      pt_number: item.pt_number,
      esi_signatory_father: item.esi_signatory_father,
      date_of_incorporation: new Date(item.date_of_incorporation),
      pf_registration_date: new Date(item.pf_registration_date),
      esi_registration_date: new Date(item.esi_registration_date),
      pt_registration_date: new Date(item.pt_registration_date),
      emp_prefix: item.emp_prefix,
    });
  }
}
