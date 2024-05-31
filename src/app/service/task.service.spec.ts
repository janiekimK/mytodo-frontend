import { TestBed } from '@angular/core/testing';

import { TaskService } from './task.service';
import { createSpyFromClass, Spy } from 'jasmine-auto-spies';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Task } from '../dataaccess/task';
import { Tag } from '../dataaccess/tag';
import { Employee } from '../dataaccess/employee';
import { Folder } from '../dataaccess/folder';

describe('TaskService', () => {
  let service: TaskService;
  let httpSpy: Spy<HttpClient>;

  const fakeTasks: Task[] = [
    {
      id: 1,
      title: 'Task 1',
      description: 'Description 1',
      dueDate: new Date(),
      priority: 1,
      folder: new Folder(),
      employee: new Employee(),
      tags: [new Tag()],
    },
    {
      id: 2,
      title: 'Task 2',
      description: 'Description 2',
      dueDate: new Date(),
      priority: 2,
      folder: new Folder(),
      employee: new Employee(),
      tags: [new Tag()],
    },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: HttpClient, useValue: createSpyFromClass(HttpClient) },
      ],
    });
    service = TestBed.inject(TaskService);
    httpSpy = TestBed.inject<any>(HttpClient);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return a list of Tasks', (done: DoneFn) => {
    httpSpy.get.and.nextWith(fakeTasks);

    service.getList().subscribe({
      next: (tasks) => {
        expect(tasks).toHaveSize(fakeTasks.length);
        done();
      },
      error: done.fail,
    });
    expect(httpSpy.get.calls.count()).toBe(1);
  });

  it('should create a new Task', (done: DoneFn) => {
    const newTask: Task = {
      id: 3,
      title: 'Task 3',
      description: 'Description 3',
      dueDate: new Date(),
      priority: 3,
      folder: new Folder(),
      employee: new Employee(),
      tags: [new Tag()],
    };

    httpSpy.post.and.nextWith(newTask);

    service.save(newTask).subscribe({
      next: (task) => {
        expect(task).toEqual(newTask);
        done();
      },
      error: done.fail,
    });
    expect(httpSpy.post.calls.count()).toBe(1);
  });

  it('should update a Task', (done: DoneFn) => {
    const task = { ...fakeTasks[0], title: 'Updated Task Title' };

    httpSpy.put.and.nextWith(task);

    service.update(task).subscribe({
      next: (updatedTask) => {
        expect(updatedTask.title).toEqual('Updated Task Title');
        done();
      },
      error: done.fail,
    });
    expect(httpSpy.put.calls.count()).toBe(1);
  });

  it('should delete an existing Task', (done: DoneFn) => {
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
