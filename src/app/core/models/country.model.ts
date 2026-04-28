
export interface Country {
  name: { common: string };
  capital: string[];
  flags: { svg: string; alt: string };
  population: number;
  currencies: { [key: string]: { name: string; symbol: string } };
  region: string;
}
