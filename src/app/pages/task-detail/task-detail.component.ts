import { Component, OnInit } from '@angular/core';
import { Tag } from '../../dataaccess/tag';
import {
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HeaderService } from '../../service/header.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { Task } from '../../dataaccess/task';
import { Employee } from '../../dataaccess/employee';
import { BaseComponent } from '../../components/base/base.component';
import { TaskService } from '../../service/task.service';
import { EmployeeService } from '../../service/employee.service';

@Component({
  selector: 'app-tag-detail',
  templateUrl: './tag-detail.component.html',
  styleUrls: ['./tag-detail.component.scss'],
})
export class TaskDetailComponent extends BaseComponent implements OnInit {
  task = new Task();
  tags: Tag[] = [];
  employees: Employee[] = [];

  public objForm = new UntypedFormGroup({
    title: new UntypedFormControl(''),
    description: new UntypedFormControl(''),
    dueDate: new UntypedFormControl(''),
    priority: new UntypedFormControl(''),
    folderId: new UntypedFormControl(''),
    tagId: new UntypedFormControl(''),
    employeeId: new UntypedFormControl(''),
  });

  constructor(
    private router: Router,
    private headerService: HeaderService,
    private route: ActivatedRoute,
    private taskService: TaskService,
    private tagService: tagService,
    private snackBar: MatSnackBar,
    private employeeService: EmployeeService,
    protected override translate: TranslateService,
    private fb: UntypedFormBuilder
  ) {
    super(translate);
  }

  ngOnInit(): void {
    if (this.route.snapshot.paramMap.get('id') !== null) {
      const id = Number.parseInt(
        this.route.snapshot.paramMap.get('id') as string
      );
      this.taskService.getOne(id).subscribe((obj) => {
        this.task = obj;
        this.headerService.setPage('nav.task_edit');
        this.objForm = this.fb.group(obj);
        this.objForm.addControl('tagId', new UntypedFormControl(obj.tag.id));
        this.objForm.addControl(
          'employeeId',
          new UntypedFormControl(obj.employee.id)
        );
      });
    } else {
      this.headerService.setPage('nav.task_new');
    }

    this.tagService.getList().subscribe((obj) => {
      this.tags = obj;
    });
    this.employeeService.getList().subscribe((obj) => {
      this.employees = obj;
    });
  }

  async back() {
    await this.router.navigate(['tag']);
  }

  async save(formData: any) {
    this.task = Object.assign(formData);

    this.task.tag = this.tags.find((o) => o.id === formData.tagId) as Tag;
    this.task.employee = this.employees.find(
      (o) => o.id === formData.employeeId
    ) as Employee;

    if (this.task.id) {
      this.taskService.update(this.task).subscribe({
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
      this.taskService.save(this.task).subscribe({
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
