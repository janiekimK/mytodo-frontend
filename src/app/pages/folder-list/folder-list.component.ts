import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { HeaderService } from '../../service/header.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmDialogComponent } from '../../components/confirm-dialog/confirm-dialog.component';
import { Folder } from '../../dataaccess/folder';
import { BaseComponent } from '../../components/base/base.component';

@Component({
  selector: 'app-folder-list',
  templateUrl: './folder-list.component.html',
  styleUrls: ['./folder-list.component.scss'],
})
export class FolderListComponent
  extends BaseComponent
  implements OnInit, AfterViewInit
{
  folderDataSource = new MatTableDataSource<Folder>();
  @ViewChild(MatPaginator) paginator?: MatPaginator;

  columns = ['name', 'actions'];

  public constructor(
    private folderService: FolderService,
    private dialog: MatDialog,
    private headerService: HeaderService,
    private router: Router,
    private snackBar: MatSnackBar,
    protected override translate: TranslateService
  ) {
    super(translate);
    this.headerService.setPage('nav.folders');
  }

  async ngOnInit() {
    await this.reloadData();
  }

  ngAfterViewInit() {
    if (this.paginator) {
      this.folderDataSource.paginator = this.paginator;
    }
  }

  reloadData() {
    this.folderService.getList().subscribe((obj) => {
      this.folderDataSource.data = obj;
    });
  }

  async edit(e: Folder) {
    await this.router.navigate(['folder', e.id]);
  }

  async add() {
    await this.router.navigate(['folder']);
  }

  delete(e: Folder) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: '400px',
      data: {
        title: 'dialogs.title_delete',
        message: 'dialogs.message_delete',
      },
    });

    dialogRef.afterClosed().subscribe((dialogResult) => {
      if (dialogResult === true) {
        this.folderService.delete(e.id).subscribe({
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
