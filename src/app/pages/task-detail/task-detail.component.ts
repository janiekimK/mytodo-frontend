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
import { TagService } from '../../service/tag.service';
import { Folder } from 'src/app/dataaccess/folder';
@Component({
  selector: 'app-task-detail',
  templateUrl: './task-detail.component.html',
  styleUrls: ['./task-detail.component.scss'],
})
export class TaskDetailComponent extends BaseComponent implements OnInit {
  task = new Task();
  tags: Tag[] = [];
  employees: Employee[] = [];
  folders: Folder[] = [];

  public objForm = new UntypedFormGroup({
    title: new UntypedFormControl(''),
    description: new UntypedFormControl(''),
    dueDate: new UntypedFormControl(''),
    priority: new UntypedFormControl(''),
    folderId: new UntypedFormControl(''),
    tagIds: new UntypedFormControl([]),
    employeeId: new UntypedFormControl(''),
  });
  priorities: any;

  constructor(
    private router: Router,
    private headerService: HeaderService,
    private route: ActivatedRoute,
    private taskService: TaskService,
    private tagService: TagService,
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
        this.objForm = this.fb.group({
          title: new UntypedFormControl(obj.title),
          description: new UntypedFormControl(obj.description),
          dueDate: new UntypedFormControl(obj.dueDate),
          priority: new UntypedFormControl(obj.priority),
          folderId: new UntypedFormControl(obj.folder),
          tagIds: new UntypedFormControl(obj.tags.map((tag) => tag.id)),
          employeeId: new UntypedFormControl(obj.employee.id),
        });
      });
    } else {
      this.headerService.setPage('nav.task_new');
    }

    this.tagService.getList().subscribe((obj: Tag[]) => {
      this.tags = obj;
    });
    this.employeeService.getList().subscribe((obj) => {
      this.employees = obj;
    });
  }

  async back() {
    await this.router.navigate(['tasks']);
  }

  async save(formData: any) {
    this.task = {
      ...formData,
      tags: this.tags.filter((tag) => formData.tagIds.includes(tag.id)),
      employee: this.employees.find(
        (o) => o.id === formData.employeeId
      ) as Employee,
    };

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
