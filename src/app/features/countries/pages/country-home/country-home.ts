import { Component, inject, signal } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Countries } from '../../../../core/services/countries';
import { Country } from '../../../../core/models/country.model';

@Component({
  selector: 'country-home',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DecimalPipe
  ],
  templateUrl: './country-home.html',
  styles: ``,
})
export class CountryHome {

  private countryService = inject(Countries);

  public countries = signal<Country[]>([]);
  public searchTerm= '';
  public error = signal<string | null>(null);

  buscarPais() {
    if (!this.searchTerm) return;

    this.countryService.getCountryByName(this.searchTerm).subscribe({
      next: (data) => {
        this.countries.set(data);
        this.error.set(null); // Limpiamos el error si la búsqueda es exitosa
      },
      error: (err) => {
        this.error.set(`¡Error! El país "${this.searchTerm}" no existe en nuestra base de datos.`);
      this.countries.set([]);
      }
    })
  }

  // Traduccion de continentes
  public traducirContinente(continente: string): string {
    const traducciones: {[key: string]: string} = {
      'Africa': 'África',
      'Antarctica': 'Antártida',
      'Asia': 'Asia',
      'Europe': 'Europa',
      'North America': 'Norteamérica',
      'South America': 'Sudamérica',
      'Oceania': 'Oceanía'
    };
    return traducciones[continente] || continente;
  }



}
