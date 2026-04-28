import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CountryHome } from './country-home';

describe('CountryHome', () => {
  let component: CountryHome;
  let fixture: ComponentFixture<CountryHome>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CountryHome]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CountryHome);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
