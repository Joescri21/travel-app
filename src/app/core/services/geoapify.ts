import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { map, Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class Geoapify {

  private http = inject(HttpClient);

  private baseUrl = 'https://api.geoapify.com/v2/places';

  getTopCountryAttractions(lat: number, lng: number, limit: number = 20): Observable<any[]> {
    const apiKey = environment.geoapifyApiKey;

    const params = new HttpParams()
      .set('categories', 'tourism.sights,entertainment.culture,heritage')
      .set('bias', `proximity:${lng},${lat}`)
      .set('limit', `${limit}`)
      .set('apiKey', apiKey);

  // En tu archivo geoapify.service.ts
    const url = `${this.baseUrl}?categories=tourism.sights,entertainment.culture,heritage&filter=circle:${lng},${lat},5000&bias=proximity:${lng},${lat}&limit=${limit}&lang=es&apiKey=${apiKey}`;

    return this.http.get<any>(this.baseUrl, { params }).pipe(
      map(response => {
        const features = Array.isArray(response.features) ? response.features : [];
        return features.map((lugar: any) => ({
          name: lugar.properties.name || lugar.properties.formatted || 'Lugar desconocido',
          category: lugar.properties.categories?.[0],
          address: lugar.properties.address_line2 || lugar.properties.address_line1 || 'Sin dirección',
          placeId: lugar.properties.place_id
        }));
      })
    );
  }

}
