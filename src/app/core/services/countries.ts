import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Country } from '../models/country.model';

@Injectable({
  providedIn: 'root'
})
export class Countries {

  private http = inject(HttpClient);
  private apiUrl = ' https://restcountries.com/v3.1';

 // Cambia el método de búsqueda para que use "translation"
getCountryByName(name: string): Observable<Country[]> {
  // Al usar /translation/ le decimos a la API que busque el nombre tal cual lo escribas en español
  return this.http.get<Country[]>(`${this.apiUrl}/translation/${name}`);
}

}
