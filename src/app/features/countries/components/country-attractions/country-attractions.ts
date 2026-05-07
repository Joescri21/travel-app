import { CommonModule } from '@angular/common';
import { Component, inject, Input, signal } from '@angular/core';
import { Geoapify } from '../../../../core/services/geoapify';
import { Pexel } from '../../../../core/services/pexel';

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
  private pexelsService = inject(Pexel);

  private currentCountryCode: string = '';
  private _lat?: number;
  private _lng?: number;


  @Input()
  set countryCode(value: any) {
    if (!value || value === this.currentCountryCode) return;
    this.currentCountryCode = value;
    this.tryLoadAttractions();
  }

  get countryCode(): string {
    return this.currentCountryCode;
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
    if (this._lat == null || this._lng == null || !this.currentCountryCode) return; // Aseguramos que currentCountryCode también esté disponible
    this.loadAttractions();
  }

  private loadAttractions(): void {
    const lat = this._lat!;
    const lng = this._lng!;

    this.errorMessage.set(null);
    this.isLoading.set(true);

    this.geoapifyService.getTopCountryAttractions(lat, lng, 20).subscribe({
      next: (data) => {
        // Inicializamos el signal con los datos de las atracciones
        this.attractions.set(data);

        // Para cada atracción, buscamos su foto
        data.forEach((lugar: any, index: number) => {
          const query = `${lugar.name} ${this.currentCountryCode}`;

          this.pexelsService.getPhoto(query).subscribe({
            next: (url) => {
              // Actualizamos el signal de forma inmutable para que Angular detecte el cambio
              this.attractions.update(currentAttractions => {
                const updatedAttractions = [...currentAttractions]; // Creamos una nueva copia del array
                if (updatedAttractions[index]) { // Verificamos que el elemento aún exista en el índice
                  updatedAttractions[index] = { ...updatedAttractions[index], fotoUrl: url }; // Creamos un nuevo objeto para el elemento actualizado
                }
                return updatedAttractions;
              });
            },
            error: (err) => console.error('Error en foto Pexels:', err)
          });
        });


        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('❌ ERROR:', err);
        this.isLoading.set(false);
        this.errorMessage.set('Error al cargar las atracciones.');
      }
    });
  }

  translateCategory(cat: string): string {
    const categories: any = {
      'tourism.sights': 'Lugar Turístico',
      'entertainment.culture': 'Cultura y Arte',
      'heritage': 'Patrimonio Histórico',
      'tourism.attraction': 'Atracción',
      'natural': 'Naturaleza'
    };
    return categories[cat] || 'Interés General';
  }
}
