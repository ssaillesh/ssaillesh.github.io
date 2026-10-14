// Regrouped from the previous site's six categories. The data and ML group is drawn from the
// tools named in my experience entries; the old "Working familiarity" items keep that label
// inside the group they belong to, so nothing reads as more proficient than it is.
export const skillGroups = [
  {
    id: 'languages',
    label: 'Languages and Frameworks',
    items: ['Python', 'Bash', 'SQL', 'YAML', 'C++', 'TypeScript/JavaScript', 'React/Next.js', 'FastAPI'],
  },
  {
    id: 'data-ml',
    label: 'Data and ML',
    items: ['pandas', 'NumPy', 'scikit-learn', 'OpenCV', 'YOLOv8', 'Power BI', 'SQL Server', 'PostgreSQL', 'Redis'],
  },
  {
    id: 'cloud',
    label: 'Cloud and Infrastructure',
    items: ['Docker', 'Docker Compose', 'Nginx', 'AWS (EC2, S3)', 'Linux (Ubuntu, RHEL)', 'VM administration', 'REST APIs'],
    familiar: ['Kubernetes', 'OpenShift', 'Terraform', 'Azure'],
  },
  {
    id: 'cicd',
    label: 'CI/CD',
    items: [
      'GitLab CI/CD',
      'GitHub Actions',
      'Ansible',
      'Ansible Vault',
      'JFrog Artifactory',
      'Bazel',
      'Merge gates',
      'cron',
      'Git',
      'GitLab',
      'GitHub',
      'SVN',
      'Jira',
      'Confluence',
    ],
  },
  {
    id: 'testing',
    label: 'Testing',
    items: ['pytest', 'GoogleTest', 'Catch2'],
  },
  {
    id: 'observability',
    label: 'Observability and Security',
    items: ['Prometheus', 'Grafana', 'HashiCorp Vault', 'RBAC/IAM provisioning', 'PAT rotation', 'SonarQube', 'SAST', 'DAST'],
  },
]
