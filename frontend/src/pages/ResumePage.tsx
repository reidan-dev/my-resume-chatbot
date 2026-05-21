import { ExternalLink, Mail, MapPin, Phone } from 'lucide-react'

const GITHUB = import.meta.env.VITE_CONTACT_GITHUB ?? 'https://github.com/reidan22'
const EMAIL = import.meta.env.VITE_CONTACT_EMAIL ?? 'reinieldan@gmail.com'

const skills = {
  'Backend Development': 'Python, Django, Flask, FastAPI, Node.js, REST APIs, GraphQL, Microservices, TDD, Pytest, Jest',
  'Frontend & Web': 'JavaScript, React, Vue.js, Bootstrap, HTML5, CSS3',
  'Data & Infrastructure': 'Presto SQL, PostgreSQL, Apache Superset, Apache Spark, AWS (S3, Lambda, EC2), Terraform, Jenkins, Docker',
  'Tools & Methods': 'Git, Jira, Confluence, Claude Code, OpenAI Codex, Agile Scrum, Waterfall',
}

const experience = [
  {
    title: 'Software Developer – Backend',
    company: 'Sharesource → Biarri Networks (AUS)',
    period: 'Sep 2022 – Present',
    bullets: [
      'Engineered and scaled custom internal backends; maintained 60+ Python packages across Bitbucket and GitHub.',
      'Configured Jenkins pipelines for cron-based job management across complex multi-repo packages.',
      'Deployed critical infrastructure hotfixes under tight production constraints; optimized webhook pipelines.',
      'Pioneered AI automation workflows using Claude Code and OpenAI Codex to eliminate repetitive developer tasks.',
    ],
  },
  {
    title: 'Data Visualization Consultant / Data Analyst',
    company: 'Amihan Global Strategies',
    period: 'Aug 2022 – Feb 2023',
    bullets: [
      'Technical lead for data analytics: built dashboards in Apache Superset, managed project docs.',
      'Processed large-scale JSON/XML telemetry using Python, Presto SQL, and PostgreSQL.',
      'Built production data pipelines using Apache Zeppelin and Apache Spark.',
    ],
  },
  {
    title: 'Software Engineer',
    company: 'Denso Techno Philippines Inc.',
    period: 'Aug 2019 – Feb 2022',
    bullets: [
      'Built full-stack enterprise systems: Python (Django, FastAPI) for APIs; React, Vue.js for frontends.',
      'Deployed microservices with Docker on AWS (S3, Lambda, EC2) using Terraform.',
      'Achieved 98–100% QA clearance across all integration contracts via strict TDD with Pytest and Jest.',
    ],
  },
  {
    title: 'Part-Time College Instructor',
    company: 'STI College – Angeles City',
    period: 'Feb 2023 – Jul 2023',
    bullets: [
      'Delivered programming lectures to 15-student cohorts, covering full-stack JS and Python frameworks.',
      'Guided students through capstone completions using Agile Scrum and Waterfall workflows.',
    ],
  },
  {
    title: 'IC Design Engineer',
    company: 'Synkom IC Technology Inc.',
    period: 'Oct 2018 – Apr 2019',
    bullets: [
      'Wrote automated data parsing scripts in Python, TCL, and Bash to clean hardware verification logs.',
      'Designed hardware layout specifications and schematics based on circuit theory.',
    ],
  },
]

const projects = [
  {
    name: 'Check-App — Clinical Decision Support Chatbot',
    period: 'Eskwelabs Bootcamp, 2021',
    bullets: [
      'Built a Messenger chatbot triaging symptoms to medical specialists (ENT, Neurology, Ophthalmology).',
      'NLP pipeline: BeautifulSoup/Selenium scraping, SpaCy/SciSpaCy preprocessing, Gensim LDA, Logistic Regression — 94% F1-score on 7,300+ clinical records.',
      'Awarded Best in Project Management and Best Project (Sprint 4).',
    ],
  },
]

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-8">
      <h2 className="text-xs font-semibold uppercase tracking-widest text-emerald-600 mb-3 pb-2 border-b border-gray-200">
        {title}
      </h2>
      {children}
    </section>
  )
}

export function ResumePage() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-10">
      {/* Header */}
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Reiniel Dan A. Pablo</h1>
        <p className="mt-1 text-base font-medium text-emerald-600">
          Software Developer · Data Analyst · AI Practitioner
        </p>

        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-500">
          <a href={`mailto:${EMAIL}`} className="flex items-center gap-1.5 hover:text-emerald-600 transition-colors">
            <Mail size={13} /> {EMAIL}
          </a>
          <a href={GITHUB} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 hover:text-emerald-600 transition-colors">
            <ExternalLink size={13} /> github.com/reidan22
          </a>
          <span className="flex items-center gap-1.5">
            <MapPin size={13} /> Pampanga, PH
          </span>
          <span className="flex items-center gap-1.5">
            <Phone size={13} /> (+63) 976-208-8422
          </span>
        </div>
      </header>

      {/* Skills */}
      <Section title="Skills">
        <div className="space-y-2">
          {Object.entries(skills).map(([category, items]) => (
            <div key={category} className="flex flex-col sm:flex-row sm:gap-3 text-sm">
              <span className="font-medium text-gray-700 sm:w-44 shrink-0">{category}</span>
              <span className="text-gray-500">{items}</span>
            </div>
          ))}
        </div>
      </Section>

      {/* Experience */}
      <Section title="Experience">
        <div className="space-y-6">
          {experience.map((job) => (
            <div key={job.title + job.company}>
              <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-0.5">
                <div>
                  <span className="font-semibold text-gray-900 text-sm">{job.title}</span>
                  <span className="text-gray-500 text-sm"> · {job.company}</span>
                </div>
                <span className="text-xs text-gray-400 shrink-0">{job.period}</span>
              </div>
              <ul className="mt-2 space-y-1">
                {job.bullets.map((b) => (
                  <li key={b} className="text-sm text-gray-600 flex gap-2">
                    <span className="text-gray-300 shrink-0 mt-0.5">—</span>
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Section>

      {/* Projects */}
      <Section title="Projects & Training">
        {projects.map((p) => (
          <div key={p.name}>
            <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-0.5">
              <span className="font-semibold text-gray-900 text-sm">{p.name}</span>
              <span className="text-xs text-gray-400 shrink-0">{p.period}</span>
            </div>
            <ul className="mt-2 space-y-1">
              {p.bullets.map((b) => (
                <li key={b} className="text-sm text-gray-600 flex gap-2">
                  <span className="text-gray-300 shrink-0 mt-0.5">—</span>
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </Section>

      {/* Education */}
      <Section title="Education">
        <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-0.5">
          <div>
            <span className="font-semibold text-gray-900 text-sm">BS Electronics and Communications Engineering</span>
            <span className="text-gray-500 text-sm"> · AMA Computer College</span>
          </div>
          <span className="text-xs text-gray-400 shrink-0">Graduated Apr 2017</span>
        </div>
        <ul className="mt-2 space-y-1">
          <li className="text-sm text-gray-600 flex gap-2">
            <span className="text-gray-300 shrink-0 mt-0.5">—</span>
            Clark Development Corporation – Student Excellence Awardee
          </li>
          <li className="text-sm text-gray-600 flex gap-2">
            <span className="text-gray-300 shrink-0 mt-0.5">—</span>
            PRC Licensed Electronics Engineer & Electronics Technician (Apr 2018)
          </li>
        </ul>
      </Section>
    </div>
  )
}
