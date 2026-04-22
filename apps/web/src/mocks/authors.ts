export type Author = {
  id: string;
  name: string;
  slug: string;
  role: string;
  bio: string;
  avatarUrl: string;
  socials: {
    twitter?: string;
    github?: string;
    website?: string;
  };
};

export const authors: Author[] = [
  {
    id: '1',
    name: 'Marcus Dev',
    slug: 'marcus-dev',
    role: 'Senior AI Engineer & Full-Stack Developer',
    bio: 'Marcus has spent the last 5 years building scalable machine learning pipelines and is an active contributor to open-source AI frameworks. He specializes in natural language processing and distributed systems.',
    avatarUrl:
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=120&h=120&q=80',
    socials: {
      twitter: '#',
      github: '#',
      website: '#',
    },
  },
];
