export const profile = {
  name: 'Narayan Dhakal',
  handle: 'sanzgrapher',
  role: 'Laravel developer',
  alsoRoles: ['AI engineer', 'Flutter developer', 'DevOps engineer'],
  years: 4,
  location: 'Pokhara, Nepal',
  availability: 'Open to work',
  remote: 'Open to remote',
  bio: 'Software engineer, Laravel first. I build the web platform, the AI agents and automation around it, the Flutter app on top, and run the servers it ships to. Founder of Padandas (100K+ users) and co-founder of VeezaFlow.',
  email: 'narayandhakal443@gmail.com',
  avatar: '/narayan.jpg',
  links: {
    github: 'https://github.com/sanzgrapher',
    linkedin: 'https://www.linkedin.com/in/narayandhakal09/',
  },
};

export const coreStack = ['Laravel', 'Filament', 'MCP', 'Flutter', 'Bloc', 'Pest', 'PostgreSQL', 'Redis', 'Docker', 'GitHub Actions'];

export const proof = [
  { value: '100K+', label: 'users on Padandas, my startup' },
  { value: '5,000+', label: 'Padandas app downloads' },
  { value: '4 repos', label: 'open-source projects with my merged PRs' },
  { value: '13K+', label: 'Packagist downloads of my Filament plugins' },
];

export const stack: { group: string; items: string[] }[] = [
  { group: 'Backend', items: ['Laravel', 'PHP', 'Filament', 'FastAPI', 'Python', 'REST APIs'] },
  { group: 'Frontend', items: ['TypeScript', 'JavaScript', 'Tailwind CSS', 'Vue', 'Blade', 'Astro'] },
  { group: 'Mobile', items: ['Flutter', 'Dart', 'Bloc', 'MVVM', 'Clean Architecture', 'Play Store releases'] },
  { group: 'Data', items: ['MySQL', 'PostgreSQL', 'Redis', 'Query optimisation'] },
  { group: 'Testing & quality', items: ['Pest', 'PHPUnit', 'Sentry', 'Git & PR reviews'] },
  {
    group: 'DevOps',
    items: ['Docker', 'GitHub Actions CI/CD', 'Linux servers', 'Nginx reverse proxy', 'DigitalOcean', 'Cloudflare', 'Vercel'],
  },
  { group: 'AI & tooling', items: ['MCP servers', 'OCR pipelines', 'RAG', 'Rust', 'Godot'] },
];

export const experience = [
  {
    role: 'AI engineer & Laravel developer',
    org: 'Home Offer Today',
    url: 'https://homeoffertoday.com/',
    period: 'Mar 2026 — Now',
    summary:
      'Build the agentic CRM layer that automates repetitive work: AI calls to clients and leads, call grading for staff training, lead generation and appointment booking, a telephony server, and automated property analysis reports.',
  },
  {
    role: 'Co-founder & developer',
    org: 'VeezaFlow',
    url: 'https://veezaflow.com/',
    period: '2026 — Now',
    summary:
      'Co-founded and build software for education consultancies: leads, admissions and visa cases across every branch in one pipeline, with role-based access per branch.',
  },
  {
    role: 'Founder & lead developer',
    org: 'Padandas',
    url: 'https://padandas.com/',
    period: '2019 — Now',
    summary:
      'Started it as a personal project and grew it into a startup. Built the whole product: Laravel platform serving 100K+ users, the Flutter app with 5,000+ Play Store downloads, and the API, auth and caching that connect them.',
  },
  {
    role: 'Web developer',
    org: 'Hands For Conservation',
    url: 'http://hfcnp.org',
    period: 'Apr 2024',
    summary:
      'Laravel CMS with role-based access, responsive frontend, and production setup across cPanel, DNS and Cloudflare.',
  },
];
