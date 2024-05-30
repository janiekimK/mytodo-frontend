import {TestBed} from '@angular/core/testing';

import {VehicleService} from './vehicle.service';
import {createSpyFromClass, Spy} from 'jasmine-auto-spies';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {Vehicle} from '../dataaccess/vehicle';

describe('VehicleService', () => {
  let service: VehicleService;
  let httpSpy: Spy<HttpClient>;

  const fakeVehicles: Vehicle[] = [
    {
      id: 1,
      vehicleType: 'CAR',
      description: 'Test vehicle 1',
      licence: '123'
    },
    {
      id: 2,
      vehicleType: 'CAR',
      description: 'Test vehicle 2',
      licence: '456'
    }
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {provide: HttpClient, useValue: createSpyFromClass(HttpClient)}
      ]
    });
    service = TestBed.inject(VehicleService);
    httpSpy = TestBed.inject<any>(HttpClient);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  it('should return a list of vehicles', (done: DoneFn) => {
    httpSpy.get.and.nextWith(fakeVehicles);

    service.getList().subscribe({
        next:
          vehicles => {
            expect(vehicles).toHaveSize(fakeVehicles.length);
            done();
          },
        error: done.fail
      }
    );
    expect(httpSpy.get.calls.count()).toBe(1);
  });
  it('should create a new vehicle', (done: DoneFn) => {

    const newVehicle: Vehicle = {
      id: 3,
      vehicleType: 'CAR',
      description: 'Test vehicle 3',
      licence: '789'
    };

    httpSpy.post.and.nextWith(newVehicle);

    service.save(newVehicle).subscribe({
        next: vehicle => {
          expect(vehicle).toEqual(newVehicle);
          done();
        },
        error: done.fail
      }
    );
    expect(httpSpy.post.calls.count()).toBe(1);
  });

  it('should update an vehicle', (done: DoneFn) => {

    const vehicle = fakeVehicles[0];
    vehicle.description = 'Updated Vehicle';

    httpSpy.put.and.nextWith(vehicle);

    service.update(vehicle).subscribe({
      next: customer => {
        expect(customer.description).toEqual('Updated Vehicle');
        done();
      },
      error: done.fail
    });
    expect(httpSpy.put.calls.count()).toBe(1);
  });

  it('should delete an existing vehicle', (done: DoneFn) => {

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
