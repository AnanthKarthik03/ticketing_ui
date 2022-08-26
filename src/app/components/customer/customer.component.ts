import { Router } from "@angular/router";
import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { CustomerService } from "./customer.service";
import { ToastrService } from "ngx-toastr";
import { environment } from "src/environments/environment";
import { CountryService } from "src/app/country/country.service";
import { StateService } from "src/app/state/state.service";
import * as _ from "underscore";
import { CompanyService } from "../company/company.service";

@Component({
  selector: "app-customer",
  templateUrl: "./customer.component.html",
  styleUrls: ["./customer.component.css"],
})
export class CustomerComponent implements OnInit {
  myForm!: FormGroup;
  submitted = false;
  viewCustomer = false;
  companyId = "";
  editId = "";
  customerData = [];
  spinner = false;
  typeOfBusiness = [];
  typeOfOrg = [];
  itemImage = "";
  imagePath = environment.customer_logo;
  countryList = [];
  stateList = [];
  stateListDummy = [];
  cityList = [];
  companyData = [];
  companyName = "";
  role = ''
  constructor(
    public router: Router,
    private fb: FormBuilder,
    public service: CustomerService,
    private toastr: ToastrService,
    private countryService: CountryService,
    public stateService: StateService,
    public companyService: CompanyService
  ) {}

  ngOnInit() {
    this.role = sessionStorage.getItem("role");
    this.companyId = sessionStorage.getItem("companyId");
    this.getCompanyById(this.companyId);
    this.typeOfBusiness.push(
      {
        label: "Select Customer Type",
        value: null,
      },
      { label: "Business", value: 0 },
      { label: "Individual", value: 1 }
    );
    this.typeOfOrg.push(
      {
        label: "Select Org Type",
        value: null,
      },
      { label: "Business Group", value: 0 },
      { label: "Legal Entity", value: 1 },
      { label: "Inventory Org", value: 2 }
    );
    this.get_customer();
    this.countryDetails();
    this.getState();
    this.myForm = this.fb.group({
      id: [""],
      company_id: this.companyId,
      customer_logo: [""],
      customer_type: ["", Validators.required],
      customer_name_first: ["", Validators.required],
      customer_name_last: ["", Validators.required],
      company_name: ["", Validators.required],
      display_name: ["", Validators.required],
      mobile: ["", Validators.required],
      org_type: ["", Validators.required],
      website: ["", Validators.required],
      pan_no: ["", Validators.required],
      address: ["", Validators.required],
      country: ["", Validators.required],
      state: ["", Validators.required],
      city: ["", Validators.required],
      email: ["", [Validators.required, Validators.email]],
      phone: ["", Validators.required],
      gst_treatment: [""],
      tax_preference: [""],
      site_name: [""],
      pincode: ["", Validators.required],
    });
  }

  getCompanyById(id) {
    this.companyService.get_company().subscribe((data) => {
      if (data["success"]) {
        this.companyData = data["data"];
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

  get_customer() {
    this.spinner = true;
    this.service.get_customer(this.companyId).subscribe(
      (data) => {
        if (data["success"]) {
          this.spinner = false;
          this.customerData = data["data"];
          console.log(data["data"]);
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
    return this.myForm.controls;
  }

  onSubmit() {
    this.spinner = true;
    this.submitted = true;
    if (this.myForm.invalid) {
      this.spinner = false;
      return;
    }
    console.log(this.myForm.value);
    console.log(this.editId);
    if (this.editId) {
      this.myForm.value.id = this.editId;
    }
    const body = this.prepareSave();
    console.log(body);

    this.service.add_customer(body).subscribe((data) => {
      if (data["success"]) {
        this.spinner = false;
        if (this.editId) {
          this.toastr.success(`Updated Successfully`);
        } else {
          this.toastr.success(`Customer Added Successfully`);
        }
        this.myForm.reset();
        this.editId = "";
        this.showCustomerList();
        this.get_customer();
      } else {
        this.spinner = false;
        this.toastr.warning(data["message"]);
      }
    });
  }
  onFileChange(event) {
    // const reader = new FileReader();

    console.log(event);
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.itemImage = file;
    }
  }
  private prepareSave(): any {
    const input = new FormData();
    input.append("logo", this.itemImage);
    input.append("data", JSON.stringify(this.myForm.value));
    return input;
  }

  company() {
    if (this.role === "Admin") {
      this.router.navigate(["/adminDashboard"]);
    } else {
      this.router.navigate(["/company"]);
    }
  }

  project(id) {
    sessionStorage.setItem("customerId", id);
    this.router.navigate(["/projects"]);
  }
  showCustomerForm() {
    this.viewCustomer = true;
    this.myForm.reset();
    this.submitted = false;
    this.spinner = false;
    this.myForm.controls["company_id"].setValue(this.companyId);
  }
  showCustomerList() {
    this.viewCustomer = false;
  }

  edit(item) {
    this.spinner = false;
    console.log(item);
    this.editId = item.id;
    this.showCustomerForm();
    this.myForm.patchValue({
      company_id: this.companyId,
      customer_logo: item.customer_logo,
      customer_type: item.customer_type,
      customer_name_first: item.customer_name_first,
      customer_name_last: item.customer_name_last,
      company_name: item.company_name,
      display_name: item.display_name,
      mobile: item.mobile,
      org_type: item.org_type,
      website: item.website,
      pan_no: item.pan_no,
      address: item.address,
      country: item.country,
      state: item.state,
      city: item.city,
      email: item.email,
      phone: item.phone,
      gst_treatment: item.gst_treatment,
      tax_preference: item.tax_preference,
      site_name: item.site_name,
      pincode: item.pincode,
    });
  }

  countryDetails() {
    this.countryService.get_country().subscribe((data) => {
      console.log(data["data"]);
      if (data["success"]) {
        this.countryList.unshift({
          label: "Select Country",
          value: null,
        });
        data["data"].forEach((item) => {
          this.countryList.push({
            label: item.country_name,
            value: item.id.toString(),
          });
        });
      }
    });
  }

  getState() {
    this.stateService.get_state().subscribe((data) => {
      console.log(data["data"]);
      if (data["success"]) {
        this.stateListDummy = data["data"];

        this.stateList.unshift({
          label: "Select State",
          value: null,
        });
        data["data"].forEach((item) => {
          this.stateList.push({
            label: item.state_name,
            value: item.id.toString(),
          });
        });
      }
    });
  }

  countryChange(e) {
    console.log(this.stateListDummy);
    this.stateList = [];
    const temp = _.filter(
      this.stateListDummy,
      (item) => parseInt(item.country_id, 10) === parseInt(e, 10)
    );

    if (temp.length > 0) {
      // this.stateListDummy = temp;
      temp.forEach((ele) => {
        this.stateList.push({
          label: ele.state_name,
          value: ele.id,
        });
      });
      this.stateList.unshift({
        label: "Select State",
        value: null,
      });
    } else {
      this.stateList = [];
      this.stateList.unshift({
        label: "No State Found",
        value: null,
      });
      console.log(temp);
    }
  }

  // stateChange(e) {
  //   console.log(this.stateListDummy);
  //   this.cityList = [];
  //   const temp = _.filter(
  //     this.stateListDummy,
  //     (item) => parseInt(item.id, 10) === parseInt(e, 10)
  //   );
  //   console.log(temp, e);
  //   if (temp.length > 0) {
  //     // this.stateListDummy = temp;
  //     temp.forEach((ele) => {
  //       this.cityList.push({
  //         label: ele.city,
  //         value: ele.id,
  //       });
  //     });
  //     this.cityList.unshift({
  //       label: 'Select City',
  //       value: null,
  //     });
  //   } else {
  //     this.cityList = [];
  //     this.cityList.unshift({
  //       label: 'No City Found',
  //       value: null,
  //     });
  //     console.log(temp);
  //   }
  // }
}
