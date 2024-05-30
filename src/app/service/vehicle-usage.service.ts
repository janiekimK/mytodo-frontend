import {Injectable} from '@angular/core';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../environments/environment';
import {VehicleUsage} from '../dataaccess/vehicleUsage';

@Injectable({
  providedIn: 'root'
})
export class VehicleUsageService {
  readonly backendUrl = 'vehicleusage';

  constructor(private http: HttpClient) {
  }

  public getList(): Observable<VehicleUsage[]> {
    return this.http.get<VehicleUsage[]>(environment.backendBaseUrl + this.backendUrl);
  }

  public getOne(id: number): Observable<VehicleUsage> {
    return this.http.get<VehicleUsage>(environment.backendBaseUrl + this.backendUrl + `/${id}`);
  }

  public update(vehicleUsage: VehicleUsage): Observable<VehicleUsage> {
    return this.http.put<VehicleUsage>(environment.backendBaseUrl + this.backendUrl + `/${vehicleUsage.id}`, vehicleUsage);
  }

  public save(vehicleUsage: VehicleUsage): Observable<VehicleUsage> {
    return this.http.post<VehicleUsage>(environment.backendBaseUrl + this.backendUrl, vehicleUsage);
  }

  public delete(id: number): Observable<HttpResponse<string>> {
    return this.http.delete<string>(environment.backendBaseUrl + this.backendUrl + `/${id}`, {observe: 'response'});
  }
}
