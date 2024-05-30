import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {HeaderService} from '../../service/header.service';
import {Vehicle} from '../../dataaccess/vehicle';
import {MatSnackBar} from '@angular/material/snack-bar';
import {TranslateService} from '@ngx-translate/core';
import {UntypedFormBuilder, UntypedFormControl, UntypedFormGroup} from '@angular/forms';
import {BaseComponent} from '../../components/base/base.component';
import {VehicleService} from '../../service/vehicle.service';

@Component({
  selector: 'app-vehicle-detail',
  templateUrl: './vehicle-detail.component.html',
  styleUrls: ['./vehicle-detail.component.scss']
})
export class VehicleDetailComponent extends BaseComponent implements OnInit {

  vehicle = new Vehicle();
  public objForm = new UntypedFormGroup({
    licence: new UntypedFormControl(''),
    vehicleType: new UntypedFormControl(''),
    description: new UntypedFormControl('')
  });

  constructor(private router: Router, private headerService: HeaderService, private route: ActivatedRoute,
              private vehicleService: VehicleService, private snackBar: MatSnackBar,
              protected override translate: TranslateService, private formBuilder: UntypedFormBuilder) {
    super(translate);
  }

  ngOnInit(): void {
    if (this.route.snapshot.paramMap.get('id') !== null) {
      const id = Number.parseInt(this.route.snapshot.paramMap.get('id') as string);
      this.vehicleService.getOne(id).subscribe(obj => {
        this.vehicle = obj;
        this.headerService.setPage('nav.vehicle_edit');
        this.objForm = this.formBuilder.group(obj);
      });
    } else {
      this.headerService.setPage('nav.vehicle_new');
      this.objForm = this.formBuilder.group(this.vehicle);
    }
  }

  async back() {
    await this.router.navigate(['vehicles']);
  }

  async save(formData: any) {
    this.vehicle = Object.assign(formData);

    if (this.vehicle.id) {
      this.vehicleService.update(this.vehicle).subscribe({
        next: () => {
          this.snackBar.open(this.messageSaved, this.messageClose, {duration: 5000});
          this.back();
        },
        error: () => {
          this.snackBar.open(this.messageError, this.messageClose, {duration: 5000, politeness: 'assertive'});
        }
      });
    } else {
      this.vehicleService.save(this.vehicle).subscribe({
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
