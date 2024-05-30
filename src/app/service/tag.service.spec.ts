import { TestBed } from '@angular/core/testing';

import { TagService } from './tag.service';
import { createSpyFromClass, Spy } from 'jasmine-auto-spies';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Tag } from '../dataaccess/tag';

describe('TagService', () => {
  let service: TagService;
  let httpSpy: Spy<HttpClient>;

  const fakeTags: Tag[] = [
    {
      id: 1,
      tagType: 'CAR',
      description: 'Test tag 1',
      licence: '123',
    },
    {
      id: 2,
      tagType: 'CAR',
      description: 'Test tag 2',
      licence: '456',
    },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: HttpClient, useValue: createSpyFromClass(HttpClient) },
      ],
    });
    service = TestBed.inject(TagService);
    httpSpy = TestBed.inject<any>(HttpClient);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  it('should return a list of tags', (done: DoneFn) => {
    httpSpy.get.and.nextWith(fakeTags);

    service.getList().subscribe({
      next: (tags) => {
        expect(tags).toHaveSize(fakeTags.length);
        done();
      },
      error: done.fail,
    });
    expect(httpSpy.get.calls.count()).toBe(1);
  });
  it('should create a new tag', (done: DoneFn) => {
    const newTag: tag = {
      id: 3,
      tagType: 'CAR',
      description: 'Test tag 3',
      licence: '789',
    };

    httpSpy.post.and.nextWith(newTag);

    service.save(newTag).subscribe({
      next: (tag) => {
        expect(tag).toEqual(newTag);
        done();
      },
      error: done.fail,
    });
    expect(httpSpy.post.calls.count()).toBe(1);
  });

  it('should update an tag', (done: DoneFn) => {
    const tag = fakeTags[0];
    tag.description = 'Updated Tag';

    httpSpy.put.and.nextWith(tag);

    service.update(tag).subscribe({
      next: (customer) => {
        expect(customer.description).toEqual('Updated Tag');
        done();
      },
      error: done.fail,
    });
    expect(httpSpy.put.calls.count()).toBe(1);
  });

  it('should delete an existing tag', (done: DoneFn) => {
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
