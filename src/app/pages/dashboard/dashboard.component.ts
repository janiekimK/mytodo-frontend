import {Component, OnInit} from '@angular/core';
import {AppAuthService} from '../../service/app.auth.service';
import {HeaderService} from '../../service/header.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  useralias = '';
  username = '';

  constructor(private authService: AppAuthService, private headerService: HeaderService) {
    this.headerService.setPage('nav.dashboard');
  }

  ngOnInit(): void {
    this.authService.usernameObservable.subscribe(name => {
      this.username = name;
    });
    this.authService.useraliasObservable.subscribe(alias => {
      this.useralias = alias;
    });
  }

}
