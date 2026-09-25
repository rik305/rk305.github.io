export const site = {
  name: 'Your Name',
  role: 'Data scientist and quantum computing intern',
  title: 'Your Name — Voxel Portfolio',
  description:
    'An isometric autumn room portfolio: IBM Quantum research, City of Edmonton data science, and selected projects.',
  resumeHref: '/resume.pdf',
  formEndpoint: import.meta.env.VITE_FORM_ENDPOINT ?? '',
  links: {
    github: 'https://github.com/your-handle',
    linkedin: 'https://www.linkedin.com/in/your-handle',
    letterboxd: 'https://letterboxd.com/your-handle',
    goodreads: 'https://www.goodreads.com/user/show/your-id',
  },
  experience: [
    {
      org: 'IBM Quantum',
      role: 'Research internship',
      summary: 'Built Qiskit pipelines for quantum research workflows.',
    },
    {
      org: 'City of Edmonton',
      role: 'Data science',
      summary: 'Data science work for municipal services.',
    },
  ],
  projects: [
    {
      name: 'Project Unison',
      summary:
        'An internal proprietary predictive dashboard using municipal 311 public service call data.',
    },
    {
      name: 'AI Incident Analyst',
      summary: 'An Azure-deployed Orchestrator-Worker multi-agent system.',
    },
  ],
  skills: ['C++20', 'Python', 'PyTorch', 'XGBoost', 'Qiskit'],
} as const
