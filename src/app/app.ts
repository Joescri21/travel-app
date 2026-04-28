import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CountryHome } from "./features/countries/pages/country-home/country-home";


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    CountryHome
],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('travel-app');


}


