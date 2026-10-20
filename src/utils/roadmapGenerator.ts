import { RoadmapWeek, CertificationGuide } from '../types';

export function generateSkillRoadmap(
  missingSkills: string[],
  domain: string = 'Artificial Intelligence & Machine Learning'
): {
  weeks: RoadmapWeek[];
  certifications: CertificationGuide[];
} {
  // If no missing skills or list is short, supplement with high-value domain skills
  const skillsToBridge = [...missingSkills];
  if (skillsToBridge.length === 0) {
    if (domain.includes('Machine Learning') || domain.includes('Artificial Intelligence')) {
      skillsToBridge.push('docker', 'pytorch', 'fastapi', 'aws');
    } else if (domain.includes('Backend')) {
      skillsToBridge.push('docker', 'redis', 'postgresql', 'ci/cd');
    } else {
      skillsToBridge.push('typescript', 'docker', 'sql', 'git');
    }
  }

  const chunk1 = skillsToBridge.slice(0, 1);
  const chunk2 = skillsToBridge.slice(1, 2).length ? skillsToBridge.slice(1, 2) : ['Clean Architecture & Testing'];
  const chunk3 = skillsToBridge.slice(2, 3).length ? skillsToBridge.slice(2, 3) : ['Deployment & CI/CD'];
  const chunk4 = skillsToBridge.slice(3, 5).length ? skillsToBridge.slice(3, 5) : ['Portfolio Capstone & Interview Mock'];

  const weeks: RoadmapWeek[] = [
    {
      weekNumber: 1,
      title: `Core Foundation & Tooling: ${chunk1.map(s => s.toUpperCase()).join(' & ')}`,
      targetSkills: chunk1,
      milestones: [
        `Review syntax, architecture patterns, and standard libraries for ${chunk1.join(', ').toUpperCase()}.`,
        `Set up local developer environment, linters, and virtual environments or containers.`,
        `Complete 3 hands-on tutorial exercises implementing core concepts.`
      ],
      suggestedResource: {
        name: `${chunk1[0]?.toUpperCase() || 'Skill'} Official Documentation & Getting Started Guide`,
        type: 'Documentation',
        url: 'https://developer.mozilla.org/'
      },
      sampleProjectGoal: `Build a standalone functional script or prototype utilizing ${chunk1[0]?.toUpperCase() || 'core language'}.`
    },
    {
      weekNumber: 2,
      title: `Applied Implementation: ${chunk2.map(s => s.toUpperCase()).join(' & ')}`,
      targetSkills: chunk2,
      milestones: [
        `Integrate ${chunk2.join(', ').toUpperCase()} into an existing project or microservice.`,
        `Write automated unit tests to validate edge cases and exception handling.`,
        `Implement data persistence or caching patterns.`
      ],
      suggestedResource: {
        name: 'Full Stack Open / FreeCodeCamp Tutorials',
        type: 'Course',
        url: 'https://fullstackopen.com/'
      },
      sampleProjectGoal: `Create a tested service module incorporating ${chunk2.join(' and ').toUpperCase()}.`
    },
    {
      weekNumber: 3,
      title: `Deployment & Integration: ${chunk3.map(s => s.toUpperCase()).join(' & ')}`,
      targetSkills: chunk3,
      milestones: [
        `Containerize the application with Docker and multi-stage builds.`,
        `Configure environment variables and secret management.`,
        `Deploy the containerized service to a cloud provider or staging environment.`
      ],
      suggestedResource: {
        name: 'Docker Official Get-Started Curriculum',
        type: 'Interactive',
        url: 'https://docs.docker.com/get-started/'
      },
      sampleProjectGoal: `Deploy a live API or dashboard with a public URL and health check endpoint.`
    },
    {
      weekNumber: 4,
      title: `Portfolio Capstone & Interview Readiness`,
      targetSkills: chunk4,
      milestones: [
        `Polish GitHub repository with a clear README, architecture diagram, and setup instructions.`,
        `Update resume project bullet points following the Google XYZ formula.`,
        `Prepare answers for typical technical interview questions on design trade-offs.`
      ],
      suggestedResource: {
        name: 'System Design Primer & Tech Interview Handbook',
        type: 'Project',
        url: 'https://github.com/donnemartin/system-design-primer'
      },
      sampleProjectGoal: `Publish an open-source repository with live demo links and documented metrics.`
    }
  ];

  // Certification recommendations tailored to domain
  const certifications: CertificationGuide[] = [
    {
      title: 'AWS Certified Cloud Practitioner (CLF-C02)',
      issuer: 'Amazon Web Services',
      difficulty: 'Beginner',
      relevance: 'Validates overall cloud fluency, security fundamentals, and core AWS compute/storage services.',
      link: 'https://aws.amazon.com/certification/certified-cloud-practitioner/'
    },
    {
      title: 'Google Associate Cloud Engineer',
      issuer: 'Google Cloud',
      difficulty: 'Intermediate',
      relevance: 'Proves practical competence deploying applications, monitoring operations, and managing enterprise cloud infrastructure.',
      link: 'https://cloud.google.com/learn/certification/cloud-engineer'
    },
    {
      title: 'TensorFlow Developer Certificate / PyTorch Deep Learning Specialist',
      issuer: 'DeepLearning.AI',
      difficulty: 'Intermediate',
      relevance: 'Demonstrates ability to train convolutional neural networks, NLP models, and deploy computer vision pipelines.',
      link: 'https://www.deeplearning.ai/'
    },
    {
      title: 'PostgreSQL Associate / Database Engineering Certificate',
      issuer: 'PostgreSQL / Linux Professional Institute',
      difficulty: 'Intermediate',
      relevance: 'Certifies high proficiency in SQL schema design, indexing strategies, transactions, and query optimization.',
      link: 'https://www.postgresql.org/'
    }
  ];

  return { weeks, certifications };
}
