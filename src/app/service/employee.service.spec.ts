import { TestBed } from '@angular/core/testing';

import { EmployeeService } from './employee.service';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Employee } from '../dataaccess/employee';
import { createSpyFromClass, Spy } from 'jasmine-auto-spies';

describe('EmployeeService', () => {
  let service: EmployeeService;
  let httpSpy: Spy<HttpClient>;

  const fakeEmployees: Employee[] = [
    {
      id: 1,
      name: 'Meier',
      firstName: 'Max',
      assignedTasks: [],
    },
    {
      id: 2,
      name: 'Bianchi',
      firstName: 'Alessandra',
      assignedTasks: [],
    },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: HttpClient, useValue: createSpyFromClass(HttpClient) },
      ],
    });
    service = TestBed.inject(EmployeeService);
    httpSpy = TestBed.inject<any>(HttpClient);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  it('should return a list of employees', (done: DoneFn) => {
    httpSpy.get.and.nextWith(fakeEmployees);

    service.getList().subscribe({
      next: (employees) => {
        expect(employees).toHaveSize(fakeEmployees.length);
        done();
      },
      error: done.fail,
    });
    expect(httpSpy.get.calls.count()).toBe(1);
  });
  it('should create a new customer', (done: DoneFn) => {
    const newEmployee: Employee = {
      id: 3,
      name: 'Müller',
      firstName: 'Max',
      assignedTasks: [],
    };

    httpSpy.post.and.nextWith(newEmployee);

    service.save(newEmployee).subscribe({
      next: (employee) => {
        expect(employee).toEqual(newEmployee);
        done();
      },
      error: done.fail,
    });
    expect(httpSpy.post.calls.count()).toBe(1);
  });

  it('should update an employee', (done: DoneFn) => {
    const employee = fakeEmployees[0];
    employee.name = 'Updated Employee';

    httpSpy.put.and.nextWith(employee);

    service.update(employee).subscribe({
      next: (customer) => {
        expect(customer.name).toEqual('Updated Employee');
        done();
      },
      error: done.fail,
    });
    expect(httpSpy.put.calls.count()).toBe(1);
  });

  it('should delete an existing employee', (done: DoneFn) => {
    httpSpy.delete.and.nextWith(
      new HttpResponse({
        status: 200,
      })
    );

    service.delete(1).subscribe({
      next: (response) => {
        expect(response.status).toBe(200);
        done();
      },
      error: done.fail,
    });
    expect(httpSpy.delete.calls.count()).toBe(1);
  });
});
