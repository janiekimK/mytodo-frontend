import {Injectable} from '@angular/core';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../environments/environment';
import { Tag } from '../dataaccess/tag';

@Injectable({
  providedIn: 'root',
})
export class TagService {
  readonly backendUrl = 'Tag';

  constructor(private http: HttpClient) {}

  public getList(): Observable<Tag[]> {
    return this.http.get<Tag[]>(environment.backendBaseUrl + this.backendUrl);
  }

  public getOne(id: number): Observable<Tag> {
    return this.http.get<Tag>(
      environment.backendBaseUrl + this.backendUrl + `/${id}`
    );
  }

  public update(Tag: Tag): Observable<Tag> {
    return this.http.put<Tag>(
      environment.backendBaseUrl + this.backendUrl + `/${Tag.id}`,
      Tag
    );
  }

  public save(Tag: Tag): Observable<Tag> {
    return this.http.post<Tag>(
      environment.backendBaseUrl + this.backendUrl,
      Tag
    );
  }

  public delete(id: number): Observable<HttpResponse<string>> {
    return this.http.delete<string>(
      environment.backendBaseUrl + this.backendUrl + `/${id}`,
      { observe: 'response' }
    );
  }
}
