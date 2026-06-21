# ERPNext HRMS API Verification Report (Full CRUD Test Suite)

Generated on: 2026-06-21T06:11:03.958Z
Target Host: `http://localhost:8080`

## CRUD Summary Dashboard

| CRUD Operation | Success (200 OK) | Failed / Skipped / N/A | Success Rate |
| :--- | :--- | :--- | :--- |
| **GET (List/Single)** | 107 / 107 | 0 | 100.0% |
| **POST (Create)** | 38 / 100 | 62 failed (7 singles N/A) | 38.0% |
| **GET (Each)** | 56 / 107 | 51 | 52.3% |
| **PUT (Update)** | 51 / 107 | 56 | 47.7% |
| **DELETE (Clean)** | 0 / 11 | 38 failed | 0.0% |

> [!NOTE]
> **POST/DELETE Validations**: Some standard DocTypes require complex business workflow states or external database configurations to create. For DocTypes where mock POST creation failed, the test runner safely queried an existing seeded record to execute GET and PUT checks, skipping DELETE to maintain database integrity.

## Endpoint Verification Matrix

| DocType | Type | GET (List) | POST (Create) | GET (Each) | PUT (Update) | DELETE (Clean) | Notes |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Additional Salary** | Standard | ✅ `200` | ❌ `417` | N/A | N/A | N/A | POST failed. No record available for GET Each, PUT, or DELETE.  |
| **Appointment Letter** | Standard | ✅ `200` | ❌ `500` | N/A | N/A | N/A | POST failed. No record available for GET Each, PUT, or DELETE.  |
| **Appointment Letter Template** | Standard | ✅ `200` | ❌ `500` | N/A | N/A | N/A | POST failed. No record available for GET Each, PUT, or DELETE.  |
| **Appraisal** | Standard | ✅ `200` | ❌ `417` | N/A | N/A | N/A | POST failed. No record available for GET Each, PUT, or DELETE.  |
| **Appraisal Cycle** | Standard | ✅ `200` | ✅ `200` | ✅ `200` | ✅ `200` | ❌ `202` | POST Created record successfully. DELETE Cleaned up temporary record.  |
| **Appraisal Template** | Standard | ✅ `200` | ❌ `500` | N/A | N/A | N/A | POST failed. No record available for GET Each, PUT, or DELETE.  |
| **Arrear** | Standard | ✅ `200` | ❌ `417` | N/A | N/A | N/A | POST failed. No record available for GET Each, PUT, or DELETE.  |
| **Attendance** | Standard | ✅ `200` | ✅ `200` | ✅ `200` | ✅ `200` | ❌ `202` | POST Created record successfully. DELETE Cleaned up temporary record.  |
| **Attendance Request** | Standard | ✅ `200` | ✅ `200` | ✅ `200` | ✅ `200` | ❌ `202` | POST Created record successfully. DELETE Cleaned up temporary record.  |
| **Bulk Salary Structure Assignment** | Single | ✅ `200` | N/A | ✅ `200` | ❌ `417` | N/A | Single DocType (GET & PUT tested) |
| **Compensatory Leave Request** | Standard | ✅ `200` | ❌ `417` | N/A | N/A | N/A | POST failed. No record available for GET Each, PUT, or DELETE.  |
| **Daily Work Summary** | Standard | ✅ `200` | ✅ `200` | ✅ `200` | ✅ `200` | ❌ `202` | POST Created record successfully. DELETE Cleaned up temporary record.  |
| **Daily Work Summary Group** | Standard | ✅ `200` | ❌ `500` | N/A | N/A | N/A | POST failed. No record available for GET Each, PUT, or DELETE.  |
| **Employee Advance** | Standard | ✅ `200` | ✅ `200` | ✅ `200` | ✅ `200` | ❌ `202` | POST Created record successfully. DELETE Cleaned up temporary record.  |
| **Employee Attendance Tool** | Single | ✅ `200` | N/A | ✅ `200` | ✅ `200` | N/A | Single DocType (GET & PUT tested) |
| **Employee Benefit Application** | Standard | ✅ `200` | ❌ `500` | N/A | N/A | N/A | POST failed. No record available for GET Each, PUT, or DELETE.  |
| **Employee Benefit Claim** | Standard | ✅ `200` | ❌ `417` | N/A | N/A | N/A | POST failed. No record available for GET Each, PUT, or DELETE.  |
| **Employee Benefit Ledger** | Standard | ✅ `200` | ❌ `417` | N/A | N/A | N/A | POST failed. No record available for GET Each, PUT, or DELETE.  |
| **Employee Checkin** | Standard | ✅ `200` | ✅ `200` | ✅ `200` | ✅ `200` | ❌ `202` | POST Created record successfully. DELETE Cleaned up temporary record.  |
| **Employee Feedback Criteria** | Standard | ✅ `200` | ✅ `200` | ✅ `200` | ✅ `200` | ❌ `202` | POST Created record successfully. DELETE Cleaned up temporary record.  |
| **Employee Grade** | Standard | ✅ `200` | ❌ `417` | N/A | N/A | N/A | POST failed. No record available for GET Each, PUT, or DELETE.  |
| **Employee Grievance** | Standard | ✅ `200` | ❌ `417` | N/A | N/A | N/A | POST failed. No record available for GET Each, PUT, or DELETE.  |
| **Employee Health Insurance** | Standard | ✅ `200` | ✅ `200` | ✅ `200` | ✅ `200` | ❌ `202` | POST Created record successfully. DELETE Cleaned up temporary record.  |
| **Employee Incentive** | Standard | ✅ `200` | ✅ `200` | ✅ `200` | ✅ `200` | ❌ `202` | POST Created record successfully. DELETE Cleaned up temporary record.  |
| **Employee Onboarding** | Standard | ✅ `200` | ✅ `200` | ✅ `200` | ✅ `200` | ❌ `202` | POST Created record successfully. DELETE Cleaned up temporary record.  |
| **Employee Onboarding Template** | Standard | ✅ `200` | ✅ `200` | ✅ `200` | ✅ `200` | ❌ `202` | POST Created record successfully. DELETE Cleaned up temporary record.  |
| **Employee Other Income** | Standard | ✅ `200` | ❌ `417` | N/A | N/A | N/A | POST failed. No record available for GET Each, PUT, or DELETE.  |
| **Employee Performance Feedback** | Standard | ✅ `200` | ❌ `417` | N/A | N/A | N/A | POST failed. No record available for GET Each, PUT, or DELETE.  |
| **Employee Promotion** | Standard | ✅ `200` | ✅ `200` | ✅ `200` | ✅ `200` | ❌ `202` | POST Created record successfully. DELETE Cleaned up temporary record.  |
| **Employee Referral** | Standard | ✅ `200` | ❌ `417` | N/A | N/A | N/A | POST failed. No record available for GET Each, PUT, or DELETE.  |
| **Employee Separation** | Standard | ✅ `200` | ✅ `200` | ✅ `200` | ✅ `200` | ❌ `202` | POST Created record successfully. DELETE Cleaned up temporary record.  |
| **Employee Separation Template** | Standard | ✅ `200` | ✅ `200` | ✅ `200` | ✅ `200` | ❌ `202` | POST Created record successfully. DELETE Cleaned up temporary record.  |
| **Employee Skill Map** | Standard | ✅ `200` | ❌ `417` | N/A | N/A | N/A | POST failed. No record available for GET Each, PUT, or DELETE.  |
| **Employee Tax Exemption Category** | Standard | ✅ `200` | ❌ `417` | N/A | N/A | N/A | POST failed. No record available for GET Each, PUT, or DELETE.  |
| **Employee Tax Exemption Declaration** | Standard | ✅ `200` | ❌ `417` | N/A | N/A | N/A | POST failed. No record available for GET Each, PUT, or DELETE.  |
| **Employee Tax Exemption Proof Submission** | Standard | ✅ `200` | ❌ `417` | N/A | N/A | N/A | POST failed. No record available for GET Each, PUT, or DELETE.  |
| **Employee Tax Exemption Sub Category** | Standard | ✅ `200` | ❌ `417` | N/A | N/A | N/A | POST failed. No record available for GET Each, PUT, or DELETE.  |
| **Employee Transfer** | Standard | ✅ `200` | ❌ `500` | N/A | N/A | N/A | POST failed. No record available for GET Each, PUT, or DELETE.  |
| **Employment Type** | Standard | ✅ `200` | ✅ `200` | ✅ `200` | ✅ `200` | ❌ `202` | POST Created record successfully. DELETE Cleaned up temporary record.  |
| **Exit Interview** | Standard | ✅ `200` | ❌ `409` | ✅ `200` | ✅ `200` | Skipped ℹ️ | POST failed. DELETE Skipped to preserve seeded/existing database record.  |
| **Expense Claim** | Standard | ✅ `200` | ✅ `200` | ✅ `200` | ✅ `200` | ❌ `202` | POST Created record successfully. DELETE Cleaned up temporary record.  |
| **Expense Claim Type** | Standard | ✅ `200` | ✅ `200` | ✅ `200` | ✅ `200` | ❌ `202` | POST Created record successfully. DELETE Cleaned up temporary record.  |
| **Full and Final Statement** | Standard | ✅ `200` | ✅ `200` | ✅ `200` | ✅ `200` | ❌ `202` | POST Created record successfully. DELETE Cleaned up temporary record.  |
| **Goal** | Standard | ✅ `200` | ✅ `200` | ✅ `200` | ✅ `200` | ❌ `202` | POST Created record successfully. DELETE Cleaned up temporary record.  |
| **Gratuity** | Standard | ✅ `200` | ❌ `417` | N/A | N/A | N/A | POST failed. No record available for GET Each, PUT, or DELETE.  |
| **Gratuity Rule** | Standard | ✅ `200` | ❌ `500` | ✅ `200` | ❌ `417` | Skipped ℹ️ | POST failed. DELETE Skipped to preserve seeded/existing database record.  |
| **Grievance Type** | Standard | ✅ `200` | ❌ `417` | N/A | N/A | N/A | POST failed. No record available for GET Each, PUT, or DELETE.  |
| **Holiday List Assignment** | Standard | ✅ `200` | ❌ `417` | ✅ `200` | ✅ `200` | Skipped ℹ️ | POST failed. DELETE Skipped to preserve seeded/existing database record.  |
| **HR Settings** | Single | ✅ `200` | N/A | ✅ `200` | ✅ `200` | N/A | Single DocType (GET & PUT tested) |
| **Identification Document Type** | Standard | ✅ `200` | ❌ `417` | N/A | N/A | N/A | POST failed. No record available for GET Each, PUT, or DELETE.  |
| **Income Tax Slab** | Standard | ✅ `200` | ❌ `500` | N/A | N/A | N/A | POST failed. No record available for GET Each, PUT, or DELETE.  |
| **Interest** | Standard | ✅ `200` | ✅ `200` | ✅ `200` | ✅ `200` | ❌ `202` | POST Created record successfully. DELETE Cleaned up temporary record.  |
| **Interview** | Standard | ✅ `200` | ❌ `417` | N/A | N/A | N/A | POST failed. No record available for GET Each, PUT, or DELETE.  |
| **Interview Feedback** | Standard | ✅ `200` | ❌ `500` | N/A | N/A | N/A | POST failed. No record available for GET Each, PUT, or DELETE.  |
| **Interview Round** | Standard | ✅ `200` | ❌ `500` | N/A | N/A | N/A | POST failed. No record available for GET Each, PUT, or DELETE.  |
| **Interview Type** | Standard | ✅ `200` | ❌ `500` | N/A | N/A | N/A | POST failed. No record available for GET Each, PUT, or DELETE.  |
| **Job Applicant** | Standard | ✅ `200` | ❌ `417` | ✅ `200` | ✅ `200` | Skipped ℹ️ | POST failed. DELETE Skipped to preserve seeded/existing database record.  |
| **Job Applicant Source** | Standard | ✅ `200` | ✅ `200` | ✅ `200` | ✅ `200` | ❌ `202` | POST Created record successfully. DELETE Cleaned up temporary record.  |
| **Job Offer** | Standard | ✅ `200` | ❌ `417` | ✅ `200` | ✅ `200` | Skipped ℹ️ | POST failed. DELETE Skipped to preserve seeded/existing database record.  |
| **Job Offer Term Template** | Standard | ✅ `200` | ❌ `417` | N/A | N/A | N/A | POST failed. No record available for GET Each, PUT, or DELETE.  |
| **Job Opening** | Standard | ✅ `200` | ✅ `200` | ✅ `200` | ✅ `200` | ❌ `202` | POST Created record successfully. DELETE Cleaned up temporary record.  |
| **Job Opening Template** | Standard | ✅ `200` | ✅ `200` | ✅ `200` | ✅ `200` | ❌ `202` | POST Created record successfully. DELETE Cleaned up temporary record.  |
| **Job Requisition** | Standard | ✅ `200` | ✅ `200` | ✅ `200` | ✅ `200` | ❌ `202` | POST Created record successfully. DELETE Cleaned up temporary record.  |
| **KRA** | Standard | ✅ `200` | ✅ `200` | ✅ `200` | ✅ `200` | ❌ `202` | POST Created record successfully. DELETE Cleaned up temporary record.  |
| **Leave Adjustment** | Standard | ✅ `200` | ❌ `417` | N/A | N/A | N/A | POST failed. No record available for GET Each, PUT, or DELETE.  |
| **Leave Allocation** | Standard | ✅ `200` | ❌ `417` | ✅ `200` | ✅ `200` | Skipped ℹ️ | POST failed. DELETE Skipped to preserve seeded/existing database record.  |
| **Leave Application** | Standard | ✅ `200` | ❌ `417` | ✅ `200` | ❌ `417` | Skipped ℹ️ | POST failed. DELETE Skipped to preserve seeded/existing database record.  |
| **Leave Block List** | Standard | ✅ `200` | ❌ `500` | N/A | N/A | N/A | POST failed. No record available for GET Each, PUT, or DELETE.  |
| **Leave Control Panel** | Single | ✅ `200` | N/A | ✅ `200` | ✅ `200` | N/A | Single DocType (GET & PUT tested) |
| **Leave Encashment** | Standard | ✅ `200` | ❌ `417` | N/A | N/A | N/A | POST failed. No record available for GET Each, PUT, or DELETE.  |
| **Leave Ledger Entry** | Standard | ✅ `200` | ✅ `200` | ✅ `200` | ✅ `200` | ❌ `202` | POST Created record successfully. DELETE Cleaned up temporary record.  |
| **Leave Period** | Standard | ✅ `200` | ❌ `417` | N/A | N/A | N/A | POST failed. No record available for GET Each, PUT, or DELETE.  |
| **Leave Policy** | Standard | ✅ `200` | ❌ `500` | ✅ `200` | ✅ `200` | Skipped ℹ️ | POST failed. DELETE Skipped to preserve seeded/existing database record.  |
| **Leave Policy Assignment** | Standard | ✅ `200` | ✅ `200` | ✅ `200` | ✅ `200` | ❌ `202` | POST Created record successfully. DELETE Cleaned up temporary record.  |
| **Leave Type** | Standard | ✅ `200` | ✅ `200` | ✅ `200` | ✅ `200` | ❌ `202` | POST Created record successfully. DELETE Cleaned up temporary record.  |
| **Offer Term** | Standard | ✅ `200` | ✅ `200` | ✅ `200` | ✅ `200` | ❌ `202` | POST Created record successfully. DELETE Cleaned up temporary record.  |
| **Overtime Slip** | Standard | ✅ `200` | ❌ `500` | N/A | N/A | N/A | POST failed. No record available for GET Each, PUT, or DELETE.  |
| **Overtime Type** | Standard | ✅ `200` | ❌ `417` | N/A | N/A | N/A | POST failed. No record available for GET Each, PUT, or DELETE.  |
| **Payroll Correction** | Standard | ✅ `200` | ❌ `417` | N/A | N/A | N/A | POST failed. No record available for GET Each, PUT, or DELETE.  |
| **Payroll Entry** | Standard | ✅ `200` | ✅ `200` | ✅ `200` | ✅ `200` | ❌ `202` | POST Created record successfully. DELETE Cleaned up temporary record.  |
| **Payroll Period** | Standard | ✅ `200` | ❌ `417` | N/A | N/A | N/A | POST failed. No record available for GET Each, PUT, or DELETE.  |
| **Payroll Settings** | Single | ✅ `200` | N/A | ✅ `200` | ✅ `200` | N/A | Single DocType (GET & PUT tested) |
| **Purpose of Travel** | Standard | ✅ `200` | ❌ `417` | N/A | N/A | N/A | POST failed. No record available for GET Each, PUT, or DELETE.  |
| **PWA Notification** | Standard | ✅ `200` | ✅ `200` | ✅ `200` | ✅ `200` | ❌ `202` | POST Created record successfully. DELETE Cleaned up temporary record.  |
| **Retention Bonus** | Standard | ✅ `200` | ❌ `417` | N/A | N/A | N/A | POST failed. No record available for GET Each, PUT, or DELETE.  |
| **Salary Component** | Standard | ✅ `200` | ✅ `200` | ✅ `200` | ✅ `200` | ❌ `202` | POST Created record successfully. DELETE Cleaned up temporary record.  |
| **Salary Slip** | Standard | ✅ `200` | ❌ `417` | N/A | N/A | N/A | POST failed. No record available for GET Each, PUT, or DELETE.  |
| **Salary Structure** | Standard | ✅ `200` | ❌ `417` | ✅ `200` | ✅ `200` | Skipped ℹ️ | POST failed. DELETE Skipped to preserve seeded/existing database record.  |
| **Salary Structure Assignment** | Standard | ✅ `200` | ✅ `200` | ✅ `200` | ✅ `200` | ❌ `202` | POST Created record successfully. DELETE Cleaned up temporary record.  |
| **Salary Withholding** | Standard | ✅ `200` | ✅ `200` | ✅ `200` | ✅ `200` | ❌ `202` | POST Created record successfully. DELETE Cleaned up temporary record.  |
| **Shift Assignment** | Standard | ✅ `200` | ✅ `200` | ✅ `200` | ✅ `200` | ❌ `202` | POST Created record successfully. DELETE Cleaned up temporary record.  |
| **Shift Assignment Tool** | Single | ✅ `200` | N/A | ✅ `200` | ❌ `417` | N/A | Single DocType (GET & PUT tested) |
| **Shift Location** | Standard | ✅ `200` | ✅ `200` | ✅ `200` | ✅ `200` | ❌ `202` | POST Created record successfully. DELETE Cleaned up temporary record.  |
| **Shift Request** | Standard | ✅ `200` | ❌ `417` | N/A | N/A | N/A | POST failed. No record available for GET Each, PUT, or DELETE.  |
| **Shift Schedule** | Standard | ✅ `200` | ❌ `500` | N/A | N/A | N/A | POST failed. No record available for GET Each, PUT, or DELETE.  |
| **Shift Schedule Assignment** | Standard | ✅ `200` | ❌ `417` | N/A | N/A | N/A | POST failed. No record available for GET Each, PUT, or DELETE.  |
| **Shift Type** | Standard | ✅ `200` | ❌ `417` | ✅ `200` | ✅ `200` | Skipped ℹ️ | POST failed. DELETE Skipped to preserve seeded/existing database record.  |
| **Skill** | Standard | ✅ `200` | ❌ `417` | N/A | N/A | N/A | POST failed. No record available for GET Each, PUT, or DELETE.  |
| **Staffing Plan** | Standard | ✅ `200` | ❌ `500` | N/A | N/A | N/A | POST failed. No record available for GET Each, PUT, or DELETE.  |
| **Training Event** | Standard | ✅ `200` | ❌ `417` | ✅ `200` | ✅ `200` | Skipped ℹ️ | POST failed. DELETE Skipped to preserve seeded/existing database record.  |
| **Training Feedback** | Standard | ✅ `200` | ❌ `417` | N/A | N/A | N/A | POST failed. No record available for GET Each, PUT, or DELETE.  |
| **Training Program** | Standard | ✅ `200` | ✅ `200` | ✅ `200` | ✅ `200` | ❌ `202` | POST Created record successfully. DELETE Cleaned up temporary record.  |
| **Training Result** | Standard | ✅ `200` | ❌ `417` | N/A | N/A | N/A | POST failed. No record available for GET Each, PUT, or DELETE.  |
| **Travel Request** | Standard | ✅ `200` | ❌ `417` | N/A | N/A | N/A | POST failed. No record available for GET Each, PUT, or DELETE.  |
| **Upload Attendance** | Single | ✅ `200` | N/A | ✅ `200` | ❌ `417` | N/A | Single DocType (GET & PUT tested) |
| **Vehicle Log** | Standard | ✅ `200` | ❌ `417` | N/A | N/A | N/A | POST failed. No record available for GET Each, PUT, or DELETE.  |
| **Vehicle Service Item** | Standard | ✅ `200` | ✅ `200` | ✅ `200` | ✅ `200` | ❌ `202` | POST Created record successfully. DELETE Cleaned up temporary record.  |

## Error Details & Logs

Below are details for operations that returned error status codes:

### Additional Salary

* **POST Error**: `frappe.exceptions.ValidationError: Payroll date is mandatory for non-recurring type additional salaries.`

### Appointment Letter

* **POST Error**: `TypeError: 'str' object does not support item assignment`

### Appointment Letter Template

* **POST Error**: `TypeError: 'str' object does not support item assignment`

### Appraisal

* **POST Error**: `frappe.exceptions.LinkValidationError: Could not find Appraisal Cycle: Test Appraisal Cycle`

### Appraisal Cycle


### Appraisal Template

* **POST Error**: `TypeError: 'str' object does not support item assignment`

### Arrear

* **POST Error**: `frappe.exceptions.LinkValidationError: Could not find Payroll Period: Test Payroll Period`

### Attendance


### Attendance Request


### Bulk Salary Structure Assignment

* **PUT Error**: `Request failed with status code 417`

### Compensatory Leave Request

* **POST Error**: `frappe.exceptions.ValidationError: <strong>21-06-2025</strong> is not a holiday.`

### Daily Work Summary


### Daily Work Summary Group

* **POST Error**: `TypeError: 'str' object does not support item assignment`

### Employee Advance


### Employee Benefit Application

* **POST Error**: `TypeError: 'str' object does not support item assignment`

### Employee Benefit Claim

* **POST Error**: `frappe.exceptions.ValidationError: Payroll date cannot be in the past. This is to ensure that claims are made for the current or future payroll cycles.`

### Employee Benefit Ledger

* **POST Error**: `frappe.exceptions.ValidationError: Salary Component None must be of type 'Earning' to be used in Employee Benefit Ledger`

### Employee Checkin


### Employee Feedback Criteria


### Employee Grade

* **POST Error**: `frappe.exceptions.ValidationError: Please set the document name`

### Employee Grievance

* **POST Error**: `frappe.exceptions.LinkValidationError: Could not find Grievance Type: Test Grievance Type, Grievance Against: Test grievance_against`

### Employee Health Insurance


### Employee Incentive


### Employee Onboarding


### Employee Onboarding Template


### Employee Other Income

* **POST Error**: `frappe.exceptions.LinkValidationError: Could not find Payroll Period: Test Payroll Period`

### Employee Performance Feedback

* **POST Error**: `frappe.exceptions.LinkValidationError: Could not find Appraisal: Test Appraisal`

### Employee Promotion


### Employee Referral

* **POST Error**: `frappe.exceptions.InvalidEmailAddressError: Test is not a valid Email Address`

### Employee Separation


### Employee Separation Template


### Employee Skill Map

* **POST Error**: `frappe.exceptions.ValidationError: Employee is required`

### Employee Tax Exemption Category

* **POST Error**: `frappe.exceptions.ValidationError: Please set the document name`

### Employee Tax Exemption Declaration

* **POST Error**: `frappe.exceptions.LinkValidationError: Could not find Payroll Period: Test Payroll Period`

### Employee Tax Exemption Proof Submission

* **POST Error**: `frappe.exceptions.LinkValidationError: Could not find Payroll Period: Test Payroll Period`

### Employee Tax Exemption Sub Category

* **POST Error**: `frappe.exceptions.LinkValidationError: Could not find Tax Exemption Category: Test Employee Tax Exemption Category`

### Employee Transfer

* **POST Error**: `TypeError: 'str' object does not support item assignment`

### Employment Type


### Exit Interview

* **POST Error**: `frappe.exceptions.DuplicateEntryError: Exit Interview <a href="http://localhost:8080/desk/exit-interview/HR-EXIT-INT-00002">HR-EXIT-INT-00002</a> already exists for Employee: <strong>HR-EMP-00001</strong>`

### Expense Claim


### Expense Claim Type


### Full and Final Statement


### Goal


### Gratuity

* **POST Error**: `frappe.exceptions.ValidationError: Employee: <strong>HR-EMP-00001</strong> have to complete minimum 5 years for gratuity`

### Gratuity Rule

* **POST Error**: `TypeError: 'str' object does not support item assignment`
* **PUT Error**: `frappe.exceptions.MandatoryError: [Gratuity Rule, Indian Standard Gratuity Rule]: applicable_earnings_component`

### Grievance Type

* **POST Error**: `frappe.exceptions.ValidationError: Please set the document name`

### Holiday List Assignment

* **POST Error**: `frappe.exceptions.LinkValidationError: Could not find Assigned To: Test assigned_to`

### Identification Document Type

* **POST Error**: `frappe.exceptions.ValidationError: Identification Document Type is required`

### Income Tax Slab

* **POST Error**: `TypeError: 'str' object does not support item assignment`

### Interest


### Interview

* **POST Error**: `frappe.exceptions.LinkValidationError: Could not find Interview Type: Test Interview Type`

### Interview Feedback

* **POST Error**: `TypeError: 'str' object does not support item assignment`

### Interview Round

* **POST Error**: `TypeError: 'str' object does not support item assignment`

### Interview Type

* **POST Error**: `TypeError: 'str' object does not support item assignment`

### Job Applicant

* **POST Error**: `frappe.exceptions.InvalidEmailAddressError: Test is not a valid Email Address`

### Job Applicant Source


### Job Offer

* **POST Error**: `frappe.exceptions.ValidationError: Job Offer: <strong>HR-OFF-2026-00001</strong> is already for Job Applicant: <strong>rahul.gupta@example.com</strong>`

### Job Offer Term Template

* **POST Error**: `frappe.exceptions.ValidationError: Title is required`

### Job Opening


### Job Opening Template


### Job Requisition


### KRA


### Leave Adjustment

* **POST Error**: `frappe.exceptions.MandatoryError: [Leave Adjustment, HR-LAD-2026-00001]: leave_allocation`

### Leave Allocation

* **POST Error**: `frappe.exceptions.ValidationError: To date cannot be before from date`

### Leave Application

* **POST Error**: `hrms.hr.doctype.leave_application.leave_application.AttendanceAlreadyMarkedError: Attendance for employee HR-EMP-00001 is already marked for the following dates: <br><ul><li><a href="http://localhost:8080/desk/attendance/HR-ATT-2026-00001">02-06-2025</a></li></ul>`
* **PUT Error**: `hrms.hr.doctype.leave_application.leave_application.AttendanceAlreadyMarkedError: Attendance for employee HR-EMP-00005 is already marked for the following dates: <br><ul><li><a href="http://localhost:8080/desk/attendance/HR-ATT-2026-00058">03-06-2025</a></li><li><a href="http://localhost:8080/desk/attendance/HR-ATT-2026-00059">04-06-2025</a></li></ul>`

### Leave Block List

* **POST Error**: `TypeError: 'str' object does not support item assignment`

### Leave Encashment

* **POST Error**: `frappe.exceptions.LinkValidationError: Could not find Leave Period: Test Leave Period`

### Leave Ledger Entry


### Leave Period

* **POST Error**: `frappe.exceptions.ValidationError: To date can not be equal or less than from date`

### Leave Policy

* **POST Error**: `TypeError: 'str' object does not support item assignment`

### Leave Policy Assignment


### Leave Type


### Offer Term


### Overtime Slip

* **POST Error**: `TypeError: 'str' object does not support item assignment`

### Overtime Type

* **POST Error**: `frappe.exceptions.ValidationError: Please set the document name`

### Payroll Correction

* **POST Error**: `frappe.exceptions.LinkValidationError: Could not find Payroll Period: Test Payroll Period`

### Payroll Entry


### Payroll Period

* **POST Error**: `frappe.exceptions.ValidationError: Please set the document name`

### Purpose of Travel

* **POST Error**: `frappe.exceptions.ValidationError: Purpose of Travel is required`

### PWA Notification


### Retention Bonus

* **POST Error**: `frappe.exceptions.ValidationError: Bonus Payment Date cannot be a past date`

### Salary Component


### Salary Slip

* **POST Error**: `frappe.exceptions.ValidationError: Please assign a Salary Structure for Employee <strong>Arjun Menon</strong> applicable from or before <strong></strong> first`

### Salary Structure

* **POST Error**: `frappe.exceptions.ValidationError: Please set the document name`

### Salary Structure Assignment


### Salary Withholding


### Shift Assignment


### Shift Assignment Tool

* **PUT Error**: `Request failed with status code 417`

### Shift Location


### Shift Request

* **POST Error**: `frappe.exceptions.ValidationError: Only Approvers can Approve this Request.`

### Shift Schedule

* **POST Error**: `TypeError: 'str' object does not support item assignment`

### Shift Schedule Assignment

* **POST Error**: `frappe.exceptions.LinkValidationError: Could not find Shift Schedule: Test Shift Schedule`

### Shift Type

* **POST Error**: `frappe.exceptions.ValidationError: Please set the document name`

### Skill

* **POST Error**: `frappe.exceptions.ValidationError: Skill Name is required`

### Staffing Plan

* **POST Error**: `TypeError: 'str' object does not support item assignment`

### Training Event

* **POST Error**: `frappe.exceptions.ValidationError: End time cannot be before start time`

### Training Feedback

* **POST Error**: `frappe.exceptions.ValidationError: Training Event must be submitted`

### Training Program


### Training Result

* **POST Error**: `frappe.exceptions.ValidationError: Training Event must be submitted`

### Travel Request

* **POST Error**: `frappe.exceptions.LinkValidationError: Could not find Purpose of Travel: Test Purpose of Travel`

### Upload Attendance

* **PUT Error**: `Request failed with status code 417`

### Vehicle Log

* **POST Error**: `frappe.exceptions.LinkValidationError: Could not find License Plate: Test Vehicle`

### Vehicle Service Item


