const map: Record<string, string> = {
  // Languages
  'Python':               'devicon-python-plain colored',
  'JavaScript':           'devicon-javascript-plain colored',
  'TypeScript':           'devicon-typescript-plain colored',
  'Swift':                'devicon-swift-plain colored',

  // Frameworks & libraries
  'React':                'devicon-react-original colored',
  'Vue.js':               'devicon-vuejs-plain colored',
  'Django':               'devicon-django-plain colored',
  'Flask':                'devicon-flask-original',
  'FastAPI':              'devicon-fastapi-plain colored',
  'Node.js':              'devicon-nodejs-plain colored',
  'Vite':                 'devicon-vitejs-plain colored',
  'SwiftUI':              'devicon-swift-plain colored',
  'Bootstrap':            'devicon-bootstrap-plain colored',
  'Tailwind CSS':         'devicon-tailwindcss-plain colored',

  // Testing
  'Jest':                 'devicon-jest-plain colored',
  'Pytest':               'devicon-pytest-plain colored',
  'Selenium':             'devicon-selenium-plain colored',

  // Data & ML
  'Pandas':               'devicon-pandas-plain colored',
  'Apache Spark':         'devicon-apachespark-plain colored',

  // Databases
  'PostgreSQL':           'devicon-postgresql-plain colored',

  // DevOps & infra
  'Docker':               'devicon-docker-plain colored',
  'Terraform':            'devicon-terraform-plain colored',
  'Jenkins':              'devicon-jenkins-plain colored',
  'AWS (S3/Lambda/EC2)':  'devicon-amazonwebservices-plain colored',

  // Frontend basics
  'HTML5':                'devicon-html5-plain colored',
  'CSS3':                 'devicon-css3-plain colored',

  // APIs & protocols
  'GraphQL':              'devicon-graphql-plain colored',

  // Tools
  'Git':                  'devicon-git-plain colored',
  'Jira':                 'devicon-jira-plain colored',
  'Confluence':           'devicon-confluence-original colored',
}

export function deviconClass(tech: string): string | null {
  return map[tech] ?? null
}
