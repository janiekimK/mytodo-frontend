import {TestBed} from '@angular/core/testing';

import {VehicleUsageService} from './vehicle-usage.service';
import {createSpyFromClass, Spy} from 'jasmine-auto-spies';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {VehicleUsage} from '../dataaccess/vehicleUsage';
import {Vehicle} from '../dataaccess/vehicle';
import {Employee} from '../dataaccess/employee';

describe('VehicleUsageService', () => {
  let service: VehicleUsageService;
  let httpSpy: Spy<HttpClient>;

  const fakeVehicleUsages: VehicleUsage[] = [
    {
      id: 1,
      vehicle: new Vehicle(),
      employee: new Employee(),
      fromDate: new Date(),
      toDate: new Date(),
      fromLocation: 'Basel',
      toLocation: 'Bellinzona',
      text: 'Work transfer',
      km: 270
    },
    {
      id: 2,
      vehicle: new Vehicle(),
      employee: new Employee(),
      fromDate: new Date(),
      toDate: new Date(),
      fromLocation: 'Basel',
      toLocation: 'Lugano',
      text: 'Work transfer',
      km: 300
    }
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {provide: HttpClient, useValue: createSpyFromClass(HttpClient)}
      ]
    });
    service = TestBed.inject(VehicleUsageService);
    httpSpy = TestBed.inject<any>(HttpClient);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  it('should return a list of vehicles usages', (done: DoneFn) => {
    httpSpy.get.and.nextWith(fakeVehicleUsages);

    service.getList().subscribe({
        next:
          vehicleUsages => {
            expect(vehicleUsages).toHaveSize(fakeVehicleUsages.length);
            done();
          },
        error: done.fail
      }
    );
    expect(httpSpy.get.calls.count()).toBe(1);
  });
  it('should create a new vehicle usage', (done: DoneFn) => {

    const newVehicleUsage: VehicleUsage = {
      id: 3,
      vehicle: new Vehicle(),
      employee: new Employee(),
      fromDate: new Date(),
      toDate: new Date(),
      fromLocation: 'Basel',
      toLocation: 'Chiasso',
      text: 'Work transfer',
      km: 340
    };

    httpSpy.post.and.nextWith(newVehicleUsage);

    service.save(newVehicleUsage).subscribe({
        next: vehicleUsage => {
          expect(vehicleUsage).toEqual(newVehicleUsage);
          done();
        },
        error: done.fail
      }
    );
    expect(httpSpy.post.calls.count()).toBe(1);
  });

  it('should update an vehicle usage', (done: DoneFn) => {

    const vehicleUsage = fakeVehicleUsages[0];
    vehicleUsage.text = 'Updated Vehicle Usage';

    httpSpy.put.and.nextWith(vehicleUsage);

    service.update(vehicleUsage).subscribe({
      next: vehicleUsage => {
        expect(vehicleUsage.text).toEqual('Updated Vehicle Usage');
        done();
      },
      error: done.fail
    });
    expect(httpSpy.put.calls.count()).toBe(1);
  });

  it('should delete an existing vehicle usage', (done: DoneFn) => {

    httpSpy.delete.and.nextWith(new HttpResponse({
      status: 200
    }));

    service.delete(1).subscribe({
      next: response => {
        expect(response.status).toBe(200);
        done();
      },
      error: done.fail
    });
    expect(httpSpy.delete.calls.count()).toBe(1);
  });
});
