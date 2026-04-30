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
    address: '5055, boul. Wilfrid-Hamel',
    city: 'Québec (Québec)',
    postalCode: 'G2E 2G6',
    mapSrc:
      'https://www.google.com/maps?q=5055+Bd+Wilfrid-Hamel,+Qu%C3%A9bec,+QC+G2E+2G6&output=embed',
  },
];
