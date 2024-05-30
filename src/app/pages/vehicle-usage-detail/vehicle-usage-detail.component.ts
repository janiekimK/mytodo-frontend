import {Component, OnInit} from '@angular/core';
import {Vehicle} from '../../dataaccess/vehicle';
import {UntypedFormBuilder, UntypedFormControl, UntypedFormGroup} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {HeaderService} from '../../service/header.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {TranslateService} from '@ngx-translate/core';
import {VehicleUsage} from '../../dataaccess/vehicleUsage';
import {Employee} from '../../dataaccess/employee';
import {BaseComponent} from '../../components/base/base.component';
import {VehicleUsageService} from '../../service/vehicle-usage.service';
import {VehicleService} from '../../service/vehicle.service';
import {EmployeeService} from '../../service/employee.service';

@Component({
  selector: 'app-vehicle-usage-detail',
  templateUrl: './vehicle-usage-detail.component.html',
  styleUrls: ['./vehicle-usage-detail.component.scss']
})
export class VehicleUsageDetailComponent extends BaseComponent implements OnInit {

  vehicleUsage = new VehicleUsage();
  vehicles: Vehicle[] = [];
  employees: Employee[] = [];

  public objForm = new UntypedFormGroup({
    fromDate: new UntypedFormControl(''),
    toDate: new UntypedFormControl(''),
    fromLocation: new UntypedFormControl(''),
    toLocation: new UntypedFormControl(''),
    km: new UntypedFormControl(''),
    text: new UntypedFormControl(''),
    vehicleId: new UntypedFormControl(''),
    employeeId: new UntypedFormControl('')
  });

  constructor(private router: Router, private headerService: HeaderService, private route: ActivatedRoute,
              private vehicleUsageService: VehicleUsageService, private vehicleService: VehicleService,
              private snackBar: MatSnackBar, private employeeService: EmployeeService,
              protected override translate: TranslateService, private fb: UntypedFormBuilder) {
    super(translate);
  }

  ngOnInit(): void {

    if (this.route.snapshot.paramMap.get('id') !== null) {
      const id = Number.parseInt(this.route.snapshot.paramMap.get('id') as string);
      this.vehicleUsageService.getOne(id).subscribe(obj => {
        this.vehicleUsage = obj;
        this.headerService.setPage('nav.vehicleUsage_edit');
        this.objForm = this.fb.group(obj);
        this.objForm.addControl('vehicleId', new UntypedFormControl(obj.vehicle.id));
        this.objForm.addControl('employeeId', new UntypedFormControl(obj.employee.id));
      });
    } else {
      this.headerService.setPage('nav.vehicleUsage_new');
    }

    this.vehicleService.getList().subscribe(obj => {
      this.vehicles = obj;
    });
    this.employeeService.getList().subscribe(obj => {
      this.employees = obj;
    });
  }

  async back() {
    await this.router.navigate(['vehicle-usages']);
  }

  async save(formData: any) {
    this.vehicleUsage = Object.assign(formData);

    this.vehicleUsage.vehicle = this.vehicles.find(o => o.id === formData.vehicleId) as Vehicle;
    this.vehicleUsage.employee = this.employees.find(o => o.id === formData.employeeId) as Employee;

    if (this.vehicleUsage.id) {
      this.vehicleUsageService.update(this.vehicleUsage).subscribe({
        next: () => {
          this.snackBar.open(this.messageSaved, this.messageClose, {duration: 5000});
          this.back();
        },
        error: () => {
          this.snackBar.open(this.messageError, this.messageClose, {duration: 5000, politeness: 'assertive'});
        }
      });
    } else {
      this.vehicleUsageService.save(this.vehicleUsage).subscribe({
        next: () => {
          this.snackBar.open(this.messageNewSaved, this.messageClose, {duration: 5000});
          this.back();
        },
        error: () => {
          this.snackBar.open(this.messageNewError, this.messageClose, {duration: 5000, politeness: 'assertive'});
        }
      });
    }
  }

}
