import { TestBed, inject } from '@angular/core/testing';

import { PixelBoardService } from './pixel-board.service';

describe('PixelBoardService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PixelBoardService]
    });
  });

  it('should be created', inject([PixelBoardService], (service: PixelBoardService) => {
    expect(service).toBeTruthy();
  }));
});
