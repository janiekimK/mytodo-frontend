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
import { Folder } from '../../dataaccess/folder';
import { folderService } from '../../service/folder.service';
import { BaseComponent } from '../../components/base/base.component';

@Component({
  selector: 'app-folder-detail',
  templateUrl: './folder-detail.component.html',
  styleUrls: ['./folder-detail.component.scss'],
})
export class FolderDetailComponent extends BaseComponent implements OnInit {
  folder = new Folder();
  public objForm = new UntypedFormGroup({
    name: new UntypedFormControl(''),
  });

  constructor(
    private router: Router,
    private headerService: HeaderService,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    protected override translate: TranslateService,
    private formBuilder: UntypedFormBuilder,
    private folderService: folderService
  ) {
    super(translate);
  }

  ngOnInit(): void {
    if (this.route.snapshot.paramMap.get('id') !== null) {
      const id = Number.parseInt(
        this.route.snapshot.paramMap.get('id') as string
      );

      this.folderService.getOne(id).subscribe((obj) => {
        this.folder = obj;
        this.headerService.setPage('nav.vehicle_edit');
        this.objForm = this.formBuilder.group(obj);
      });
    } else {
      this.headerService.setPage('nav.vehicle_new');
      this.objForm = this.formBuilder.group(this.folder);
    }
  }

  async back() {
    await this.router.navigate(['folders']);
  }

  async save(formData: any) {
    this.folder = Object.assign(formData);

    if (this.folder.id) {
      this.folderService.update(this.folder).subscribe({
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
      this.folderService.save(this.folder).subscribe({
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
