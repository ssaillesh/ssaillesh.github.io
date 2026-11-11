// Single source for identity, links and the foyer introduction.
// Contact details come from the résumé (public/resume) and the previous site.

export const profile = {
  name: 'Saillesh',
  fullName: 'Saillesh Somasundaram',
  residence: 'The Private Residence',
  motto: 'Engineering through curiosity.',
  descriptor: 'Physics-trained. Systems-minded. Builder by nature.',
  intro:
    'I am a multidisciplinary engineer with an academic foundation in physics and experience across software engineering, DevOps, automation, data, and intelligent systems.',
  focus:
    'Platform engineering, CI/CD reliability, infrastructure and secrets automation, data pipelines, and machine learning systems.',
  location: 'Toronto, ON',
  availability: 'Open to new grad roles',
  school: 'University of Waterloo',
  links: {
    email: 's5somasu@uwaterloo.ca',
    github: 'https://github.com/ssaillesh',
    // The previous site links here; the PDF résumé shows "linkedin/sailleshsomasundaram".
    linkedin: 'https://www.linkedin.com/in/saillesh',
    resume: '/resume/Saillesh_dev_resume.pdf',
  },
}

export const skills = [
  { group: 'Languages', items: ['Python', 'SQL', 'Bash', 'PowerShell', 'JavaScript', 'Java', 'C++', 'Scala', 'Ruby'] },
  { group: 'CI/CD & platform', items: ['GitLab CI/CD', 'Jenkins', 'Docker', 'Kubernetes', 'Terraform', 'Ansible', 'GitOps', 'HashiCorp Vault', 'SonarQube'] },
  { group: 'Cloud & observability', items: ['AWS (EC2, S3, Lambda, ECS, CloudWatch)', 'Azure (AKS)', 'Prometheus', 'Grafana', 'ELK Stack'] },
  { group: 'Data & ML', items: ['pandas', 'NumPy', 'scikit-learn', 'PyTorch', 'OpenCV', 'SQL Server', 'PostgreSQL', 'Power BI'] },
]
