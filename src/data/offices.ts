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
    address: '1075, boul. René-Lévesque Ouest, bureau 400',
    city: 'Québec (Québec)',
    postalCode: 'G1S 0E1',
    mapSrc:
      'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2732.5!2d-71.23!3d46.8!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDbCsDQ4JzAwLjAiTiA3McKwMTMnNDguMCJX!5e0!3m2!1sfr!2sca!4v1',
  },
  {
    name: 'Portneuf / Donnacona',
    short: 'Donnacona',
    address: "155, rue de l'Église",
    city: 'Donnacona (Québec)',
    postalCode: 'G3M 0A3',
    mapSrc:
      'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2730.5!2d-71.72!3d46.67!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDbCsDQwJzEyLjAiTiA3McKwNDMnMTIuMCJX!5e0!3m2!1sfr!2sca!4v1',
  },
];
