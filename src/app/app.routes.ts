import { Routes } from '@angular/router';
import { CountryHome } from './features/countries/pages/country-home/country-home';
import { CountryDetail } from './features/countries/pages/CountryDetail/CountryDetail';

export const routes: Routes = [
  {
    path: '',
    component: CountryHome,
    title: 'Busqueda de tu pais'
  },
  {

    path: 'country/:id',
    component: CountryDetail,
    title: 'Informacion del País'
  },
  {
    path: '**',
    redirectTo: ''
  }
];
