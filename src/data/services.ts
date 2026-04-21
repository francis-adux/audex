export type ServiceIconKey =
  | 'family'
  | 'mediation'
  | 'civil'
  | 'commercial'
  | 'criminal'
  | 'admin'
  | 'employment'
  | 'youth'
  | 'municipal';

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
  {
    slug: 'droit-civil-general',
    title: 'Droit civil général',
    shortTitle: 'Droit civil général',
    navTitle: 'Droit civil général',
    icon: 'civil',
    blurb: 'Litiges, contrats, responsabilité',
  },
  {
    slug: 'droit-commercial',
    title: "Droit commercial et de l'entreprise",
    shortTitle: 'Droit commercial',
    navTitle: 'Droit commercial',
    icon: 'commercial',
    blurb: 'Entreprises et transactions',
  },
  {
    slug: 'droit-criminel-penal',
    title: 'Droit criminel et pénal',
    shortTitle: 'Droit criminel et pénal',
    navTitle: 'Droit criminel et pénal',
    icon: 'criminal',
    blurb: 'Défense criminelle et pénale',
  },
  {
    slug: 'droit-administratif',
    title: 'Droit administratif',
    shortTitle: 'Droit administratif',
    navTitle: 'Droit administratif',
    icon: 'admin',
    blurb: 'Décisions gouvernementales et tribunaux',
  },
  {
    slug: 'droit-municipal',
    title: 'Droit municipal',
    shortTitle: 'Droit municipal',
    navTitle: 'Droit municipal',
    icon: 'municipal',
    blurb: 'Règlements municipaux et zonage',
  },
  {
    slug: 'droit-emploi-travail',
    title: "Droit de l'emploi et du travail",
    shortTitle: "Droit de l'emploi",
    navTitle: "Droit de l'emploi",
    icon: 'employment',
    blurb: 'Relations de travail et congédiement',
  },
  {
    slug: 'droit-jeunesse',
    title: 'Droit de la jeunesse',
    shortTitle: 'Droit de la jeunesse',
    navTitle: 'Droit de la jeunesse',
    icon: 'youth',
    blurb: 'Protection de la jeunesse et DPJ',
  },
];
