// Highlights are preserved word for word from the previous site. **Double asterisks** mark
// technology names, which render in bold.
export const experience = [
  {
    id: 'symcor-devops',
    title: 'DevOps Engineer',
    company: 'Symcor Inc',
    companyUrl: 'https://www.symcor.ca/',
    companyAbout: 'Symcor builds secure technology and operations for highly regulated industries.',
    logo: { src: '/images/logos/symcor.webp', width: 160, height: 52, background: '#ffffff' },
    dates: 'Sep 2025 - May 2026',
    location: 'Toronto, ON',
    summary:
      'Owned IAM/RBAC automation, CI runner fleet health, and secrets hygiene across a 200-repository self-managed GitLab estate.',
    highlights: [
      'Owned identity and access for a 200-repository self-managed **GitLab** estate: shipped an idempotent **Python**/**GitLab** IAM/RBAC provisioning REST API with dry-run preview, collapsing access-grant SLA from 1 hour to 10 seconds.',
      'Kept 60+ **GitLab CI** runners healthy with a **Python** fleet-management tool driving **Ansible** auto-remediation, cutting failures 40%; configured shell and **Docker** executors, autoscaling, and tag-based job routing.',
      'Closed the credential-incident gap to zero: automated end-to-end PAT rotation, audited 80+ **GitLab** subgroups, and ran secrets through **HashiCorp Vault** and **Ansible Vault**.',
      'Hardened the merge path with **YAML** **GitLab CI** pipelines gated by test suites, **SonarQube**, SAST, and DAST; configured caching and artifacts against **JFrog Artifactory**.',
      'Built **Grafana** dashboards for runner health, CI job failure rates, and version currency across hosts, and migrated the team off **SVN** onto **Git**.',
    ],
    stack: ['Python', 'GitLab CI/CD', 'Ansible', 'HashiCorp Vault', 'Grafana', 'SonarQube', 'JFrog Artifactory', 'Linux'],
  },
  {
    id: 'omniabio-qa',
    title: 'Quality Automation Engineer',
    company: 'OmniaBio Inc',
    companyUrl: 'https://omniabio.com/',
    companyAbout: 'OmniaBio is a cell and gene therapy CDMO focused on AI-enabled development and GMP manufacturing.',
    logo: { src: '/images/logos/omniabio.webp', width: 160, height: 40, background: '#210f27' },
    dates: 'Aug 2024 - Dec 2024',
    location: 'Hamilton, ON',
    summary:
      'Built anomaly detection and a validated ETL pipeline over SAP data, replacing a week of manual reconciliation per cycle in a GMP-regulated environment.',
    highlights: [
      'Built a **Python**/**pandas** ETL pipeline over **SAP** CSV and **Excel** exports for 500+ SKUs in a GMP-regulated environment, eliminating a full week of manual reconciliation every cycle.',
      'Engineered validation gates spanning schema conformance, row counts, null constraints, referential integrity, and duplicate detection, surfacing 10 record mismatches that triggered a VP-led investigation.',
      'Built **Python** anomaly and outlier detection over QC sample data, catching out-of-range records that the rule-based gates alone would pass through.',
      'Shipped a recurring **Power BI** inventory report and status-flag logic sequencing 500+ SKUs into daily inspection queues by priority; both stayed in production after the term.',
      'Designed for non-technical adoption: kept execution manual so QC staff could run it unaided, version-controlled on **GitHub**, and authored SOPs reused to onboard new hires.',
    ],
    stack: ['Python', 'pandas', 'NumPy', 'Anomaly detection', 'SAP exports', 'Power BI', 'GitHub'],
  },
  {
    id: 'pepsico-swe',
    title: 'Software Developer / Operations Manager',
    company: 'PepsiCo Inc',
    companyUrl: 'https://www.pepsico.com/',
    companyAbout: 'PepsiCo is a global food and beverage company operating large-scale manufacturing and analytics.',
    logo: { src: '/images/logos/pepsico.webp', width: 160, height: 127, background: '#ffffff' },
    dates: 'Jan 2024 - Apr 2024',
    location: 'Lethbridge, AB',
    summary:
      'Shipped a computer-vision stall-detection pipeline over plant footage while running floor operations for 70+ operators.',
    highlights: [
      'Built a **Python**/**OpenCV**/**YOLOv8** stall-detection pipeline over 100+ hours of plant footage, pairing detection with **BoT-SORT** tracking and scoring precision, recall, and F1 against 40 hours of hand-labeled ground truth.',
      'Derived a 10-second stall threshold from observed self-clearing behaviour, using **OpenCV** VideoCapture for ingest and contour detection to isolate box geometry while tuning against false positives.',
      'Published detections to a **Power BI** dashboard maintenance leads used to rank work orders; still in active use after the term.',
      'Ran floor operations for 70+ operators across three shifts, owning scheduling and contractor coordination, and led facility readiness for a CEO site visit.',
    ],
    stack: ['Python', 'OpenCV', 'YOLOv8', 'BoT-SORT', 'Power BI'],
  },
  {
    id: 'pepsico-data',
    title: 'Data Analyst',
    company: 'PepsiCo Inc',
    companyUrl: 'https://www.pepsico.com/',
    companyAbout: 'PepsiCo is a global food and beverage company with large-scale analytics operations.',
    logo: { src: '/images/logos/pepsico.webp', width: 160, height: 127, background: '#ffffff' },
    dates: 'Jan 2023 - Apr 2023',
    location: 'Mississauga, ON',
    summary:
      'Automated planning and reporting over SQL Server, projecting $180K in annual savings through a cross-validated model.',
    highlights: [
      'Closed a cross-vendor notification gap with an event-driven **Python**/**Power Automate** pipeline flagging tasks due within 5 days, cutting 15+ past-due orders per month.',
      'Automated truckload planning with a **pandas**/**NumPy** engine over **SQL Server**; validated a **scikit-learn** regression by cross-validation to project $180K in annual savings.',
      'Modeled whether reducing box dimensions and rearranging trailer load configuration would raise shippable volume, presenting the analysis to managers and directors.',
      'Owned four monthly **Power BI** KPI dashboards reporting to headquarters, transforming SQL sources through **Power Query** and **DAX** measures.',
    ],
    stack: ['Python', 'pandas', 'NumPy', 'SQL Server', 'scikit-learn', 'Power BI', 'DAX'],
  },
  {
    id: 'uwaft-swe',
    title: 'Software Engineer',
    company: 'UWAFT',
    companyUrl: 'https://uwaft.ca/',
    companyAbout:
      'The University of Waterloo Alternative Fuels Team builds autonomous and low-emission vehicle technology for intercollegiate competition.',
    logo: { src: '/images/logos/uwaft.webp', width: 160, height: 36, background: '#ffffff' },
    dates: 'Sep 2022 - Jan 2023',
    location: 'Waterloo, ON',
    summary:
      'Fused LiDAR and camera perception in C++ and distributed simulation across a 10-node containerized cluster.',
    highlights: [
      'Built a **C++** Extended Kalman Filter fusing LiDAR and camera input on **OpenCV**, tracking position, velocity, acceleration, and bearing to cut obstacle-detection false positives 15%.',
      'Handled coordinate frame transforms and LiDAR-to-camera calibration so both sensors resolved into a common frame; integrated over **ROS 2** with rosbag replay against recorded drives.',
      'Architected a containerized **Docker** simulation harness across a 10-node cluster, orchestrated with **Docker Compose** for parallel perception-model testing in **CARLA** and **MATLAB**.',
      'Instrumented a real-time telemetry pipeline processing 10+ GB/hr of camera and CAN bus data, with **Prometheus** P99 alerting on latency and drop rate.',
    ],
    stack: ['C++', 'OpenCV', 'ROS 2', 'Docker Compose', 'Prometheus', 'Bazel', 'GoogleTest', 'CARLA'],
  },
]
