import { Component, OnInit } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HeaderService } from '../../service/header.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { Employee } from '../../dataaccess/employee';
import { BaseComponent } from '../../components/base/base.component';
import { EmployeeService } from '../../service/employee.service';
import { Department } from '../../dataaccess/folder';
import { DepartmentService } from '../../service/folder.service';

@Component({
  selector: 'app-employee-detail',
  templateUrl: './employee-detail.component.html',
  styleUrls: ['./employee-detail.component.scss'],
})
export class EmployeeDetailComponent extends BaseComponent implements OnInit {
  employee = new Employee();
  departments: Department[] = [];

  public objForm = new UntypedFormGroup({
    badge: new UntypedFormControl(''),
    name: new UntypedFormControl(''),
    firstname: new UntypedFormControl(''),
    departmentId: new UntypedFormControl(''),
  });

  constructor(
    private router: Router,
    private headerService: HeaderService,
    private route: ActivatedRoute,
    private employeeService: EmployeeService,
    private snackBar: MatSnackBar,
    protected override translate: TranslateService,
    private formBuilder: UntypedFormBuilder,
    private departmentService: DepartmentService
  ) {
    super(translate);
  }

  ngOnInit(): void {
    if (this.route.snapshot.paramMap.get('id') !== null) {
      const id = Number.parseInt(
        this.route.snapshot.paramMap.get('id') as string
      );
      this.employeeService.getOne(id).subscribe((obj) => {
        this.employee = obj;
        this.headerService.setPage('nav.employee_edit');
        this.objForm = this.formBuilder.group(obj);
        this.objForm.addControl(
          'departmentId',
          new UntypedFormControl(obj.department.id)
        );
      });
    } else {
      this.headerService.setPage('nav.employee_new');
    }
    this.departmentService.getList().subscribe((obj) => {
      this.departments = obj;
    });
  }

  async back() {
    await this.router.navigate(['employees']);
  }

  async save(formData: any) {
    this.employee = Object.assign(formData);

    this.employee.department = this.departments.find(
      (o) => o.id === formData.departmentId
    ) as Department;

    if (this.employee.id) {
      this.employeeService.update(this.employee).subscribe({
        next: () => {
          this.snackBar.open(this.messageSaved, this.messageClose, {
            duration: 5000,
          });
          this.back();
        },
        error: () => {
          this.snackBar.open(this.messageError, this.messageClose, {
            duration: 5000,
            politeness: 'assertive',
          });
        },
      });
    } else {
      this.employeeService.save(this.employee).subscribe({
        next: () => {
          this.snackBar.open(this.messageNewSaved, this.messageClose, {
            duration: 5000,
          });
          this.back();
        },
        error: () => {
          this.snackBar.open(this.messageNewError, this.messageClose, {
            duration: 5000,
            politeness: 'assertive',
          });
        },
      });
    }
  }
}
