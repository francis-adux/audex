export type ServiceIconKey =
  | 'family'
  | 'mediation'
  | 'commercial'
  | 'criminal'
  | 'employment';

export interface ServiceEntry {
  slug: string;
  title: string;
  shortTitle: string;
  navTitle: string;
  icon: ServiceIconKey;
  blurb: string;
}

export const services: ServiceEntry[] = [
  {
    slug: 'droit-criminel-penal',
    title: 'Droit criminel et pénal',
    shortTitle: 'Droit criminel et pénal',
    navTitle: 'Droit criminel et pénal',
    icon: 'criminal',
    blurb: 'Défense criminelle et pénale',
  },
  {
    slug: 'droit-affaires',
    title: 'Droit des affaires',
    shortTitle: 'Droit des affaires',
    navTitle: 'Droit des affaires',
    icon: 'commercial',
    blurb: 'Entreprises et transactions',
  },
  {
    slug: 'droit-emploi-travail',
    title: 'Droit du travail',
    shortTitle: 'Droit du travail',
    navTitle: 'Droit du travail',
    icon: 'employment',
    blurb: 'Relations de travail et congédiement',
  },
  {
    slug: 'droit-familial',
    title: 'Droit familial',
    shortTitle: 'Droit familial',
    navTitle: 'Droit familial',
    icon: 'family',
    blurb: 'Divorce, garde, pension alimentaire',
  },
  {
    slug: 'mediation-familiale',
    title: 'Médiation familiale',
    shortTitle: 'Médiation familiale',
    navTitle: 'Médiation familiale',
    icon: 'mediation',
    blurb: "Résolution à l'amiable",
  },
];
