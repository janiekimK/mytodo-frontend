import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HeaderService } from '../../service/header.service';
import { Tag } from '../../dataaccess/tag';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import {
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
} from '@angular/forms';
import { BaseComponent } from '../../components/base/base.component';
import { TagService } from '../../service/tag.service';

@Component({
  selector: 'app-tag-detail',
  templateUrl: './tag-detail.component.html',
  styleUrls: ['./tag-detail.component.scss'],
})
export class TagDetailComponent extends BaseComponent implements OnInit {
  tag = new Tag();
  public objForm = new UntypedFormGroup({
    name: new UntypedFormControl(''),
    task: new UntypedFormControl(''),
    description: new UntypedFormControl(''),
  });

  constructor(
    private router: Router,
    private headerService: HeaderService,
    private route: ActivatedRoute,
    private TagService: TagService,
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
      this.tagService.getOne(id).subscribe((obj) => {
        this.tag = obj;
        this.headerService.setPage('nav.tag_edit');
        this.objForm = this.formBuilder.group(obj);
      });
    } else {
      this.headerService.setPage('nav.tag_new');
      this.objForm = this.formBuilder.group(this.tag);
    }
  }

  async back() {
    await this.router.navigate(['tags']);
  }

  async save(formData: any) {
    this.tag = Object.assign(formData);

    if (this.tag.id) {
      this.tagService.update(this.tag).subscribe({
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
      this.tagService.save(this.tag).subscribe({
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
