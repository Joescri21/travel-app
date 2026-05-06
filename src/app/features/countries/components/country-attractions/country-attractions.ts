import { CommonModule } from '@angular/common';
import { Component, inject, Input, signal } from '@angular/core';
import { Geoapify } from '../../../../core/services/geoapify';
import { Country } from '../../../../core/models/country.model';

@Component({
  selector: 'country-attractions',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './country-attractions.html',
})
export class CountryAttractions {

  private geoapifyService = inject(Geoapify);
  private currentCountryCode: string = '';
  private _lat?: number;
  private _lng?: number;

  @Input()
set countryCode(value: any) {
  // 🛡️ EL CANDADO REINA: Si el código es nulo o es el mismo país que ya calculamos, rompe el flujo.
  // El input countryCode recibe directamente el string cca2, no un objeto.
  if (!value || value === this.currentCountryCode) {
    return;
  }

  // Si es un país nuevo, guardamos el registro y procedemos
  this.currentCountryCode = value;
  // No es necesario llamar a loadAttractions aquí, ya que lat y lng son inputs separados
  // y sus setters ya llaman a tryLoadAttractions.
  // this.tryLoadAttractions(); // Podría llamarse aquí si lat/lng ya estuvieran disponibles
}

  get countryCode(): string {
    return this.currentCountryCode;
  }

  private cargarAtracciones(lat: number, lng: number): void {
    // Este método estaba vacío y no se usaba correctamente. La lógica de carga está en loadAttractions.
  }

  @Input()
  set lat(value: number | undefined) {
    this._lat = value;
    this.tryLoadAttractions();
  }

  @Input()
  set lng(value: number | undefined) {
    this._lng = value;
    this.tryLoadAttractions();
  }

  public attractions = signal<any[]>([]);
  public isLoading = signal<boolean>(false);
  public errorMessage = signal<string | null>(null);

  private tryLoadAttractions(): void {
    if (this._lat == null || this._lng == null) {
      return;
    }

    this.loadAttractions();
  }

  private loadAttractions(): void {
    const lat = this._lat;
    const lng = this._lng;

    if (lat == null || lng == null) {
      this.errorMessage.set('Coordenadas no disponibles para buscar lugares.');
      return;
    }

    this.errorMessage.set(null);
    this.isLoading.set(true);
    console.log('🚀 Despegando petición HTTP hacia el servicio Geoapify...');

    this.geoapifyService.getTopCountryAttractions(lat, lng, 20).subscribe({
      next: (data) => {
        this.attractions.set(data); // 🏛️ Guardamos los 20 registros reales
        this.isLoading.set(false);
        console.log('✅ ÉXITO TOTAL: Registros devueltos por la API:', data.length);
      },
      error: (err) => {
        console.error('❌ ERROR en la respuesta del servidor:', err);
        this.isLoading.set(false);
        this.errorMessage.set('Error al cargar las atracciones.');
      }
    });
  }
}
