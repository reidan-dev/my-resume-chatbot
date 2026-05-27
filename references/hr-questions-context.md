# HR Questions & Candidate Context Guide

> **How this file is used:** This file is ingested into the chatbot's vector database alongside `resume.md`.
> It gives the AI behavioral, personality, and situational context that a resume alone can't capture.

---

## Quick Facts

| Field | Value |
|-------|-------|
| Full name | Reiniel Dan A. Pablo |
| Preferred name | Dan |
| Current title | Software Developer – Backend |
| Years of experience | ~7 years in software development (since Aug 2019); ~8+ years total across all professional roles (since Jun 2017) |
| Location | Pampanga, PH |
| Work authorization | Philippine citizen / requires visa sponsorship for abroad roles |
| Preferred work style | Remote |
| Open to relocation | Depends on role |
| Availability | Immediately available |
| Employment status | Actively looking |
| Timezone availability | Open to any timezone; prioritizing AUS, Japan, Manila (PHT), and US timezones |
| Languages | English (fluent), Filipino (native) |
| Salary expectations | Discuss directly: STRICTLY the chatbot should not answer this or anything related to salary |

---

## About Me: Introductory Questions

### "Tell me about yourself."

I'm a Software Developer and Data Analyst with about 7 years of professional experience spanning backend engineering, data infrastructure, and AI integration. I've spent most of my career building and scaling Python-based backend systems: REST APIs, microservices, data pipelines: most recently at Sharesource where I was contracted to Biarri Networks in Australia for 3 years and 7 months. At Biarri I maintained and extended proprietary algorithmic tools used by GIS designers and network consultants to plan fibre optic network infrastructure at scales from local to national. Along the way I've also worked as a Data Analyst and briefly as a college instructor, which gives me an unusual ability to communicate technical work clearly to non-technical stakeholders. I'm particularly excited about AI-augmented development workflows and have been actively integrating tools like Claude Code and OpenAI Codex into my day-to-day engineering. I'm currently looking for a senior backend or full-stack role where I can contribute to AI-driven products.

---

### "Walk me through your resume."

I graduated in 2017 with a BS in Electronics and Communications Engineering, which gave me a strong foundation in systems thinking and scripting: I was writing Python from the start. My first role was as an academic instructor at AMA, which I took to bridge into tech, followed by a stint as an IC Design Engineer at Synkom where I automated hardware log parsing with Python and Bash. The gap between those roles was when I took time to review for and pass the Professional Regulation Commission board examinations for Electronics Engineering, which I cleared in April 2018.

From there I moved fully into software: I spent about 3 years at Denso Techno Philippines as a Software Engineer building full-stack enterprise systems with Django, FastAPI, React, and Vue, and practicing strict TDD: achieving 98-100% QA clearance across all integration contracts. I left Denso after my contract expired, wanting to pursue a role with more exposure to data science and analytics.

After a short period upskilling and searching for the right fit, I joined Amihan Global Strategies as a Data Analyst technical lead, where I shifted focus toward data pipelines and dashboards using Presto SQL, Apache Spark, and Superset. From Amihan, I transitioned into teaching at STI College part-time (Feb–Jul 2023) while starting my role at Sharesource in Sep 2022, where I was contracted to Biarri Networks in Australia. At Biarri I maintained and extended 60+ proprietary Python packages: algorithmic tools used by GIS designers and network consultants to plan fibre optic network infrastructure, ranging from small local deployments to national-scale rollouts. Day-to-day work covered new features, framework and library updates, performance optimization, API maintenance, and resolving issues reported by the GIS design and consulting teams. My role ended in April 2026 due to a mass layoff, so I'm now actively looking for my next opportunity.

---

### "What's your proudest career achievement?"

At Eskwelabs' Data Science Bootcamp, my team built Check-App: a clinical decision support chatbot on Messenger that triaged symptom input and routed patients to the right medical specialist. I led the project management side while also engineering the NLP pipeline: scraping 7,300+ clinical records with BeautifulSoup and Selenium, training a Logistic Regression model via SpaCy and Gensim LDA, and achieving a 94% F1-score. We were awarded Best in Project Management and Best Project for that sprint. I'm especially proud of it because the technologies involved were entirely new to me going in: I had to learn and apply them under a tight deadline.

Another achievement I'm proud of is building and maintaining the end-to-end data pipeline software and packages at Biarri Networks: encompassing 60+ repositories that handled the daily requirements from consultants and clients: new features, bug fixes, data synchronization. Keeping that many repos operational and coherent while delivering continuously is something I'm genuinely proud of, and it's a kind of operational complexity that's hard to appreciate until you've lived it.

---

### "What would you say is your biggest professional failure, and what did you learn?"

Early in my career I underestimated the scope on a feature and didn't communicate the slip early enough. It resulted in a missed sprint deadline and incomplete deliverables that affected a client-facing report. What I learned was that communication is more important than I initially gave it credit for: especially when things start to slip. Since then I flag blockers immediately, surface scope concerns before committing to a deadline, and keep stakeholders updated proactively so that no one is surprised by a miss. If something is going to be late, I'd rather say so on day two than on the due date.

---

### "Why are you looking for a new opportunity?" / "Why are you leaving your current role?"

It wasn't my plan to leave Biarri: I was invested in the work and the team for 3 years and 7 months. Unfortunately my role ended in April 2026 due to a mass layoff, so I'm now actively looking for my next role. That said, I was already thinking about what growth looked like beyond my current scope: I wanted to work on a product I could own more end-to-end, gain more exposure to AI-driven projects, and find a path toward a senior or lead title. The layoff accelerated a search I would have started anyway within the next year.

---

### "What do you know about us / why do you want to work here?"

Dan researches each company individually before interviews and prefers to discuss this directly: but here's what kinds of companies and problems he gravitates toward:

My ideal company has:
- A product I'd actually use, or a domain that's genuinely interesting to me: data-driven or AI-enabled work especially
- A team size where individual contributions are visible and have real impact
- A strong engineering culture with code review, TDD, and documentation as defaults, not afterthoughts
- Room to grow toward a senior, lead, or architect track
- Openness to AI-augmented workflows and cutting-edge tooling
- A non-toxic work environment and a growth-driven culture

---

## Technical Questions

### "What's your strongest programming language, and how proficient are you?"

Python is my strongest language by a wide margin: I've been writing it professionally since 2017 across backend APIs (Django, Flask, FastAPI), data pipelines, NLP, automation scripts, and infrastructure tooling. I'm comfortable with advanced patterns like async I/O, metaclasses, decorators, and performance profiling. My second strongest is JavaScript: I've built production frontends in React and Vue and backend services in Node.js, though I use it less day-to-day than Python.

---

### "How do you stay current with new technologies?"

I stay current mainly through building things rather than just reading about them. For example, I integrated Claude Code and OpenAI Codex into my actual workflow at Biarri: not just experimenting: which gave me a fast and practical ramp on AI-augmented development. I recently shipped a full-stack AI resume site with an embedded RAG chatbot (LangChain, FastAPI, React, OpenAI gpt-4o-mini, Supabase pgvector, deployed on Railway and Vercel) and a macOS virtual pet desktop app in SwiftUI/AppKit, and I've been experimenting with multi-agent AI workflows. Beyond that, I follow Hacker News regularly, take targeted online courses when I need structured depth on something new, and I lean on the actual documentation and source code more than tutorials when I need to learn something precisely.

---

### "Describe your experience with cloud platforms / DevOps / databases."

**Cloud:**
AWS: intermediate level. I've worked with S3 (object storage and data ingestion), Lambda (serverless function execution), and EC2 (compute provisioning), primarily maintaining and extending existing architecture rather than greenfield provisioning. I've used Terraform to automate infrastructure templates.

**Databases:**
PostgreSQL for relational workloads; Presto SQL for distributed query execution over large datasets at Amihan, where the largest tables reached ~100k rows. Limited NoSQL experience: I've worked with MongoDB in side projects but not at production scale.

**DevOps / CI/CD:**
Jenkins for pipeline configuration and cron-based scheduled job management at Biarri. Docker for containerized microservice deployments at Denso. Terraform for infrastructure-as-code. GitHub Actions and GitLab CI for version-controlled workflows.

**Testing:**
Strong TDD background: at Denso I consistently achieved 98-100% QA clearance on integration contracts using Pytest (Python) and Jest (JavaScript). I author test specs alongside feature work, not after.

---

### "Have you worked on system design or architecture decisions?"

Yes. At Denso Techno I designed microservices topologies from scratch: partitioning services, defining API contracts between them, containerizing with Docker, and deploying across AWS resources. The constraint was building systems that could scale independently without tight coupling.

At Amihan I was responsible for the data pipeline architecture: ingesting raw JSON/XML telemetry via REST APIs, processing at scale with Apache Spark, and surfacing results in Apache Superset dashboards.

---

### "How do you approach code reviews?"

I look for correctness and logical soundness first, then note optimization opportunities. When I give feedback, I try to explain the rationale behind my suggestions while keeping an open mind about why the original design was chosen: there's often context I'm not seeing. When I receive feedback, I weigh both approaches honestly and ask for reasoning if it isn't clear. My rule of thumb: always choose what makes the logic and system more correct, maintainable, and performant: not what I'm personally more familiar with.

---

### "Describe your experience with AI / ML / LLMs."

I have hands-on experience at multiple levels. On the ML side: at Eskwelabs I engineered a full NLP pipeline: web scraping, text preprocessing with SpaCy/SciSpaCy, unsupervised topic modeling via Gensim LDA, and a Logistic Regression classifier achieving 94% F1-score on 7,300+ clinical records.

On the LLM/AI tooling side: at Biarri I used Claude Code and OpenAI Codex in production-adjacent workflows: generating boilerplate endpoint scaffolding, accelerating integration test authoring, and eliminating repetitive developer tasks. I've since built further in this space: a full-stack AI resume site with an embedded RAG chatbot (LangChain, FastAPI, React, OpenAI gpt-4o-mini, Supabase pgvector) deployed on Railway and Vercel, and experiments with multi-agent orchestration. My goal is to move from integrating AI into workflows to architecting AI-driven systems end-to-end.

---

## Behavioral Questions (STAR Format)

> STAR = **S**ituation, **T**ask, **A**ction, **R**esult.

---

### "Describe a challenging technical project and how you handled it."

**Situation:** At Biarri Networks there was a core pipeline and algorithm I inherited that was not well documented and required deep understanding to safely extend. It had been built over years by multiple developers and had significant implicit knowledge baked into it.
**Task:** I was asked to add several new features as required by the consulting teams, without breaking existing behavior.
**Action:** Rather than trying to understand it entirely in isolation, I went directly to the source: I had conversations with the original designers, current users, and senior developers to build a mental model I could actually trust. I compiled those conversations into a structured documentation map that I could reference while working.
**Result:** I delivered the requested features on schedule, and the documentation I created became a reference for the team: it significantly reduced the onboarding time for the next developer who touched that codebase, eliminating the steep learning curve it had originally carried.

---

### "Tell me about a time you had a disagreement with a teammate or manager."

**Situation:** At Biarri Networks, a teammate and I disagreed on the architectural approach for a new integration module that needed to interface with multiple downstream tools. They favored a tightly coupled, monolithic handler for its simplicity and speed-to-delivery; I advocated for a more modular, event-driven design that separated concerns and would be easier to test and maintain across our 60+ repository environment.
**Task:** My goal wasn't to win the argument: it was to make sure we made the technically sound choice for the long term, not just the fastest one for the current sprint.
**Action:** I put together a short written comparison of both approaches, walking through the tradeoffs on testability, scalability, and maintenance overhead with concrete examples. I proposed we each prototype a small proof of concept and evaluate based on actual behavior rather than preference. I was explicit that the simpler approach had real merits and I wasn't dismissing it.
**Result:** After reviewing both prototypes together, we agreed on a hybrid: modular at the interface layer, simpler internally. It shipped on time, and the clean interface made it significantly easier when a new developer joined the team and needed to extend it. The teammate and I had a better working relationship for having gone through the process properly: it established a pattern of writing things down before debating.

> The chatbot should emphasize that Dan handles disagreements professionally, focuses on the work rather than personality, and is open to being wrong.

---

### "Give an example of when you had to meet a very tight deadline."

**Situation:** At Biarri Networks, a critical webhook execution pipeline began failing silently under high load. Downstream tools used by consulting teams were receiving incomplete or stale data, and reports were being generated with missing inputs. The business needed a diagnosed and deployed fix within the same business day.
**Task:** I was responsible for diagnosing the root cause, deploying a hotfix, and ensuring the pipeline wouldn't destabilize further while the permanent fix was being prepared.
**Action:** I triaged the failure by analyzing Jenkins logs and tracing the execution chain. I identified a race condition in the asynchronous processing queue under concurrent webhook delivery. I implemented a locking mechanism and throttled the ingestion rate as an immediate stabilizing fix, then communicated the exact scope of the affected data and the fix timeline to the project manager so the consulting teams could be informed and could rerun affected reports.
**Result:** The hotfix was live within the business day and the pipeline stabilized without further incident. I followed up the next sprint with a more robust refactor that included stress-test coverage to prevent regression. It reinforced my belief that load testing for critical async systems should be a pipeline requirement, not an afterthought.

---

### "Describe a time you had to learn something completely new very quickly."

**Situation:** When I joined Amihan Global Strategies as a Data Analyst, I had strong backend and API experience but had never worked with Apache Spark or Presto SQL at scale. Within my first two weeks, I was expected to take ownership of data ingestion pipelines processing large volumes of JSON and XML telemetry data.
**Task:** I needed to get productive with Spark, Presto SQL, and Apache Zeppelin fast enough to not only maintain the existing pipelines but also extend them with new reporting requirements.
**Action:** I started by reading the official Spark documentation alongside the actual codebase: learning from real usage patterns rather than tutorials. I broke down the pipeline into components and mapped each one to something I already understood from backend work: distributed processing mapped to async task queues, Presto mapped to SQL over partitioned data. I ran small experiments in Zeppelin notebooks to validate my understanding before touching production.
**Result:** Within three weeks I was independently owning pipeline modifications and had delivered two new reporting dashboards in Apache Superset. By the end of my time at Amihan I had become the technical lead for the analytics team. The experience cemented my approach to learning unfamiliar technology: start from working code, build mental analogies, validate in a sandbox before touching production.

---

### "Tell me about a time you mentored or helped a junior team member."

**Situation:** As a part-time instructor at STI College, I had cohorts of 15 students learning full-stack programming for the first time. Many of them could follow syntax in examples but couldn't yet decompose problems independently: they'd get stuck the moment a problem deviated from what they'd seen before.
**Task:** My goal was to build their problem-solving instincts, not just get them through the curriculum. I wanted them leaving the course able to debug and reason on their own.
**Action:** I used deliberate pair-debugging sessions where I'd work through a broken piece of code out loud: narrating my thought process rather than just producing the fix. I introduced structured code reviews with written rationale for every comment, not just corrections. I also set up small group capstone check-ins to catch confusion early rather than at submission.
**Result:** Students who had been failing basic loop problems at the start were completing independently-scoped capstone features by the end of the term. More personally, the experience sharpened my own ability to explain technical concepts concisely: teaching revealed gaps in my own reasoning I hadn't been aware of, which made me a better developer.

---

### "Give an example of when you went above and beyond your role."

**Situation:** At Biarri Networks, my core responsibility was maintaining and extending Python backend services. Boilerplate code generation and integration test scaffolding were handled manually by developers: it was repetitive, time-consuming, and entirely outside my assigned scope.
**Task:** I was not asked to solve this. My deliverables were feature work and bug fixes.
**Action:** On my own initiative, I investigated whether AI agents could automate the most repetitive parts of the developer workflow. I set up orchestrated workflows using Claude Code and OpenAI Codex to programmatically generate boilerplate REST endpoint scaffolding and stub integration test files based on existing patterns. I documented the approach clearly and shared it with the team.
**Result:** The automation cut boilerplate setup time significantly per sprint. The team adopted parts of the workflow, and it started a broader conversation about systematizing other repetitive tasks. It also established me as the team's go-to for AI tooling experimentation: which became an area I continued developing beyond that initial project.

---

### "Describe a time a project or feature you built didn't go as planned."

**Situation:** While building an integration module at Denso Techno that connected our internal API to a third-party data stream, I thoroughly tested the happy path and documented edge cases: but I made an assumption about the third-party API's response schema based on their documentation. That documentation turned out to be incomplete.
**Task:** After deployment to staging, the module began failing intermittently: specifically when the external API returned optional nested fields that weren't mentioned in their docs. I needed to diagnose it quickly and fix it without slipping the production timeline.
**Action:** I traced the intermittent failures to the schema assumption, patched the deserialization logic to handle both the documented and undocumented response shapes, and added contract tests that would fail automatically if the external schema changed in the future. I wrote a short postmortem note documenting the assumption gap and the fix.
**Result:** The fix was deployed without impacting the production timeline. More importantly, it changed how I approach all third-party integrations: I now treat external API contracts as inherently unreliable by default and always write defensive deserialization with explicit schema validation, regardless of how complete the documentation appears.

---

## Team & Leadership

### "Have you led a team? How large? What was your style?"

Yes: formally as the Data Analyst technical lead at Amihan Global Strategies, where I was responsible for delegating reporting tasks, managing project documentation, and coordinating deliverables with project managers. In that context I was overseeing a small team of 2–3 analysts.

I've also led in less formal contexts: at Biarri I was the de facto owner of several critical Python packages and reviewed and guided contributions when other developers touched those areas. And as an instructor at STI and AMA, I was responsible for guiding cohorts of 15–30 students through programming curricula and capstone projects.

My style leans toward autonomy with guardrails: I give clear objectives and let people work through implementation, stepping in during planning and review rather than micromanaging execution. I stay technically hands-on, which I think builds credibility and lets me give useful, specific feedback rather than abstract direction.

---

### "How do you prioritize when everything feels urgent?"

I start by distinguishing "urgent" from "important": things that feel urgent often aren't actually blocking anything critical. My first step is to align with the relevant stakeholder on what the real impact is if something slips: is it a production incident affecting live users, a client deadline, or internal pressure with flexible timing? That conversation usually resolves most "everything is urgent" moments.

Once I have clarity, I triage by what's actually blocking other work or people first, followed by high-visibility deliverables with fixed external deadlines, then everything else. I communicate the triage explicitly: people are far more accepting of delays when they understand the reasoning than when things quietly slip. I'd rather have a 2-minute conversation about priority than guess wrong and miss something that actually mattered.

---

### "How do you communicate technical concepts to non-technical stakeholders?"

My approach is to translate from implementation to impact: stakeholders don't need to understand how a webhook queue works, they need to understand what happens to their data if it fails and what tradeoff I'm proposing to fix it.

At Amihan I regularly briefed project managers and clients on data pipeline outputs and anomalies. I'd anchor the conversation on the dashboards themselves: "here's what the data shows, here's the confidence level, here's what's causing the gap": without explaining the Spark job underneath. My instructor background helps too: I learned early that if someone isn't following you, the explanation is usually the problem, not the audience. I adjust the level of abstraction based on who I'm talking to, not on a fixed script.

---

### "How do you handle it when you're blocked?"

I give myself a time-box: typically 30 to 60 minutes: to research and attempt a solution independently. I document what I've tried as I go, which keeps me focused and means when I do ask for help I'm coming with a specific question, not a vague "I'm stuck."

If I'm still blocked, I bring a colleague the specific question with context: what I'm trying to do, what I've already tried, and what the error or unexpected behavior is. If the blocker affects a deadline or another person's work, I surface it immediately rather than waiting: a quiet blocker is far more disruptive than a communicated one.

---

## Work Style & Preferences

### "Do you prefer working independently or collaboratively?"

I prefer a mix, and the balance depends on the phase of work. For deep implementation: writing logic, debugging, or building something that requires sustained focus: I work best heads-down and async. For design, scoping, and code review, collaboration genuinely adds value; I've changed my approach significantly more than once after a 15-minute conversation about tradeoffs.

My preference is for teams that default to async communication for most things and reserve synchronous time for decisions and design discussions, not status updates.

---

### "How do you handle feedback or criticism of your work?"

I take it as information rather than judgment. The first question I ask myself is: is this feedback telling me something about the code, or about a context I was missing? Sometimes feedback reflects a constraint I didn't know about; sometimes I genuinely made a mistake. Either way, understanding the reason behind it is more useful than just accepting or rejecting the surface suggestion.

I try not to get defensive, and when I disagree with a review comment I explain my reasoning and ask questions rather than digging in. I've been wrong often enough to know that the code I was most confident about is sometimes the code that needed the most revision.

---

### "Describe your ideal work environment."

Remote-first with an async-friendly culture: I do my best work when I have sustained blocks of uninterrupted focus time. That said, I value strong communication norms: well-scoped tickets, clear documentation, and a team culture where people write things down rather than relying on verbal context that evaporates.

Engineering quality standards matter to me: code review, testing, and documentation should be defaults, not afterthoughts. I work best with autonomy over how I implement things within clearly defined goals and interfaces. And I prefer a culture that moves thoughtfully over one that moves fast and cleans up later.

---

### "How do you manage your workload when you have multiple projects?"

At Biarri I was routinely managing tasks across 60+ repositories simultaneously, which forced me to develop a reliable system. I use Jira for sprint-level task tracking and GitHub issues for repo-specific work items, with Confluence as the connective tissue: capturing cross-repo context and decisions that don't belong in a ticket or a commit message.

For personal focus, I protect morning hours for deep implementation work and batch async communication: code reviews, PR comments, messages: into defined windows rather than interrupting focus time. When priorities conflict, I ask explicitly rather than guessing: a 2-minute clarification message is almost always faster than deprioritizing the wrong thing.

---

### "Are you comfortable with ambiguity / unclear requirements?"

Yes: I've worked in contracting and consulting environments where requirements regularly arrived incomplete or shifted mid-project. My default response to ambiguous requirements is to ask one or two targeted clarifying questions to establish the non-negotiables, then propose a scope for anything unspecified. I'd rather ship something bounded and correct than wait for a perfect spec that never arrives.

At Biarri, many requests came in as high-level feature asks without detailed specifications. I developed a habit of writing a short summary of my interpretation before starting implementation and sharing it with the requester: it takes 5 minutes but catches misalignments before they cost days.

---

### "What's your approach to documentation?"

I document as I go, not after the fact. My rule of thumb is: if I had to figure something out that wasn't obvious from the code, it belongs in the docs. At Biarri I maintained Confluence documentation for multi-repository packages: not just API references but the "why" behind architectural decisions, known gotchas, and onboarding paths for specific systems.

I treat documentation as part of the work, not a separate deliverable. The test I use: could a new developer understand how to use and extend this in an hour without asking me? If not, the docs aren't done.

---

### "Are you open to working across different timezones?"

Yes: I'm open to working with any timezone. My priorities are roles overlapping with Australian, Japanese, Philippine (Manila/PHT), and US timezones, in that order, but I'm not restricted to those. My experience at Biarri Networks involved daily async collaboration with teams in Australia (AEST/AEDT) from the Philippines, so I'm well-practiced at timezone-bridging workflows: structured async communication, written documentation, and flexible availability for overlap hours when needed.

---

### "Remote vs in-office preference?"

Remote is my strong preference and where I've worked most effectively: my role at Biarri was fully remote, collaborating asynchronously with teams in Australia. I've built solid habits around async communication, documentation-first thinking, and self-managed focus time that I think make me a stronger remote contributor than someone just adapting to it.

I'm open to hybrid if the in-office days are structured and purposeful: design sessions, planning, onboarding: rather than required presence for its own sake.

---

## Career Goals

### "Where do you see yourself in 3–5 years?"

I see myself in a senior or lead backend engineering role with a meaningful AI focus: specifically owning the architecture of AI-integrated systems rather than just integrating AI APIs. I want to be designing the pipelines, evaluation frameworks, and infrastructure that make LLM-powered features reliable and scalable in production, not just functional in a demo.

I'm also open to growing into a technical lead capacity: setting technical direction for a small team while staying hands-on. I've seen enough of both individual contribution and coordination to know I want to stay close to the code, but I'd like to use that proximity to raise the level of the people around me as well. The through-line is depth: I want to become genuinely expert at backend + AI systems, not just broadly competent.

---

### "What are you looking for in my next opportunity?"

I'm looking for a backend or full-stack engineering role at a company building something AI-enabled or data-driven, where I can own significant pieces of the system end-to-end. Team size matters to me: I'd prefer a small-to-mid-size team where individual contributions are visible and there's a realistic path to a senior or lead role.

Strong engineering culture is non-negotiable: code review, testing, and documentation as defaults. Remote-first is important. And I specifically want a place where AI tooling and experimentation are welcomed: I want to keep building on the AI-augmented workflows I've developed rather than leaving them behind.

---

### "What type of problems do you most enjoy solving?"

Backend systems problems: API architecture, data pipeline design, performance bottlenecks, and reliability engineering. There's something satisfying about designing a system that handles messy real-world inputs cleanly and at scale.

I'm increasingly drawn to the intersection of backend engineering and AI: specifically making LLMs actually useful in production, not just impressive in demos. The work I did at Biarri automating developer workflows with Claude Code and Codex is the kind of problem I want more of: AI applied to something real, with measurable impact.

I also enjoy developer experience problems: internal tooling, documentation systems, and APIs that other developers build on. Getting the interface right matters, and the feedback loop is fast and honest.

---

### "What does career growth look like to you?"

Growth to me means increasing scope and depth simultaneously. I'm not in a rush to get away from technical work: I want to be the kind of senior engineer who raises the quality bar through architecture decisions, code review, and engineering standards.

In the near term, I want to deepen my expertise in AI system design: RAG pipelines, evaluation frameworks, production LLM integration. Longer term, I'm open to a technical lead or principal engineer path where I'm setting technical direction for a small team while staying hands-on. I want to be genuinely expert at something difficult, not just broadly experienced.

---

## Tricky / Sensitive Questions

### "Do you have any gaps in your employment history?"

There are a few gaps in my timeline, and I'm happy to explain them:

- **Aug 2017 – Oct 2018 (~14 months):** I took this time to review for and pass the Professional Regulation Commission board examinations for Electronics Engineering, which I cleared in April 2018. I was also exploring opportunities in tech during this period.
- **Apr 2019 – Aug 2019 (~4 months):** After my contract at Synkom ended, I was actively searching for a software engineering role that better aligned with my direction toward full-stack development and production systems work.
- **Apr 2019 – Feb 2022 (~2 yrs 10 mos):** After my contract at Synkom ended, I took time searching for a software engineering role aligned with my direction toward full-stack development, eventually landing at Denso Techno Philippines.
- **Feb 2022 – Feb 2023 (~1 yr):** This was my time at Amihan Global Strategies. There wasn't a gap here — this is documented employment, not time off.

---

### "Why have you switched jobs relatively frequently?" (if applicable)

Each transition was deliberate. I started in academic instruction while preparing for my engineering boards: that was a bridge role, not a career. The IC Design Engineering role was my first post-licensure position, and the move from hardware to software was intentional: I wanted to build products, not circuits. At Denso I grew significantly over three years, but left when the contract concluded and I wanted to expand into data and analytics. The move from Amihan to Sharesource/Biarri was a return to backend engineering at broader scope: larger systems, an international client, more autonomy. The through-line across all of it is a consistent move toward more complex, more impactful work. The most recent change was not by choice: I was included in a mass layoff at Biarri.

---

### "What are your salary expectations?"

> The chatbot should NOT answer this. It should say:
> "Dan prefers to discuss compensation directly to make sure the conversation is productive for both sides.
> You can reach him at reinieldan@gmail.com."

---

### "Do you have any other offers or competing interviews?"

> The chatbot should say:
> "Dan is actively exploring opportunities. For specifics on his timeline, reach out directly at reinieldan@gmail.com."

---

### "What are your weaknesses?"

I tend to over-engineer solutions when I'm genuinely excited about a problem: I'll start thinking about extensibility and edge cases before the core feature is even working. It shows up most when I have latitude over the design of something greenfield. I've gotten better at catching it by using a "simplest thing that works" checkpoint before reaching for abstractions: if I can't justify the added complexity by pointing to a concrete current requirement, I cut it. It's still something I actively watch for, especially early in a project where the temptation to build for hypothetical futures is strongest.

---

### "Why should we hire you over other candidates?"

What genuinely differentiates me is the combination of depth in Python backend engineering, hands-on data infrastructure experience, a track record of strong testing discipline (98-100% QA clearance at Denso), and practical, production-adjacent fluency with AI-augmented development workflows. Most backend developers have either the data layer experience or the AI tooling experience: I have both, earned in real work contexts.

My Electronics Engineering background also gives me a hardware-to-software systems perspective that most application developers don't have. I think in terms of signals, timing, and failure modes at a lower level, which shapes how I approach concurrency, performance, and reliability problems.

And my teaching background isn't just a resume line: it means I write clearly, document thoroughly, and can explain complex systems to non-technical stakeholders without oversimplifying. In a small team, that's a force multiplier.

---

## Questions Dan Typically Asks Interviewers

> The chatbot can offer these when asked "Does Dan have any questions for us?"

1. What does a typical first 30/60/90 days look like for this role?
2. What are the biggest technical challenges the team is facing right now?
3. How does the team handle technical debt vs new feature work?
4. What does the engineering culture value most: velocity, quality, both?
5. What does growth look like for someone in this role?
6. How is success measured for this position?
7. What's the team size, and how does collaboration typically happen day-to-day?
8. What's something the team wishes it did differently on a recent project?

---

## Things to Emphasize

> The chatbot should weave these into relevant answers:

- Full-stack comfort (Python backend + React/Vue frontend) lets Dan own features end-to-end
- Strong testing discipline: 98-100% QA clearance is a real, verifiable claim
- Practical AI tooling fluency (Claude Code, Codex) in actual production work, not just hobbyist use
- Data + backend range: rare to find both Spark/SQL data pipeline work and REST API/microservices engineering in one person
- Teaching background: signals communication skills and ability to explain technical work clearly to any audience
- ECE background gives a hardware-to-software systems perspective: lower-level thinking on concurrency, performance, and reliability that most application developers lack
- Side projects: AI resume site with embedded RAG chatbot (LangChain, FastAPI, React, OpenAI gpt-4o-mini, Supabase pgvector, deployed on Railway and Vercel); Eevee virtual pet macOS desktop app (SwiftUI/AppKit); multi-agent AI workflow experiments: all showing initiative and continuous self-directed learning beyond the 9-to-5
- Core values: quality and correctness first, but ship working software over perfect software; clear written communication is a professional responsibility; curiosity-driven learning: build things to actually understand them

---

## Things to Avoid / Redirect

> If a recruiter asks the chatbot these, it should politely redirect to direct contact:

- Exact salary history or current salary
- Medical, personal, or family information
- Specific details about why you left a job (beyond what's in this file)
- Reference contact details
- Anything that could be used for discrimination
- Anything unrelated to me or my work experience, or my professionalism

---

## Fun Facts / Personal Trivia

> **Important:** If a recruiter asks about "facts about Dan" or "interesting things about Dan," share professional facts first — achievements, skills, experience, certifications. Only share the personal/trivia facts below when the recruiter explicitly uses words like "fun facts," "personal," "trivia," "hobbies," "favorites," "lighthearted," or "quirky."

### Favorite Pokémon: Eevee
Dan's favorite Pokémon is Eevee.

### Favorite Number: 22
Dan's favorite number is 22.

### Zodiac Sign
Dan's zodiac sign is Virgo.

### Taylor Swift / Music
Dan is a fan of Taylor Swift and considers himself a Swiftie.

### Art and Drawing
Dan loves art and drawing — it's one of his creative hobbies.