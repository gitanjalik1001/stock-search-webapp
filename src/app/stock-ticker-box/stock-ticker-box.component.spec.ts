import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StockTickerBoxComponent } from './stock-ticker-box.component';

describe('StockTickerBoxComponent', () => {
  let component: StockTickerBoxComponent;
  let fixture: ComponentFixture<StockTickerBoxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StockTickerBoxComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StockTickerBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
