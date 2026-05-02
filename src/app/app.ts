import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CountryHome } from "./features/countries/pages/country-home/country-home";
import { Footer } from "./features/countries/components/footer/footer";


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    Footer
],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('travel-app');


}


