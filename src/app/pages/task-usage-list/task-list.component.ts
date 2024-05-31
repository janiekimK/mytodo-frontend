import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { HeaderService } from '../../service/header.service';
import { MatTableDataSource } from '@angular/material/table';
import { Tag } from '../../dataaccess/tag';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmDialogComponent } from '../../components/confirm-dialog/confirm-dialog.component';
import { Task } from '../../dataaccess/task';
import { BaseComponent } from '../../components/base/base.component';
import { TaskService } from '../../service/task.service';

@Component({
  selector: 'app-tag-usage-list',
  templateUrl: './tag-usage-list.component.html',
  styleUrls: ['./tag-usage-list.component.scss'],
})
export class TaskListComponent
  extends BaseComponent
  implements OnInit, AfterViewInit
{
  TaskDataSource = new MatTableDataSource<Task>();
  @ViewChild(MatPaginator) paginator?: MatPaginator;

  columns = [
    'title',
    'description',
    'dueDate',
    'priority',
    'folderId',
    'tagId',
    'employeeId',
  ];

  public constructor(
    private taskService: TaskService,
    private dialog: MatDialog,
    private headerService: HeaderService,
    private router: Router,
    private snackBar: MatSnackBar,
    protected override translate: TranslateService
  ) {
    super(translate);
    this.headerService.setPage('nav.usage');
  }

  async ngOnInit() {
    await this.reloadData();
  }

  ngAfterViewInit() {
    if (this.paginator) {
      this.TaskDataSource.paginator = this.paginator;
    }
  }

  reloadData() {
    this.taskService.getList().subscribe((obj) => {
      this.TaskDataSource.data = obj;
    });
  }

  async edit(e: Tag) {
    await this.router.navigate(['tag', e.id]);
  }

  async add() {
    await this.router.navigate(['tag']);
  }

  delete(e: Task) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: '400px',
      data: {
        title: 'dialogs.title_delete',
        message: 'dialogs.message_delete',
      },
    });

    dialogRef.afterClosed().subscribe((dialogResult) => {
      if (dialogResult === true) {
        this.taskService.delete(e.id).subscribe({
          next: (response) => {
            if (response.status === 200) {
              this.snackBar.open(this.deletedMessage, this.closeMessage, {
                duration: 5000,
              });
              this.reloadData();
            } else {
              this.snackBar.open(this.deleteErrorMessage, this.closeMessage, {
                duration: 5000,
              });
            }
          },
          error: () =>
            this.snackBar.open(this.deleteErrorMessage, this.closeMessage, {
              duration: 5000,
            }),
        });
      }
    });
  }
}
