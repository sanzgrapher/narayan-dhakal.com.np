import type { APIRoute } from 'astro';
import { profile, proof, stack, experience } from '../data/profile';
import { getProjects, projectType, type Project } from '../lib/projects';

const projectLine = (p: Project) => {
  const { title, tagline, summary, impact, period, stack: tech, links } = p.data;
  const url = links?.live ?? links?.repo ?? links?.store;
  const name = url ? `[${title}](${url})` : title;
  const meta = [projectType(p), period, impact].filter(Boolean).join(' · ');
  const extras = [
    links?.repo && url !== links.repo ? `Repo: ${links.repo}` : '',
    links?.post ? `Demo: ${links.post}` : '',
  ]
    .filter(Boolean)
    .join(' ');
  return `- ${name}${tagline ? `: ${tagline}` : ''} (${meta}). ${summary}${extras ? ` ${extras}` : ''} Tech: ${tech.join(', ')}.`;
};

export const GET: APIRoute = async ({ site }) => {
  const { all } = await getProjects();

  const body = `# ${profile.name}

> ${profile.role}, also ${new Intl.ListFormat('en').format(profile.alsoRoles)}. ${profile.years} years of experience, based in ${profile.location}. ${profile.availability}, ${profile.remote.toLowerCase()}.

${profile.bio}

## Contact

- Email: ${profile.email}
- Website: ${site}
- GitHub: ${profile.links.github}
- LinkedIn: ${profile.links.linkedin}

## Track record

${proof.map((p) => `- ${p.value} ${p.label}`).join('\n')}

## Experience

${experience.map((e) => `- ${e.role}, [${e.org}](${e.url}) (${e.period}): ${e.summary}`).join('\n')}

## Skills

${stack.map((g) => `- ${g.group}: ${g.items.join(', ')}`).join('\n')}

## Projects

${all.map(projectLine).join('\n')}
`;

  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
