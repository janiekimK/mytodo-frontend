import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Folder } from '../dataaccess/folder';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class folderService {
  readonly backendUrl = 'folder';

  constructor(private http: HttpClient) {}

  public getList(): Observable<Folder[]> {
    return this.http.get<Folder[]>(
      environment.backendBaseUrl + this.backendUrl
    );
  }

  public getOne(id: number): Observable<Folder> {
    return this.http.get<Folder>(
      environment.backendBaseUrl + this.backendUrl + `/${id}`
    );
  }

  public update(folder: Folder): Observable<Folder> {
    return this.http.put<Folder>(
      environment.backendBaseUrl + this.backendUrl + `/${folder.id}`,
      folder
    );
  }

  public save(folder: Folder): Observable<Folder> {
    return this.http.post<Folder>(
      environment.backendBaseUrl + this.backendUrl,
      folder
    );
  }

  public delete(id: number): Observable<HttpResponse<string>> {
    return this.http.delete<string>(
      environment.backendBaseUrl + this.backendUrl + `/${id}`,
      { observe: 'response' }
    );
  }
}
