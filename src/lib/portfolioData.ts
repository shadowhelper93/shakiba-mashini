export type ExpertiseCategory = 'all' | 'graph-ml' | 'bioinformatics' | 'data-cloud' | 'mathematics';
export type CareerCategory = 'all' | 'research' | 'clinical-industry' | 'teaching-leadership';

export interface ExpertiseDomain {
  id: string;
  index: string;
  category: Exclude<ExpertiseCategory, 'all'>;
  title: string;
  summary: string;
  context: string;
  skills: string[];
}

export type CareerTopologyPattern =
  | 'genomics'
  | 'cloud-pipeline'
  | 'graph-nn'
  | 'statistics-lattice'
  | 'cohort-network'
  | 'clinical-pathway'
  | 'fraud-graph';

export interface CareerRole {
  id: string;
  role: string;
  organization: string;
  employmentType?: string;
  period: string;
  duration: string;
  location: string;
  workMode?: string;
  isCurrent?: boolean;
  category: Exclude<CareerCategory, 'all'>;
  summary: string;
  highlights: string[];
  skills: string[];
  organizationUrl: string;
  topologyPattern: CareerTopologyPattern;
  topologyCaption: string;
}

export interface EducationEntry {
  id: string;
  institution: string;
  degree: string;
  period: string;
  grade?: string;
  isCurrent?: boolean;
  skills: string[];
  institutionUrl: string;
}

export interface CertificationEntry {
  id: string;
  title: string;
  issuer: string;
  issued: string;
  skills: string[];
  issuerUrl: string;
}

export interface InquiryFormValues {
  name: string;
  email: string;
  topic: string;
  message: string;
}

export interface InquiryValidationErrors {
  name?: string;
  email?: string;
  topic?: string;
  message?: string;
}

export const PROFILE = {
  fullName: 'Shakiba Mashini',
  headline: 'PhD Student in Computer Science',
  subHeadline: 'Research Specialist at Emory University School of Medicine',
  location: 'Atlanta, Georgia, United States',
  linkedinUrl: 'https://www.linkedin.com/in/shakiba-mashini-8b5646182/',
  portraits: {
    editorialMono: '/assets/aistudio/2026-11-19_15.46.43_6df2cb4a.jpg',
    studioHeadshot: '/assets/aistudio/1762552786353_75ee2c80.jpeg',
  },
  heroStatement:
    'Advancing Graph Neural Networks, computational research, and applied machine learning across computer science and medicine.',
  aboutLead:
    'Rooted in Applied Mathematics and now pursuing a Ph.D. in Computer Science at Georgia State University, Shakiba Mashini bridges theoretical graph learning with high-impact biomedical and enterprise data science.',
  aboutBody:
    'Alongside doctoral research advised by Prof. Esra Akbas on community-aware graph sparsification, robustness, and oversmoothing mitigation in Graph Neural Networks, she serves as a Research Specialist at Emory University School of Medicine. Her career spans graduate research across Dell Technologies, Shepherd Center, and Georgia State University, graduating with a 4.11 GPA in Data Science.',
  award: {
    title: 'First Place Award — Global Engagement',
    venue: '4th Annual Graduate Conference for Research, Scholarship, and Creative Activity',
    issuer: 'The Graduate School at Georgia State University',
    topic:
      'Community-aware graph sparsification and its impact on improving robustness and mitigating oversmoothing in Graph Neural Networks.',
    advisor: 'Prof. Esra Akbas',
  },
  proofMetrics: [
    {
      value: 'Ph.D.',
      label: 'Computer Science',
      detail: 'Doctoral Researcher',
    },
    {
      value: 'Emory',
      label: 'Research Specialist',
      detail: 'School of Medicine',
    },
    {
      value: '4.11',
      label: 'M.S. Data Science GPA',
      detail: 'Robinson College of Business',
    },
    {
      value: '1st',
      label: 'Global Engagement Award',
      detail: 'GSU Graduate Conference',
    },
    {
      value: 'Georgia State',
      label: 'University',
      detail: 'Atlanta, Georgia',
    },
  ],
} as const;

export const EXPERTISE_DOMAINS: ExpertiseDomain[] = [
  {
    id: 'graph-neural-networks',
    index: '01',
    category: 'graph-ml',
    title: 'Graph Neural Networks & Deep Learning',
    summary:
      'Investigating community-aware graph sparsification to strengthen structural robustness and mitigate oversmoothing in deep graph architectures.',
    context: 'Doctoral Research at Georgia State University & Graduate Research at Dell Technologies',
    skills: ['Graph Neural Networks', 'Graph Networks', 'PyTorch', 'TensorFlow', 'Community-Aware Sparsification'],
  },
  {
    id: 'computational-biomedicine',
    index: '02',
    category: 'bioinformatics',
    title: 'Computational Genomics & Clinical Modeling',
    summary:
      'Applying specialized bioinformatics toolchains and predictive models to biomedical research and clinical patient-care datasets.',
    context: 'Emory University School of Medicine & Shepherd Center',
    skills: ['Modkit', 'Samtools', 'Predictive Modeling', 'Clinical Data Analysis', 'Biomedical Research'],
  },
  {
    id: 'data-science-cloud',
    index: '03',
    category: 'data-cloud',
    title: 'Scalable Data Science & Cloud Systems',
    summary:
      'Engineering cloud-backed machine learning workflows, distributed analytics pipelines, and large-scale anomaly and fraud detection studies.',
    context: 'Emory Data Science Internship, GSU MSDA & EMSCAD Research (17,880 Job Ads)',
    skills: ['AWS SageMaker', 'Cloud Computing', 'Apache Spark', 'Python', 'Fraud Detection'],
  },
  {
    id: 'applied-mathematics',
    index: '04',
    category: 'mathematics',
    title: 'Applied Mathematics & Statistical Foundations',
    summary:
      'Grounding machine learning practice in rigorous mathematical theory, algorithmic design, topology, and graduate-level statistical instruction.',
    context: 'Alzahra University, Georgia Tech Analytics & GSU Business Statistics Teaching',
    skills: ['Applied Mathematics', 'Topology', 'Algorithms', 'Statistical Analysis', 'Business Statistics', 'Business Analytics'],
  },
];

export const CAREER_ROLES: CareerRole[] = [
  {
    id: 'emory-research-specialist',
    role: 'Research Specialist',
    organization: 'Emory University School of Medicine',
    employmentType: 'Part-time',
    period: 'Jan 2025 – Present',
    duration: '1 yr 11 mos',
    location: 'Atlanta, Georgia, United States',
    workMode: 'Hybrid',
    isCurrent: true,
    category: 'research',
    summary:
      'Conducting computational and bioinformatics research workflows within the Emory University School of Medicine.',
    highlights: [
      'Transitioned from Data Science Intern to ongoing Research Specialist role at Emory University School of Medicine.',
      'Working with specialized computational biology and sequencing analysis tools including Modkit and Samtools.',
    ],
    skills: ['Modkit', 'Samtools', '+4 additional skills'],
    organizationUrl: 'https://www.linkedin.com/school/3885/',
    topologyPattern: 'genomics',
    topologyCaption: 'Sequencing alignment & base-modification graph topology',
  },
  {
    id: 'emory-data-science-intern',
    role: 'Data Science Intern',
    organization: 'Emory University School of Medicine',
    employmentType: 'Internship',
    period: 'Aug 2024 – Dec 2024',
    duration: '5 mos',
    location: 'Atlanta, Georgia, United States',
    workMode: 'Hybrid',
    category: 'clinical-industry',
    summary:
      'Built and executed cloud-enabled data science and machine learning workflows supporting medical research initiatives.',
    highlights: [
      'Leveraged Cloud Computing and AWS SageMaker for scalable analytical and modeling pipelines.',
      'Laid the technical foundation leading directly into the Research Specialist appointment in January 2025.',
    ],
    skills: ['Cloud Computing', 'AWS SageMaker', '+5 additional skills'],
    organizationUrl: 'https://www.linkedin.com/school/3885/',
    topologyPattern: 'cloud-pipeline',
    topologyCaption: 'Distributed cloud compute & SageMaker ML pipeline lattice',
  },
  {
    id: 'dell-graduate-research-assistant',
    role: 'Graduate Research Assistant',
    organization: 'Dell Technologies',
    period: 'Aug 2024 – Dec 2024',
    duration: '5 mos',
    location: 'Atlanta, Georgia, United States',
    category: 'clinical-industry',
    summary:
      'Researched and developed graph-based machine learning models using PyTorch and Graph Networks.',
    highlights: [
      'Applied Graph Networks and deep learning architectures in PyTorch to complex relational problem spaces.',
      'Bridged academic graph representation learning with enterprise technology research.',
    ],
    skills: ['Graph Networks', 'PyTorch', '+7 additional skills'],
    organizationUrl: 'https://www.linkedin.com/company/15088102/',
    topologyPattern: 'graph-nn',
    topologyCaption: 'Multi-hop relational message passing & PyTorch GNN layers',
  },
  {
    id: 'gsu-gta-business-statistics',
    role: 'Graduate Teaching Assistant',
    organization: 'Georgia State University — J. Mack Robinson College of Business',
    period: 'Aug 2024 – Dec 2024',
    duration: '5 mos',
    location: 'Atlanta Metropolitan Area',
    workMode: 'On-site',
    category: 'teaching-leadership',
    summary:
      'Supported graduate and undergraduate instruction in Business Statistics at the J. Mack Robinson College of Business.',
    highlights: [
      'Guided students through quantitative reasoning, statistical inference, and applied Business Statistics coursework.',
    ],
    skills: ['Business Statistics', 'Statistical Analysis'],
    organizationUrl: 'https://www.linkedin.com/school/15100279/',
    topologyPattern: 'statistics-lattice',
    topologyCaption: 'Probability density manifold & statistical inference mesh',
  },
  {
    id: 'gsu-msda-ambassador',
    role: 'MSDA Program Ambassador',
    organization: 'Georgia State University — J. Mack Robinson College of Business',
    period: 'Aug 2023 – Dec 2024',
    duration: '1 yr 5 mos',
    location: 'Atlanta, Georgia, United States',
    category: 'teaching-leadership',
    summary:
      'Represented the Master of Science in Data Science & Analytics program alongside the Graduate Recruitment Team.',
    highlights: [
      'Interacted with prospective and admitted RCB students during on-campus open house events and MSDA virtual office hours.',
      'Corresponded with prospective and admitted students via Unibuddy, virtual office hours, and email.',
      'Created video and blog content sharing the graduate student experience at Robinson.',
    ],
    skills: ['Leadership', 'Student Mentorship', 'Academic Outreach'],
    organizationUrl: 'https://www.linkedin.com/school/15100279/',
    topologyPattern: 'cohort-network',
    topologyCaption: 'Hub-and-spoke academic mentorship & graduate outreach graph',
  },
  {
    id: 'shepherd-center-gra',
    role: 'Graduate Research Assistant',
    organization: 'Shepherd Center',
    period: 'Jan 2024 – Apr 2024',
    duration: '4 mos',
    location: 'Atlanta, Georgia, United States',
    workMode: 'On-site',
    category: 'clinical-industry',
    summary:
      'Analyzed data from spinal cord injury patients to improve incontinence care using predictive modeling.',
    highlights: [
      'Developed TensorFlow-based predictive modeling pipelines tailored to clinical spinal cord injury patient care.',
      'Collaborated on-site with clinical stakeholders in Atlanta to translate data insights into improved care outcomes.',
    ],
    skills: ['TensorFlow', 'Leadership', 'Predictive Modeling', '+3 additional skills'],
    organizationUrl: 'https://www.linkedin.com/company/23655/',
    topologyPattern: 'clinical-pathway',
    topologyCaption: 'Clinical patient-care feature trajectory & TensorFlow predictor',
  },
  {
    id: 'gsu-gra-emscad',
    role: 'Graduate Research Assistant',
    organization: 'Georgia State University — J. Mack Robinson College of Business',
    period: 'Aug 2023 – Dec 2023',
    duration: '5 mos',
    location: 'United States',
    workMode: 'On-site',
    category: 'research',
    summary:
      "Analyzed EMSCAD's 17,880 job advertisements to detect fraudulent employment listings.",
    highlights: [
      'Conducted structured data analysis and anomaly exploration across 17,880 real-world job postings in the EMSCAD dataset.',
    ],
    skills: ['Data Analysis', 'Fraud Detection'],
    organizationUrl: 'https://www.linkedin.com/school/15100279/',
    topologyPattern: 'fraud-graph',
    topologyCaption: 'EMSCAD anomaly cluster isolation across 17,880 listings',
  },
];

export const EDUCATION: EducationEntry[] = [
  {
    id: 'gsu-phd',
    institution: 'Georgia State University',
    degree: 'Doctor of Philosophy, Computer Science',
    period: 'Jan 2025 – Present',
    isCurrent: true,
    skills: ['Graph Neural Networks', 'Community-Aware Graph Sparsification', 'Machine Learning Research'],
    institutionUrl: 'https://www.linkedin.com/school/6350/',
  },
  {
    id: 'gsu-msda',
    institution: 'Georgia State University — J. Mack Robinson College of Business',
    degree: "Master's Degree, Data Science",
    period: 'Aug 2023 – Dec 2024',
    grade: '4.11',
    skills: ['Apache Spark', 'Statistical Analysis', '+20 skills'],
    institutionUrl: 'https://www.linkedin.com/school/15100279/',
  },
  {
    id: 'gatech-analytics',
    institution: 'Georgia Institute of Technology',
    degree: 'Analytics',
    period: 'Aug 2022 – Dec 2022',
    skills: ['Business Analytics', 'Python', '+2 skills'],
    institutionUrl: 'https://www.linkedin.com/school/3558/',
  },
  {
    id: 'alzahra-bs',
    institution: 'Alzahra University',
    degree: "Bachelor's Degree, Applied Mathematics",
    period: '2013 – 2018',
    skills: ['Algorithms', 'Topology', '+6 skills'],
    institutionUrl: 'https://www.linkedin.com/school/9121514/',
  },
];

export const CERTIFICATIONS: CertificationEntry[] = [
  {
    id: 'mit-idss',
    title: 'MIT_IDSS Certified Data Science and Machine Learning',
    issuer: 'Great Learning',
    issued: 'Issued Apr 2023',
    skills: ['Programming'],
    issuerUrl: 'https://www.linkedin.com/school/9282020/',
  },
  {
    id: 'ibm-ds',
    title: 'What is Data Science',
    issuer: 'IBM',
    issued: 'Issued Mar 2023',
    skills: ['Programming'],
    issuerUrl: 'https://www.linkedin.com/company/1009/',
  },
  {
    id: 'tit-daml',
    title: 'Data Analytics and Machine Learning',
    issuer: 'Tehran Institute of Technology',
    issued: 'Issued Jan 2020',
    skills: ['Programming'],
    issuerUrl: 'https://www.linkedin.com/company/42761783/',
  },
  {
    id: 'tit-python',
    title: 'Programming with Python',
    issuer: 'Tehran Institute of Technology',
    issued: 'Issued Jan 2020',
    skills: ['Programming'],
    issuerUrl: 'https://www.linkedin.com/company/42761783/',
  },
];

export function filterExpertiseDomains(
  domains: ExpertiseDomain[],
  category: ExpertiseCategory,
): ExpertiseDomain[] {
  if (category === 'all') return domains;
  return domains.filter((domain) => domain.category === category);
}

export function filterCareerRoles(roles: CareerRole[], category: CareerCategory): CareerRole[] {
  if (category === 'all') return roles;
  return roles.filter((role) => role.category === category);
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function validateInquiryForm(values: InquiryFormValues): InquiryValidationErrors {
  const errors: InquiryValidationErrors = {};
  const trimmedName = values.name.trim();
  const trimmedEmail = values.email.trim();
  const trimmedTopic = values.topic.trim();
  const trimmedMessage = values.message.trim();

  if (trimmedName.length < 2) {
    errors.name = 'Please enter your name (at least 2 characters).';
  }
  if (!EMAIL_PATTERN.test(trimmedEmail)) {
    errors.email = 'Please enter a valid email address.';
  }
  if (trimmedTopic.length < 3) {
    errors.topic = 'Please select or enter a subject.';
  }
  if (trimmedMessage.length < 15) {
    errors.message = 'Please share a brief note (at least 15 characters).';
  }

  return errors;
}

export function formatInquiryBrief(values: InquiryFormValues): string {
  return [
    `To: Shakiba Mashini (via LinkedIn)`,
    `From: ${values.name.trim()} <${values.email.trim()}>`,
    `Topic: ${values.topic.trim()}`,
    '',
    values.message.trim(),
  ].join('\n');
}
