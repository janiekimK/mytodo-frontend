import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {Vehicle} from '../../dataaccess/vehicle';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {HeaderService} from '../../service/header.service';
import {Router} from '@angular/router';
import {ConfirmDialogComponent} from '../../components/confirm-dialog/confirm-dialog.component';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {TranslateService} from '@ngx-translate/core';
import {BaseComponent} from '../../components/base/base.component';
import {VehicleService} from '../../service/vehicle.service';

@Component({
  selector: 'app-vehicle-list',
  templateUrl: './vehicle-list.component.html',
  styleUrls: ['./vehicle-list.component.scss']
})
export class VehicleListComponent extends BaseComponent implements OnInit, AfterViewInit {
  vehicleDataSource = new MatTableDataSource<Vehicle>();
  @ViewChild(MatPaginator) paginator?: MatPaginator;

  columns = ['vehicleType', 'licence', 'description', 'actions'];

  public constructor(private vehicleService: VehicleService, private dialog: MatDialog,
                     private headerService: HeaderService, private router: Router, private snackBar: MatSnackBar,
                     protected override translate: TranslateService) {
    super(translate);
    this.headerService.setPage('nav.vehicles');
  }

  async ngOnInit() {
    await this.reloadData();
  }

  ngAfterViewInit() {
    if (this.paginator) {
      this.vehicleDataSource.paginator = this.paginator;
    }
  }

  reloadData() {
    this.vehicleService.getList().subscribe(obj => {
      this.vehicleDataSource.data = obj;
    });
  }

  async edit(e: Vehicle) {
    await this.router.navigate(['vehicle', e.id]);
  }

  async add() {
    await this.router.navigate(['vehicle']);
  }

  delete(e: Vehicle) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: '400px',
      data: {
        title: 'dialogs.title_delete',
        message: 'dialogs.message_delete'
      }
    });

    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult === true) {
        this.vehicleService.delete(e.id).subscribe({
          next: response => {
            if (response.status === 200) {
              this.snackBar.open(this.deletedMessage, this.closeMessage, {duration: 5000});
              this.reloadData();
            } else {
              this.snackBar.open(this.deleteErrorMessage, this.closeMessage, {duration: 5000});
            }
          },
          error: () => this.snackBar.open(this.deleteErrorMessage, this.closeMessage, {duration: 5000})
        });
      }
    });
  }
}
