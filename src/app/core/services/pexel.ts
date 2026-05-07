import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Pexel {

  private http = inject(HttpClient);
  private apiKey = environment.pexelApiKey;

  getPhoto(query: string): Observable<string> {
    // 🛡️ Pexels exige la Key en el Header de Authorization
    const headers = new HttpHeaders({
      'Authorization': this.apiKey
    });

    // Buscamos 1 foto, en formato cuadrado (square) para que queden bien en la card
    const url = `https://api.pexels.com/v1/search?query=${query}&per_page=1&orientation=square`;

    return this.http.get<any>(url, { headers }).pipe(
      map(res => {
        // Si hay resultados, mandamos la URL de la imagen mediana
        // Si no, mandamos una de respaldo (placeholder)
        return res.photos[0]?.src?.medium || 'https://images.pexels.com/photos/385997/pexels-photo-385997.jpeg?auto=compress&cs=tinysrgb&w=400';
      })
    );
  }

}
