import {Component, OnDestroy, OnInit} from '@angular/core';
import {HeaderService} from '../../service/header.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './app-header.component.html',
  styleUrls: ['./app-header.component.scss']
})
export class AppHeaderComponent implements OnInit, OnDestroy {

  currentPage = '';
  private subPage?: Subscription;

  constructor(private headerService: HeaderService) {
  }

  async ngOnInit() {
    this.subPage = this.headerService.pageObservable.subscribe(page => {
      this.currentPage = page;
    });
  }

  ngOnDestroy(): void {
    this.subPage?.unsubscribe();
  }

}
