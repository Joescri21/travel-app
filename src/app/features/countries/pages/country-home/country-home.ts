import { Component, inject, signal } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Countries } from '../../../../core/services/countries';
import { Country } from '../../../../core/models/country.model';
import { Router, RouterLink } from "@angular/router";

@Component({
  selector: 'country-home',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DecimalPipe,
    RouterLink
],
  templateUrl: './country-home.html',
  styles: ``,
})
export class CountryHome {

  private countryService = inject(Countries);
  private router = inject(Router);

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

  public paisSeleccionado = signal<Country | null>(null);


//Ver Detalles del pais
  verDetalles(id: string) {
    // 1. Buscamos el país en nuestra lista actual usando el ID
    const encontrado = this.countries().find(c => c.cca3 === id);
    if (encontrado) {
      this.paisSeleccionado.set(encontrado);
      this.router.navigate(['/country', id]);
      // 2. Aquí es donde el jueves dispararemos la petición a la API del Clima
      console.log('Cargando clima para:', encontrado.capital[0]);
    }
  }



}
