import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Task } from '../dataaccess/task';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  readonly backendUrl = 'Task';

  constructor(private http: HttpClient) {}

  public getList(): Observable<Task[]> {
    return this.http.get<Task[]>(environment.backendBaseUrl + this.backendUrl);
  }

  public getOne(id: number): Observable<Task> {
    return this.http.get<Task>(
      environment.backendBaseUrl + this.backendUrl + `/${id}`
    );
  }

  public update(Task: Task): Observable<Task> {
    return this.http.put<Task>(
      environment.backendBaseUrl + this.backendUrl + `/${Task.id}`,
      Task
    );
  }

  public save(Task: Task): Observable<Task> {
    return this.http.post<Task>(
      environment.backendBaseUrl + this.backendUrl,
      Task
    );
  }

  public delete(id: number): Observable<HttpResponse<string>> {
    return this.http.delete<string>(
      environment.backendBaseUrl + this.backendUrl + `/${id}`,
      { observe: 'response' }
    );
  }
}
