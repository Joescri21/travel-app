import { Component, inject, signal } from '@angular/core';
import { Countries } from '../../../../core/services/countries';
import { Country } from '../../../../core/models/country.model';

@Component({
  selector: 'country-home',
  imports: [],
  templateUrl: './country-home.html',
  styles: ``,
})
export class CountryHome {

  private countryService = inject(Countries);

  public countries = signal<Country[]>([]);
  public searchTerm= '';

  buscarPais() {
    if (!this.searchTerm) return;

    this.countryService.getCountryByName(this.searchTerm).subscribe({
      next: (data) => this.countries.set(data),
      error: (err) => {
        console.error('Pais no encontrado', err);
        this.countries.set([])
      }
    })
  }
}
