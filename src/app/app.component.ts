import {Component} from '@angular/core';
import {AppAuthService} from './service/app.auth.service';
import {OAuthService} from 'angular-oauth2-oidc';
import {TranslateService} from '@ngx-translate/core';
import {DateAdapter} from '@angular/material/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  public constructor(private authService: AppAuthService, private dateAdapter: DateAdapter<any>,
                     public oauthService: OAuthService, public translate: TranslateService) {
    translate.addLangs(['en', 'de_CH']);
    translate.setDefaultLang('en');
    this.dateAdapter.setLocale('en');

    const savedLang = localStorage.getItem('demoapp.lang');
    if (savedLang) {
      this.setLanguage(savedLang);
      translate.currentLang = savedLang;
    } else {
      translate.currentLang = 'en';
    }
  }

  logout() {
    this.authService.logout();
  }

  setLanguage(lang: string) {
    this.translate.use(lang);
    this.dateAdapter.setLocale(lang);
    localStorage.setItem('demoapp.lang', lang);
  }
}
