export interface Office {
  name: string;
  short: string;
  address: string;
  city: string;
  postalCode: string;
  mapSrc: string;
}

export const offices: Office[] = [
  {
    name: 'Québec',
    short: 'Québec',
    address: '5055, boulevard Wilfrid-Hamel, suite 225',
    city: 'Québec (Québec)',
    postalCode: 'G2E 2G6',
    mapSrc:
      'https://www.google.com/maps?q=5055+Bd+Wilfrid-Hamel,+Qu%C3%A9bec,+QC+G2E+2G6&output=embed',
  },
  {
    name: 'Donnacona',
    short: 'Donnacona',
    address: '100, route 138, bureau 120',
    city: 'Donnacona (Québec)',
    postalCode: 'G3M 1B5',
    mapSrc:
      'https://www.google.com/maps?q=100+Route+138,+Donnacona,+QC+G3M+1B5&output=embed',
  },
];
