// All site copy lives here so it can be edited without touching components.
export const CONTACT_EMAIL = 'hello@theivies.in'

// "Start a project" form. The site is static, so submissions need a form
// service: paste its endpoint here (e.g. https://formspree.io/f/xxxxxx).
// Left empty, the form opens the visitor's email app with their details filled in.
export const FORM_ENDPOINT = ''

export const PROJECT_FORM = {
  services: ['App development', 'Software development', 'AI integration', 'Cloud & DevOps', 'UI / UX design', 'Tech support', 'Something else'],
  budgets: ['Not sure yet', 'Under $5k', '$5k – $15k', '$15k – $50k', '$50k+'],
}

// `page` links go to a dedicated URL; `id` links are sections on the home page.
export const NAV_LINKS = [
  { page: 'services', label: 'Services' },
  { page: 'ai-development', label: 'AI Development' },
  { id: 'apps', label: 'Apps' },
  { id: 'process', label: 'Process' },
  { id: 'industries', label: 'Industries' },
]

export const HERO = {
  eyebrow: 'AI development & software company',
  lines: ['Ideas, grown into', 'intelligent software.'],
  rotating: ['AI agents', 'generative AI apps', 'mobile apps', 'custom software', 'AI integrations', 'tech support'],
  sub: 'Ivies is an AI development company. We build generative AI apps, AI agents and custom software, integrate AI into the products you already run, and support it all after launch.',
  pills: ['FinTech', 'EdTech', 'Healthcare', 'Retail', 'Logistics'],
}

export const MARQUEE = [
  'Generative AI',
  'AI Agents',
  'LLM Integration',
  'Machine Learning',
  'App Development',
  'Software Engineering',
  'Cloud & DevOps',
  'UI / UX Design',
  'Data & Analytics',
  'Managed Tech Support',
]

// AI development services — the site's main focus.
export const AI_SERVICES = [
  {
    key: 'genai',
    page: 'generative-ai-development',
    title: 'Generative AI app development',
    body: 'Custom products built on large language models: writing assistants, content and code generation, document drafting and AI copilots inside your workflow.',
    stack: ['GPT', 'Claude', 'Gemini', 'Llama'],
  },
  {
    key: 'agents',
    page: 'ai-agent-development',
    title: 'AI agent development',
    body: 'Agents that plan multi-step work, call your APIs and tools, and take action, with human approval wherever the stakes are high.',
    stack: ['Tool calling', 'Workflows', 'Human-in-the-loop'],
  },
  {
    key: 'rag',
    page: 'generative-ai-development',
    title: 'RAG & AI knowledge assistants',
    body: 'Chat with your documents, policies and data. Answers cite their sources and respect who is allowed to see what.',
    stack: ['Vector search', 'Citations', 'Access control'],
  },
  {
    key: 'chatbots',
    page: 'ai-chatbot-development',
    title: 'AI chatbots & virtual assistants',
    body: 'Support and sales assistants for your website and apps that answer questions, qualify leads and hand off to a person when needed.',
    stack: ['Web', 'Mobile', 'Live handoff'],
  },
  {
    key: 'integration',
    page: 'ai-integration',
    title: 'AI integration services',
    body: 'Add AI to the software you already run, such as your CRM, ERP, LMS or mobile app, through secure APIs instead of a rebuild.',
    stack: ['OpenAI', 'Anthropic', 'Azure AI', 'Vertex AI'],
  },
  {
    key: 'ml',
    page: 'machine-learning-development',
    title: 'Machine learning & predictive analytics',
    body: 'Models that forecast demand, score risk, spot anomalies and recommend the next best action from your own data.',
    stack: ['Forecasting', 'Classification', 'Recommendations'],
  },
  {
    key: 'vision',
    page: 'machine-learning-development',
    title: 'Computer vision & document AI',
    body: 'OCR, receipt and invoice extraction, image classification and on-device recognition. Our own Fairly app reads receipts on the phone with no cloud upload.',
    stack: ['OCR', 'On-device ML', 'Extraction'],
  },
  {
    key: 'mlops',
    page: 'ai-development',
    title: 'AI strategy, fine-tuning & MLOps',
    body: 'Find where AI pays off, fine-tune and evaluate models, then deploy, monitor and keep running costs under control.',
    stack: ['Evaluation', 'Fine-tuning', 'Monitoring'],
  },
]

// Visible FAQ — written as direct, quotable answers (helps AI answer engines).
export const FAQS = [
  {
    q: 'What does Ivies do?',
    a: 'Ivies is a technology company that builds software for businesses in every industry: AI development and AI integration, custom software, web platforms, Android and iOS apps, cloud and DevOps, UI/UX design, and ongoing tech support. We also build our own products: the Android apps welikethisone, Fairly and dashtr, and LANClip for Windows and Android.',
  },
  {
    q: 'What AI development services do you offer?',
    a: 'We build generative AI apps, AI agents, RAG knowledge assistants that answer from your own documents, AI chatbots, machine learning and predictive models, and computer vision and document AI such as OCR and invoice extraction. We also handle AI strategy, model fine-tuning and MLOps.',
  },
  {
    q: 'Can you integrate AI into our existing software?',
    a: 'Yes. AI integration is one of our core services. We connect models from providers such as OpenAI, Anthropic, Google and Microsoft Azure to your existing CRM, ERP, LMS, website or mobile app through secure APIs, so you add AI features without rebuilding your product.',
  },
  {
    q: 'Which AI models and platforms do you work with?',
    a: 'We pick the model for the job rather than one vendor: GPT, Claude, Gemini and open models such as Llama, hosted through OpenAI, Anthropic, Azure AI or Google Vertex AI, or run on-device when privacy or offline use matters.',
  },
  {
    q: 'How long does it take to build an AI solution?',
    a: 'It depends on scope. A focused proof of concept is usually measured in weeks, and a production system with integrations, evaluation and monitoring takes longer. After a short discovery phase we give you a clear roadmap with milestones before any build starts.',
  },
  {
    q: 'How do you keep our data safe when using AI?',
    a: 'We design for privacy from the start: we only send models the data a task needs, can deploy in your own cloud account, keep access controls on every answer an assistant gives, and use on-device processing where it fits, as we did for receipt scanning in Fairly.',
  },
  {
    q: 'Do you build mobile apps and other software, not just AI?',
    a: 'Yes. We build native and cross-platform Android and iOS apps, web platforms, SaaS products, internal tools and APIs, and we provide cloud, DevOps and tech support. AI is a layer we add wherever it creates real value.',
  },
  {
    q: 'Do you provide support after launch?',
    a: 'Yes. We offer maintenance, monitoring, updates and helpdesk-style tech support, so the software and AI systems we build keep running well long after go-live.',
  },
]

export const SERVICES = [
  {
    key: 'apps',
    page: 'app-development',
    title: 'App Development',
    body: 'Native and cross-platform iOS and Android apps — fast, polished and built to scale from day one.',
    tags: ['iOS', 'Android', 'Flutter', 'React Native'],
    size: 'wide',
  },
  {
    key: 'software',
    page: 'software-development',
    title: 'Software Development',
    body: 'Custom web platforms, SaaS products and internal tools engineered for reliability.',
    tags: ['Web', 'SaaS', 'APIs'],
    size: 'tall',
  },
  {
    key: 'ai',
    page: 'ai-integration',
    title: 'AI Integration',
    body: 'LLM copilots, intelligent automation and predictive models plugged straight into your workflows.',
    tags: ['LLMs', 'Agents', 'ML'],
    size: 'normal',
  },
  {
    key: 'cloud',
    page: 'cloud-devops',
    title: 'Cloud & DevOps',
    body: 'Secure infrastructure, CI/CD and observability so releases ship daily, not quarterly.',
    tags: ['AWS', 'Azure', 'GCP'],
    size: 'normal',
  },
  {
    key: 'design',
    page: 'ui-ux-design',
    title: 'UI / UX Design',
    body: 'Research-led product design that turns complex systems into interfaces people enjoy.',
    tags: ['Research', 'Design systems'],
    size: 'normal',
  },
  {
    key: 'support',
    page: 'tech-support',
    title: 'Tech Support',
    body: 'Ongoing maintenance, monitoring and a team on call — every kind of tech support, handled.',
    tags: ['Maintenance', 'Monitoring', 'Helpdesk'],
    size: 'wide',
  },
]

export const AI_STEPS = [
  {
    k: '01',
    title: 'Understand',
    body: 'We map your data, processes and bottlenecks to find where AI creates real leverage.',
  },
  {
    k: '02',
    title: 'Automate',
    body: 'Repetitive work moves to intelligent pipelines — document processing, routing, reporting.',
  },
  {
    k: '03',
    title: 'Predict',
    body: 'Models that forecast demand, flag risk and surface the next best action.',
  },
  {
    k: '04',
    title: 'Converse',
    body: 'Copilots and chat agents that know your business and speak to your customers 24/7.',
  },
]

export const AI_CONSOLE = [
  { role: 'user', text: 'Summarise this week’s support tickets and flag anything urgent.' },
  { role: 'agent', text: 'Analysed 412 tickets. 3 urgent: payment gateway timeout, login loop on Android 15, invoice export failing.' },
  { role: 'agent', text: 'Drafted fixes for 2 of 3 and opened pull requests. Want me to notify the on-call engineer?' },
]

// Apps Ivies has built (Android, plus LANClip on Windows). `icon` is an optional image path in /public
// (e.g. 'apps/welikethisone.png'); without one a drawn icon is used.
// TODO(Ivies): add Play Store links for Fairly, dashtr and LANClip when they launch (status → 'live').
export const APPS = [
  {
    key: 'welikethisone',
    name: 'welikethisone',
    subtitle: 'Communities',
    category: 'Social',
    status: 'live',
    url: 'https://play.google.com/store/apps/details?id=com.welikethisone.app&hl=en_IN',
    website: 'https://www.welikethisone.com/',
    icon: null,
    tagline: 'Social media run by the people using it. The room votes — and it votes on you.',
    body: 'Post on a board, vote on what you see, and vote on each other. Comic and film theories on Panels, animal rescue on Strays, and moderation built into the product instead of a settings page.',
    features: ['Community voting', 'Themed boards', 'One-tap moderation', 'No cross-app tracking'],
  },
  {
    key: 'fairly',
    name: 'Fairly',
    subtitle: 'Split expenses',
    category: 'Finance',
    status: 'soon',
    url: '',
    website: 'https://www.thefairly.in/',
    icon: 'apps/fairly.png',
    tagline: 'Shared expenses for households and trips. Never capped, never a subscription, never ads.',
    body: 'Split a bill line by line straight from the receipt, track trips in multiple currencies at locked rates, and handle recurring bills. Fairly shows exactly who owes whom, and never moves money itself.',
    features: ['Line-item receipt splitting', 'On-device receipt scanning', 'Multi-currency', 'Recurring bills', 'No ads, no subscription'],
  },
  {
    key: 'dashtr',
    name: 'dashtr',
    subtitle: 'Vehicle logbook',
    category: 'Auto',
    status: 'soon',
    url: '',
    website: 'https://icarus-4.github.io/dashtr-site/',
    websiteLabel: 'dashtr website',
    icon: 'apps/dashtr.png',
    tagline: 'The true cost of every kilometre. Works offline, pay once.',
    body: 'A logbook for people who want the real numbers: fuel economy measured tank to tank, running costs to the last rupee, and reminders before insurance, road tax or the emissions certificate expire. It runs entirely on the phone and imports history from Fuelio, Drivvo and aCar.',
    features: ['Tank-to-tank fuel economy', 'Service & cost tracking', 'Paperwork reminders', 'Works fully offline', 'CSV & JSON export'],
  },
  {
    key: 'lanclip',
    name: 'LANClip',
    subtitle: 'Shared clipboard',
    category: 'Windows + Android',
    status: 'soon',
    url: '',
    website: '',
    icon: null,
    tagline: 'Copy on your PC, paste on your phone. No cloud, no accounts.',
    body: 'A clipboard shared across your devices over local Wi-Fi. Copy text on Windows and it is ready to paste on Android, and the other way round. Devices find each other automatically and only sync when they share the same passphrase, with every clip end-to-end encrypted.',
    features: ['Local Wi-Fi sync', 'End-to-end encrypted', 'No cloud or accounts', 'Auto device discovery', 'Quick Settings tile'],
  },
]

export const PROCESS = [
  { k: 'Seed', title: 'Discover', body: 'Workshops, audits and a clear roadmap with scope, budget and milestones.' },
  { k: 'Sprout', title: 'Design', body: 'Flows, prototypes and a design system validated with real users.' },
  { k: 'Grow', title: 'Build', body: 'Agile sprints, weekly demos, automated tests and transparent progress.' },
  { k: 'Bloom', title: 'Launch & support', body: 'Smooth release, monitoring and continuous improvement long after go-live.' },
]

export const INDUSTRIES = [
  { name: 'FinTech', body: 'Payments, lending, wealth and compliance tooling.' },
  { name: 'Education', body: 'LMS platforms, assessments and learner analytics.' },
  { name: 'Healthcare', body: 'Patient apps, scheduling and secure records.' },
  { name: 'Retail & E-commerce', body: 'Storefronts, inventory and personalisation.' },
  { name: 'Logistics', body: 'Fleet tracking, routing and warehouse systems.' },
  { name: 'Real Estate', body: 'Listings, CRMs and property management.' },
  { name: 'Manufacturing', body: 'IoT dashboards and predictive maintenance.' },
  { name: 'Startups', body: 'MVPs to scale — a full tech team on demand.' },
]
