import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { HeaderService } from '../../service/header.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmDialogComponent } from '../../components/confirm-dialog/confirm-dialog.component';
import { Employee } from '../../dataaccess/employee';
import { BaseComponent } from '../../components/base/base.component';
import { EmployeeService } from '../../service/employee.service';

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.scss'],
})
export class EmployeeListComponent
  extends BaseComponent
  implements OnInit, AfterViewInit
{
  employeeDataSource = new MatTableDataSource<Employee>();
  @ViewChild(MatPaginator) paginator?: MatPaginator;

  columns = ['id', 'name', 'firstname', 'assignedTasks'];

  public constructor(
    private employeeService: EmployeeService,
    private dialog: MatDialog,
    private headerService: HeaderService,
    private router: Router,
    private snackBar: MatSnackBar,
    protected override translate: TranslateService
  ) {
    super(translate);
    this.headerService.setPage('nav.employees');
  }

  async ngOnInit() {
    await this.reloadData();
  }

  ngAfterViewInit() {
    if (this.paginator) {
      this.employeeDataSource.paginator = this.paginator;
    }
  }

  reloadData() {
    this.employeeService.getList().subscribe((obj) => {
      this.employeeDataSource.data = obj;
    });
  }

  async edit(e: Employee) {
    await this.router.navigate(['employee', e.id]);
  }

  async add() {
    await this.router.navigate(['employee']);
  }

  delete(e: any) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: '400px',
      data: {
        title: 'dialogs.title_delete',
        message: 'dialogs.message_delete',
      },
    });

    dialogRef.afterClosed().subscribe((dialogResult) => {
      if (dialogResult === true) {
        this.employeeService.delete(e.id).subscribe({
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
