// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  //apiUrl: 'http://127.0.0.1:9979/',
  // apiUrl: 'https://rostan.rostantechnologies.com:9978/',
  // apiUrl: 'https://rostan.rostantechnologies.com:9979/',
  // apiUrl: 'https://rostan.rostantechnologies.com:9980/', // live
  apiUrl: 'https://rstapi.rostantechnologies.com:9992/',
  // company_logo: 'https://rostan.rostantechnologies.com/ticketing_tool/server/company_logo/',
  // employee_logo: 'https://rostan.rostantechnologies.com/ticketing_tool/server/employee_logo/',
  // customer_logo: 'https://rostan.rostantechnologies.com/ticketing_tool/server/customer_logo/',
  // ticketingFiles: 'https://rostan.rostantechnologies.com/ticketing_tool/server/ticketingFiles/',

  company_logo: "http://127.0.0.1/projects/ticketing_tool/company_logo/",
  employee_logo: "http://127.0.0.1/projects/ticketing_tool/employee_logo/",
  customer_logo: "http://127.0.0.1/projects/ticketing_tool/customer_logo/",
  ticketingFiles: 'http://127.0.0.1/projects/ticketing_tool/ticketingFiles/',
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
