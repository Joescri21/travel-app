import { Injectable } from '@angular/core';

interface StorageItem<T> {
  data: T;
  timestamp: number;
}

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  /**
   * Guarda datos en localStorage con expiración en minutos
   * @param key - Clave de almacenamiento
   * @param data - Datos a guardar
   * @param expirationMinutes - Tiempo de expiración en minutos (default: 60)
   */
  setItem<T>(key: string, data: T, expirationMinutes: number = 60): void {
    const storageItem: StorageItem<T> = {
      data,
      timestamp: new Date().getTime()
    };
    
    localStorage.setItem(key, JSON.stringify(storageItem));
    
    // Programar la eliminación automática después de la expiración
    setTimeout(() => {
      this.removeItem(key);
    }, expirationMinutes * 60 * 1000);
  }

  /**
   * Obtiene datos de localStorage verificando si han expirado
   * @param key - Clave de almacenamiento
   * @param expirationMinutes - Tiempo de expiración en minutos (default: 60)
   * @returns Los datos si son válidos, null si expiró o no existe
   */
  getItem<T>(key: string, expirationMinutes: number = 60): T | null {
    const item = localStorage.getItem(key);
    
    if (!item) {
      return null;
    }

    try {
      const storageItem: StorageItem<T> = JSON.parse(item);
      const now = new Date().getTime();
      const elapsed = now - storageItem.timestamp;
      const expirationTime = expirationMinutes * 60 * 1000;

      if (elapsed > expirationTime) {
        // Los datos han expirado, eliminarlos
        this.removeItem(key);
        return null;
      }

      return storageItem.data;
    } catch (error) {
      console.error('Error al obtener datos de localStorage:', error);
      return null;
    }
  }

  /**
   * Elimina un elemento del localStorage
   */
  removeItem(key: string): void {
    localStorage.removeItem(key);
  }

  /**
   * Limpia todo el localStorage
   */
  clear(): void {
    localStorage.clear();
  }
}
