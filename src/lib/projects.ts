import { getCollection, type CollectionEntry } from 'astro:content';

export type Project = CollectionEntry<'projects'>;

const kindRank = { startup: 0, collaboration: 1, personal: 2 } as const;

const byKindThenOrder = (a: Project, b: Project) =>
  kindRank[a.data.kind] - kindRank[b.data.kind] || a.data.order - b.data.order;

export async function getProjects() {
  const all = (await getCollection('projects', ({ data }) => !data.draft)).sort(byKindThenOrder);
  return {
    all,
    selected: all.filter((p) => p.data.featured),
  };
}

export const projectUrl = (p: Project) => `/projects/${p.id}`;

export const categories = {
  startup: 'Startup',
  oss: 'Open source',
  private: 'Private',
  client: 'Client',
} as const;

export type Category = keyof typeof categories;

export const projectCategory = (p: Project): Category =>
  p.data.kind === 'startup'
    ? 'startup'
    : p.data.visibility === 'public'
      ? 'oss'
      : p.data.kind === 'collaboration'
        ? 'client'
        : 'private';

export const projectType = (p: Project) =>
  p.data.kind === 'startup'
    ? 'My startup'
    : p.data.kind === 'collaboration'
      ? p.data.visibility === 'public'
        ? 'Open-source contribution'
        : 'Team / client'
      : p.data.visibility === 'public'
        ? 'Open source · my project'
        : 'Personal · private';
