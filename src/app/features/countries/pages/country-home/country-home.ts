import { Component, inject, signal } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Countries } from '../../../../core/services/countries';
import { Country } from '../../../../core/models/country.model';
import { Router} from "@angular/router";
import { CountryInfo } from "../../components/country-info/country-info";
import { LocalStorageService } from '../../../../shared/services/local-storage.service';



@Component({
  selector: 'country-home',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CountryInfo
],
  templateUrl: './country-home.html',
  styles: ``,
})
export class CountryHome {

  private countryService = inject(Countries);
  private router = inject(Router);
  private storageService = inject(LocalStorageService);

  public countries = signal<Country[]>([]);
  public searchTerm= '';
  public error = signal<string | null>(null);

  countrysearch(){
    const search = this.searchTerm.trim();

    //No gastar peticiones en texto vacios o muy cortos
    if( search.length < 3) return;

    // Verificar si hay datos en caché (válidos por 60 minutos)
    const cachedData = this.storageService.getItem<Country[]>(`countries_${search}`, 60);
    if (cachedData) {
      console.log('Datos obtenidos del caché');
      this.countries.set(cachedData);
      this.error.set(null);
      return;
    }

    // Si no hay caché, hacer petición a la API
    this.countryService.getCountryByName(search).subscribe({
      next: (data) => {
        this.countries.set(data);
        // Guardar los datos en localStorage por 60 minutos
        this.storageService.setItem(`countries_${search}`, data, 60);
        this.error.set(null);
      },
      error: () => {
        this.error.set('No encontramos ese destino. ¡Prueba con otro!');
      }
    });
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

      // Guardar el país seleccionado en localStorage por 60 minutos
      this.storageService.setItem(`country_${id}`, encontrado, 60);

      this.router.navigate(['/country', id]);
      // 2. Aquí es donde el jueves dispararemos la petición a la API del Clima
      console.log('Cargando clima para:', encontrado.capital[0]);
    }
  }

}
