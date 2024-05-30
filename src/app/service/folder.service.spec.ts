import { TestBed } from '@angular/core/testing';

import { FolderService } from './folder.service';
import { createSpyFromClass, Spy } from 'jasmine-auto-spies';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Folder } from '../dataaccess/folder';

describe('FolderService', () => {
  let service: FolderService;
  let httpSpy: Spy<HttpClient>;

  const fakeFolders: Folder[] = [
    {
      id: 1,
      name: 'Folder 1',
    },
    {
      id: 2,
      name: 'Folder 2',
    },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: HttpClient, useValue: createSpyFromClass(HttpClient) },
      ],
    });
    service = TestBed.inject(FolderService);
    httpSpy = TestBed.inject<any>(HttpClient);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  it('should return a list of Folders', (done: DoneFn) => {
    httpSpy.get.and.nextWith(fakeFolders);

    service.getList().subscribe({
      next: (Folders) => {
        expect(Folders).toHaveSize(fakeFolders.length);
        done();
      },
      error: done.fail,
    });
    expect(httpSpy.get.calls.count()).toBe(1);
  });
  it('should create a new Folder', (done: DoneFn) => {
    const newFolder: Folder = {
      id: 3,
      name: 'Folder 3',
    };

    httpSpy.post.and.nextWith(newFolder);

    service.save(newFolder).subscribe({
      next: (Folder) => {
        expect(Folder).toEqual(newFolder);
        done();
      },
      error: done.fail,
    });
    expect(httpSpy.post.calls.count()).toBe(1);
  });

  it('should update an Folder', (done: DoneFn) => {
    const Folder = fakeFolders[0];
    Folder.name = 'Updated Folder';

    httpSpy.put.and.nextWith(Folder);

    service.update(Folder).subscribe({
      next: (Folder) => {
        expect(Folder.name).toEqual('Updated Folder');
        done();
      },
      error: done.fail,
    });
    expect(httpSpy.put.calls.count()).toBe(1);
  });

  it('should delete an existing Folder', (done: DoneFn) => {
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
