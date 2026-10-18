// Content for the Via product page (/via/). Facts and prices come from
// via.theivies.in (home, /pricing, /recruiters). Update both together.

export const VIA_URL = 'https://via.theivies.in/'

export const VIA = {
  slug: 'via',
  navTitle: 'Via',
  metaTitle: 'Via: Hiring With AI-Verified Skills | Ivies',
  metaDescription:
    'Via by Ivies: a hiring platform where candidates verify skills in a spoken AI interview, only matches can apply, and every applicant gets an answer.',
  eyebrow: 'Our product',
  lead: 'Via is the job platform we built for the age of one-click AI applications. Candidates prove their skills once in a spoken AI interview, recruiters only hear from people who match, and every applicant gets an answer.',
  links: {
    open: VIA_URL,
    verify: `${VIA_URL}candidate/verify`,
    post: `${VIA_URL}recruiter/jobs/new`,
    jobs: `${VIA_URL}jobs`,
    pricing: `${VIA_URL}pricing`,
  },

  problem: {
    title: ['Hiring broke', 'when applying got easy.'],
    body: 'AI made it effortless to apply to hundreds of jobs. Recruiters now drown in applications, many of them AI-written or fake, and candidates are left waiting for replies that never come.',
    stats: [
      { value: 244, suffix: '', label: 'applications per job, more than double 2022' },
      { value: 63, suffix: '%', label: 'of candidates were ghosted after an interview' },
      { value: 31, suffix: '%', label: 'of hiring managers interviewed a fake identity' },
    ],
    source: 'Figures as cited by Via: Greenhouse and ManpowerGroup, 2025–2026.',
  },

  candidates: {
    title: ['Prove it once.', 'Apply where you match.'],
    body: 'Three steps between a candidate and every Via job. No cover-letter guessing games and no black boxes.',
    steps: [
      { title: 'Upload your résumé', body: 'Overnight, Via reads it into a skill tree: every skill on the résumé, with the level the résumé claims.' },
      { title: 'Prove it out loud', body: 'A spoken AI interview covers every skill in the tree. Each skill gets a score and a verified level, and 50% overall earns the verified badge. It costs ₹50.' },
      { title: 'Apply where you match', body: 'Candidates apply to Via jobs their verified skills match at 65% or more, and every employer commits to answering every applicant.' },
    ],
  },

  recruiters: {
    title: ['Hire people who', 'already proved it.'],
    body: 'Recruiters only see candidates who have shown they can do what their résumé claims, ranked by how well their verified skills fit the role.',
    features: [
      { title: 'Every applicant is verified', body: 'Candidates verify every skill on their résumé in a spoken AI interview and must match 65% of your checklist to apply. No spam, no bots, no keyword-stuffed CVs.' },
      { title: 'Ranked by verified match', body: 'Via reads your job description into a skill checklist you confirm. Applicants arrive ranked by how well their verified levels meet it.' },
      { title: 'Pay per post', body: 'A one-time payment for each job. No subscription to forget and no seat licences.' },
      { title: 'Reply in one click', body: 'Shortlist, invite to interview or decline with a message. A reason is required for every no, and candidates are told by email.' },
    ],
  },

  pricing: [
    {
      name: 'Standard',
      price: '₹100',
      unit: 'per job post',
      note: 'One-time payment · live for 30 days',
      points: ['Only interview-verified candidates matching 65%+ can apply', 'Applicants ranked by verified skill match', 'Applicant tracking with candidate replies'],
    },
    {
      name: 'Featured',
      price: '₹200',
      unit: 'per job post',
      note: 'One-time payment · live for 45 days',
      points: ['Pinned to the top of search results', 'Highlighted card with a Featured badge', 'Everything in Standard'],
      featured: true,
    },
    {
      name: 'Skill verification',
      price: '₹50',
      unit: 'for candidates',
      note: 'One spoken AI interview on every résumé skill',
      points: ['A score and verified level for each skill', 'Verified badge at 50% overall', 'Linked jobs are free to browse'],
    },
  ],

  linked: {
    title: ['Real openings', 'from across the web.'],
    body: 'Alongside Via jobs, the Via team finds real roles on company sites and job boards. Candidates read them on Via, then apply on the original posting.',
    points: ['Checked for ghost and scam listings', 'No account needed to browse', 'A clear “apply on …” label on every card'],
  },

  ai: {
    title: ['The AI', 'behind Via.'],
    body: 'Via is Ivies’ own proof that AI can make hiring fairer instead of noisier. The same team that builds AI for our clients designed every step:',
    items: [
      { title: 'Résumé to skill tree', body: 'Résumés are read into a structured tree of skills and claimed levels, ready to be tested.', href: 'generative-ai-development' },
      { title: 'Spoken AI interviews', body: 'Candidates answer out loud, skill by skill, and receive a score and a verified level for each one.', href: 'ai-development' },
      { title: 'Job description to checklist', body: 'A recruiter’s job description becomes a skill checklist they confirm before the job goes live.', href: 'ai-integration' },
      { title: 'Match ranking', body: 'Verified levels are scored against the checklist, so only matching candidates can apply and the best fits appear first.', href: 'machine-learning-development' },
    ],
  },

  faqs: [
    { q: 'What is Via?', a: 'Via is a job platform built by Ivies. Candidates verify the skills on their résumé in a spoken AI interview, only candidates who match a job can apply to it, and employers commit to answering every applicant. Via also lists real openings from across the web.' },
    { q: 'How does skill verification work?', a: 'You upload your résumé and Via reads it into a skill tree overnight. You then take one spoken AI interview covering every skill in that tree. Each skill gets a score and a verified level, and 50% overall earns the verified badge. Verification costs ₹50, and a new résumé needs a new verification.' },
    { q: 'Who can apply to a Via job?', a: 'Only candidates whose verified skills match at least 65% of the job’s skill checklist. That keeps applications relevant for recruiters and gives candidates a real chance on every job they apply to.' },
    { q: 'How much does it cost to post a job?', a: 'A Standard post is ₹100 and stays live for 30 days. A Featured post is ₹200, stays live for 45 days and is pinned to the top of search results. Both are one-time payments with no subscription or seat fees.' },
    { q: 'Will I hear back after applying?', a: 'Yes. Every employer on Via commits to answering every applicant, and a reason is required whenever they decline. Candidates are told by email.' },
    { q: 'Do I need an account to browse jobs?', a: 'No. Linked jobs from across the web are free to browse without an account, and each one shows where you will apply. You need a verified profile to apply to jobs posted on Via.' },
  ],
}
