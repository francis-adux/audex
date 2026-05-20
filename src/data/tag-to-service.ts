// Maps blog article tags to service slugs (for internal linking)
// Used by the LatestBlogPosts → related services section in articles
// and the clickable tags at the bottom of each article page.

export const TAG_TO_SERVICE: Record<string, string> = {
  'Droit familial': 'droit-familial',
  Médiation: 'mediation-familiale',
  'Droit civil': 'droit-civil-general',
  'Droit commercial': 'droit-commercial',
  'Droit criminel': 'droit-criminel-penal',
  'Crimes économiques': 'droit-criminel-penal',
  'Droit administratif': 'droit-administratif',
  'Droit municipal': 'droit-municipal',
  'Droit du travail': 'droit-emploi-travail',
  Succession: 'droit-civil-general',
  Immobilier: 'droit-civil-general',
  Santé: 'droit-civil-general',
};

// Return up to N unique service slugs from a list of tags
export function tagsToServiceSlugs(tags: string[] | undefined, limit = 3): string[] {
  if (!tags || tags.length === 0) return [];
  const slugs = new Set<string>();
  for (const tag of tags) {
    const slug = TAG_TO_SERVICE[tag];
    if (slug) slugs.add(slug);
    if (slugs.size >= limit) break;
  }
  return Array.from(slugs);
}

// Resolve a single tag into a clickable URL (or undefined if no mapping)
export function tagToServiceUrl(tag: string): string | undefined {
  const slug = TAG_TO_SERVICE[tag];
  return slug ? `/services/${slug}` : undefined;
}
