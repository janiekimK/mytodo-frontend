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
import { Folder } from '../../dataaccess/folder';
import { FolderService } from '../../service/folder.service';

@Component({
  selector: 'app-employee-detail',
  templateUrl: './employee-detail.component.html',
  styleUrls: ['./employee-detail.component.scss'],
})
export class EmployeeDetailComponent extends BaseComponent implements OnInit {
  employee = new Employee();
  folders: Folder[] = [];

  public objForm = new UntypedFormGroup({
    name: new UntypedFormControl(''),
    firstname: new UntypedFormControl(''),
    folderId: new UntypedFormControl(''),
  });

  constructor(
    private router: Router,
    private headerService: HeaderService,
    private route: ActivatedRoute,
    private employeeService: EmployeeService,
    private folderService: FolderService,
    private snackBar: MatSnackBar,
    protected override translate: TranslateService,
    private formBuilder: UntypedFormBuilder
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
          'folderId',
          new UntypedFormControl(obj.folder.id)
        );
      });
    } else {
      this.headerService.setPage('nav.employee_new');
    }
    this.folderService.getList().subscribe((obj: Folder[]) => {
      this.folders = obj;
    });
  }

  async back() {
    await this.router.navigate(['employees']);
  }

  async save(formData: any) {
    this.employee = Object.assign(formData);

    this.employee.folder = this.folders.find(
      (o) => o.id === formData.folderId
    ) as Folder;

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
