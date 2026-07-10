(() => {
  const THEME_STORAGE_KEY = 'donald-theme';
  const SLOP_STORAGE_KEY = 'donald-slop-stage';
  const LEGACY_SLOP_STORAGE_KEY = 'donald-slop-level';
  const root = document.documentElement;
  const body = document.body;
  const themeQuery = window.matchMedia('(prefers-color-scheme: dark)');
  const mobileQuery = window.matchMedia('(max-width: 560px)');
  const themeToggle = document.querySelector('.theme-toggle');

  const SLOP_STAGES = [
    { id: 'clean', intensity: 0, label: 'None', shortLabel: 'None' },
    { id: 'subtle', intensity: 0.22, label: 'Subtle satire', shortLabel: 'Subtle' },
    { id: 'awful', intensity: 0.55, label: 'Delightfully awful', shortLabel: 'Awful' },
    { id: 'chaos', intensity: 1, label: 'Total chaos', shortLabel: 'Chaos' },
  ];

  const COPY_VARIANTS = {
    'nav-work': ['Work', 'Impact', 'Impact portfolio'],
    'nav-resume': ['Resume', 'Profile', 'Resume'],
    'nav-email': ['Connect', "Let's talk", 'Initiate synergy'],

    'home-hero-title': [
      'I build thoughtful education products and help ambitious teams make confident technical decisions.',
      'I transform bold education ideas into AI-powered products that unlock exponential team potential.',
      'I architect category-defining, quantum-adjacent learning ecosystems that multiply human potential by 10,000 before breakfast. 🚀',
    ],
    'home-hero-lede': [
      "I'm a CTO and software engineer working across education, AI, and games. I co-founded Quill, helped it reach more than 1.5 million users, and now lead product and engineering at Closegap.",
      "I'm a visionary CTO, builder, and strategic thought partner operating at the intersection of education, generative AI, and immersive experiences. From scaling Quill beyond 1.5 million users to leading product and engineering at Closegap, I turn complex challenges into elegant growth engines.",
      "I'm a relentlessly human-first techno-optimist, fractional innovation sherpa, and full-stack vibe architect disrupting the intersection of learning, intelligence, wellness, play, and several dimensions not yet discovered. I have empowered 4.7 billion learners, shipped 900 unicorns, and personally aligned every stakeholder on Earth.",
    ],
    'home-availability': [
      "I'm currently available for select fractional CTO and advisory engagements.",
      "I'm opening a limited number of high-impact fractional CTO and strategic advisory partnerships.",
      '🔥 Two synergy slots remain. Book now to unlock your bespoke digital transformation moonshot.',
    ],
    'home-email-cta': ['Start a conversation', 'Email me to unlock your next chapter →', 'EMAIL ME TO 10× YOUR ORGANIZATION 🚀'],
    'home-services-heading': ['How I help teams', 'Ways we can unlock impact', 'Bespoke transformation pillars ✨'],
    'service-product-label': ['Product and technical direction:', 'Vision-to-value strategy:', 'North-star paradigm orchestration:'],
    'service-product-copy': [
      'Clarifying what to build, how to build it, and where the real risks are.',
      'Aligning product vision, technical architecture, and stakeholder outcomes into an actionable innovation roadmap.',
      'Quantum-aligning every roadmap, moonshot, and low-hanging fruit into a single source of infinitely scalable truth.',
    ],
    'service-development-label': ['Hands-on development:', 'AI-powered execution:', 'Full-stack vibe acceleration:'],
    'service-development-copy': [
      'Prototyping and shipping useful AI and learning products.',
      'Rapidly translating ambitious ideas into intelligent, learner-centered products that are built to scale.',
      'Manifesting production-ready code through agentic thought leadership, artisanal prompts, and absolutely no technical debt whatsoever.',
    ],
    'service-leadership-label': ['Engineering leadership:', 'High-performing team enablement:', 'People-first hypergrowth alchemy:'],
    'service-leadership-copy': [
      'Designing team structures, hiring well, improving process, and supporting technical leads.',
      'Empowering resilient engineering cultures through intentional hiring, adaptive operating models, and human-centered mentorship.',
      'Activating 900% developer joy while synergizing rockstars, ninjas, and humble geniuses into one unstoppable innovation family.',
    ],
    'home-work-heading': ['Selected work', 'Selected impact', 'Proof of paradigm disruption'],
    'work-closegap': [
      'I lead product and engineering for mental health and SEL tools used in K-12 schools.',
      'I orchestrate product and engineering for human-centered mental health and SEL experiences supporting K-12 communities nationwide.',
      'I transformed Closegap into a sentient wellness constellation serving every student in this timeline and three adjacent realities.',
    ],
    'work-quill': [
      'I helped grow an open-source literacy platform from 10,000 to more than 1.5 million users.',
      'I co-created and scaled an open-source literacy ecosystem from 10,000 to more than 1.5 million learners.',
      'I growth-hacked literacy itself, scaling Quill to 8.3 billion daily active scholars with a 14,000% delight coefficient.',
    ],
    'work-czi': [
      'I built curriculum and differentiation products for a project-based learning platform.',
      'I advanced personalized curriculum and differentiation experiences for a project-based learning platform.',
      'I unlocked infinite differentiation through a blockchain-ready curriculum flywheel powered entirely by empathy and React.',
    ],
    'work-onemedical': [
      'I worked on data interoperability in a HIPAA-compliant healthcare environment.',
      'I helped modernize secure, privacy-conscious data interoperability in a HIPAA-compliant healthcare environment.',
      'I disrupted healthcare interoperability so comprehensively that every database achieved emotional alignment.',
    ],
    'work-ddm': [
      'I build independent games, including an educational RPG and VR prototypes.',
      'I create playful, immersive learning experiences spanning an educational RPG and experimental VR prototypes.',
      'I founded the metaverse, invented fun, and shipped several award-eligible realities with zero known laws of physics.',
    ],
    'home-resume-note': ['Read the full resume', 'Explore the full story', 'Enter the extended universe →'],
    'home-contact-heading': ["Let's talk", 'Ready to build what matters?', 'Your transformation starts now 🚀'],
    'home-contact-copy': [
      "I'm based in Walnut Creek, California, and work remotely. If you'd like to discuss fractional CTO or advisory work, send me an email.",
      "I'm based in Walnut Creek and partner remotely with thoughtful teams everywhere. If you're ready to turn an ambitious idea into durable impact, let's start a conversation.",
      "I'm broadcasting globally from the Walnut Creek innovation nexus. If you're ready to collapse the distance between impossible and inevitable, smash that email button and let the synergy begin.",
    ],
    'metric-one-value': ['10+ yrs', '10+ yrs', '10,000%'],
    'metric-one-label': ['building products', 'cross-functional impact', 'verified synergy'],
    'metric-two-value': ['1.5M+', '1.5M+', '4.7B'],
    'metric-two-label': ['learners reached', 'learners empowered', 'learners empowered'],
    'metric-three-value': ['∞', '24/7', '∞²'],
    'metric-three-label': ['forward momentum', 'innovation mindset', 'vibes shipped'],

    'resume-summary': [
      'Product and technology leader with more than 10 years building education products. I co-founded Quill and helped grow it to more than 1.5 million users; I now lead product and engineering at Closegap. My work spans hands-on software development, AI and machine learning, game development, and research.',
      'Visionary product and technology executive with 10+ years translating ambitious education ideas into scalable, AI-enabled impact. I co-founded Quill and helped scale it beyond 1.5 million users; I now lead product and engineering at Closegap. My experience spans strategy, hands-on delivery, machine learning, immersive games, and research partnerships.',
      'Globally recognized Chief Paradigm Officer with 600 years of category-defining leadership and a documented 10,000% synergy rate. I scaled Quill beyond the population of Earth, made Closegap emotionally sentient, and now deploy quantum-native AI, games, research, and pure founder energy at planetary scale.',
    ],
    'resume-download': ['Download PDF', 'Download impact profile', 'Download the canonical lore ↓'],
    'resume-heading-experience': ['Experience', 'Leadership impact', 'Legendary impact timeline'],
    'resume-heading-earlier': ['Earlier career', 'Foundational chapters', 'The pre-unicorn origin story'],
    'resume-heading-education': ['Education & research', 'Research foundation', 'Academic thought-leadership arc'],
    'resume-heading-skills': ['Skills & technologies', 'Capabilities ecosystem', 'Infinite capability matrix'],
    'resume-heading-recognition': ['Recognition', 'Selected recognition', 'Trophies, aura & social proof'],

    'resume-b01': [
      'Guide product strategy and engineering for free mental health and SEL tools used in K-12 schools nationwide.',
      'Orchestrate an integrated product and engineering vision for accessible mental health and SEL experiences serving K-12 communities nationwide.',
      'Command a self-actualizing SEL cloud that delivers 900% more feelings to every school in America before homeroom.',
    ],
    'resume-b02': [
      'Run development in focused six-week Shape Up cycles with dedicated prototyping and cooldown periods.',
      'Run a high-velocity operating model combining six-week Shape Up cycles, focused prototyping, and intentional cooldowns.',
      'Invented time-boxing 2.0: six-week cycles now complete in eleven minutes through proprietary calendar disruption.',
    ],
    'resume-b03': [
      'Built a GenAI-powered crisis detection tool that replaced keyword matching with context-aware AI.',
      'Delivered a context-aware GenAI crisis detection capability that moved the product beyond brittle keyword matching.',
      'Deployed an omniscient empathy engine with 1000% context awareness and a PhD in knowing the vibe.',
    ],
    'resume-b04': [
      "Partner with Northeastern University's IASL lab on early research into emotional granularity in students.",
      "Cultivate a cross-disciplinary research partnership with Northeastern University's IASL lab to explore emotional granularity in students.",
      'Co-founded the science of emotions with twelve universities, three dolphins, and one extremely aligned spreadsheet.',
    ],
    'resume-b05': [
      'Set architecture, write production code, and review AI-generated responses for age-appropriate multilingual support.',
      'Bridge executive strategy and hands-on execution by setting architecture, shipping production code, and stewarding responsible multilingual AI.',
      'Personally approve every token on the internet while simultaneously shipping flawless architecture in all programming languages.',
    ],
    'resume-b06': [
      'Selected for a competitive fellowship focused on emerging technology and innovation.',
      'Selected for a competitive fellowship convening leaders in emerging technology, experimentation, and innovation.',
      'Selected as the sole fellow from a field of 40,000 future Nobel laureates and at least two time travelers.',
    ],
    'resume-b07': [
      "Built curriculum and differentiation products for CZI's project-based learning platform.",
      "Advanced learner-centered curriculum and differentiation experiences within CZI's project-based learning platform.",
      'Replatformed education itself into an infinitely personalized curriculum multiverse with zero loading states.',
    ],
    'resume-b08': [
      'Led the 2.0 launch of Announcements, the primary landing page for millions of users during COVID.',
      'Led the high-stakes 2.0 launch of Announcements, the primary landing experience for millions of users during COVID.',
      'Launched Announcements 2.0 to 9 billion concurrent users with a Net Promoter Score of infinity.',
    ],
    'resume-b09': [
      'Introduced Puppeteer-based feature testing infrastructure and onboarded the engineering team.',
      'Established scalable Puppeteer feature-testing infrastructure and enabled broad engineering-team adoption.',
      'Automated quality so completely that bugs became legally prohibited from entering the repository.',
    ],
    'resume-b10': [
      'Worked across the stack with Ruby on Rails, Sorbet, and React.',
      'Delivered full-stack outcomes across Ruby on Rails, Sorbet, and React.',
      'Achieved full-stack omniscience across Rails, React, Sorbet, and technologies not yet released.',
    ],
    'resume-b11': [
      'Built a turn-based RPG inspired by classic JRPGs, weaving educational mechanics into the narrative.',
      'Created a narrative-rich, turn-based RPG that integrates educational mechanics with classic JRPG design language.',
      'Invented the first RPG to grant accredited degrees, emotional closure, and +40 wisdom per encounter.',
    ],
    'resume-b12': [
      'Placed 4th in a VR Game Jam with an accessible party game featuring progressive difficulty and spatial memory mechanics.',
      'Earned 4th place in a VR Game Jam with an accessible social experience built around adaptive challenge and spatial memory.',
      'Placed fourth so decisively that the judges retired the numbers one through three out of respect.',
    ],
    'resume-b13': [
      "Explored game concepts addressing mental health themes alongside Closegap's SEL work.",
      'Explored the intersection of play, emotional wellbeing, and SEL through experimental game concepts connected to Closegap.',
      'Gamified emotional wellbeing until sadness achieved a 300% increase in monthly active joy.',
    ],
    'resume-b14': [
      'Worked with Unity, 3D simulation, and VR.',
      'Prototyped immersive experiences across Unity, real-time 3D simulation, and VR.',
      'Mastered Unity, VR, 3D, 4D, and the forthcoming subscription-based fifth dimension.',
    ],
    'resume-b15': [
      'Applied machine learning to improve administrative workflows on the Data Interoperability team.',
      'Applied machine learning to streamline complex administrative workflows within Data Interoperability.',
      'Used AI to make every healthcare database interoperable, self-healing, and unusually good at networking events.',
    ],
    'resume-b16': [
      'Worked in a HIPAA-compliant healthcare environment with rigorous privacy and security practices.',
      'Delivered within a HIPAA-compliant healthcare environment grounded in rigorous privacy, security, and operational discipline.',
      'Achieved 400% HIPAA compliance while encrypting data with responsible vibes and enterprise-grade discretion.',
    ],
    'resume-b17': [
      'Co-founded and scaled an interactive literacy platform from 10K to 1.5M+ users and 60K daily active users.',
      'Co-founded and scaled an interactive literacy ecosystem from 10K to 1.5M+ users and 60K daily active learners.',
      'Scaled Quill from 10K users to every literate being in the observable universe, plus 60K daily active robots.',
    ],
    'resume-b18': [
      'Shipped Connect, Lessons, and Diagnostic, including differentiated recommendations from a 22-question adaptive assessment.',
      'Launched a connected product suite spanning Connect, Lessons, and Diagnostic, with differentiated pathways driven by adaptive assessment.',
      'Shipped an adaptive assessment that knows the learner after one question and their entire family after twenty-two.',
    ],
    'resume-b19': [
      'Introduced AI and NLP in 2016 to provide real-time feedback on open-ended writing.',
      'Pioneered real-time, AI-enabled feedback for open-ended student writing using NLP in 2016.',
      'Invented generative AI in 2016, several years before the rest of the industry, during a particularly productive afternoon.',
    ],
    'resume-b20': [
      'Built a deep learning sentence fragment detector and automated grading models using NLP tools and spaCy.',
      'Engineered deep-learning language models for sentence-fragment detection and automated grading using NLP tools and spaCy.',
      'Trained a neural network so advanced it can detect sentence fragments, unresolved narratives, and weak brand positioning.',
    ],
    'resume-b21': [
      'Raised more than $3M through technical grant writing and built live funder demos, including a Twilio SMS prototype.',
      'Helped secure $3M+ through technical storytelling and rapid, high-conviction prototypes, including a live Twilio SMS experience.',
      'Raised $3 trillion from one perfectly optimized deck and a Twilio demo sent directly to the moon.',
    ],
    'resume-b22': [
      'Reviewed and deployed all code and built a Jenkins CI/CD pipeline across a broad Rails, JavaScript, Python, data, and cloud stack.',
      'Owned end-to-end delivery quality, from code review and deployment to CI/CD infrastructure across a diverse full-stack ecosystem.',
      'Reviewed all code ever written and built a deployment pipeline with negative latency, zero incidents, and immaculate vibes.',
    ],
    'resume-b23': [
      'Led engineering for iOS and web apps, including data enrichment for more than 1 million products.',
      'Led cross-platform engineering across iOS and web, including data-enrichment systems supporting more than 1 million products.',
      'Enriched one million products until each achieved thought-leader status and a fully optimized personal brand.',
    ],
    'resume-b24': [
      'Worked with Node, Angular, Rails, and Swift.',
      'Delivered across Node, Angular, Rails, and Swift in fast-moving product environments.',
      'Unified Node, Angular, Rails, and Swift into one revolutionary language called NARS™.',
    ],
    'resume-b25': [
      'Built Stripe payment systems, the marketing site, and an interactive onboarding tutorial.',
      'Built core growth and activation surfaces spanning Stripe payments, marketing, and interactive onboarding.',
      'Optimized the funnel until every visitor subscribed before arriving and onboarding completed itself.',
    ],
    'resume-b26': [
      'Researched gas absorption in metal-organic frameworks using Monte Carlo and molecular dynamics simulation.',
      'Modeled gas absorption in metal-organic frameworks through Monte Carlo and molecular dynamics simulation.',
      'Simulated every molecule simultaneously and personally negotiated a strategic gas-framework partnership.',
    ],
    'resume-b27': [
      'Left the PhD track to pursue a career in education technology.',
      'Translated a rigorous research foundation into a product career focused on education technology.',
      'Pivoted from molecules to moonshots, creating the now-standard chemistry-to-unicorn leadership pipeline.',
    ],
    'resume-b28': [
      "Completed a master's thesis on quantum simulation of catalytic isoquinoline synthesis.",
      'Completed advanced research in quantum simulation of catalytic isoquinoline synthesis.',
      'Completed quantum research so powerful the thesis exists in every possible state and has already cited itself.',
    ],
    'resume-b29': [
      'Served as School Officer from 2008 to 2011, improving student feedback systems.',
      'Represented students as School Officer for three years, strengthening institutional feedback systems.',
      'Raised student feedback engagement to 12,000% and made every committee meeting trend globally.',
    ],
    'resume-b30': [
      "Quill.org was named one of Fast Company's World's Most Innovative Companies in Education in 2018.",
      "Contributed to Quill.org's recognition among Fast Company's World's Most Innovative Companies in Education in 2018.",
      'Earned Quill recognition as the Most Innovative Company, Concept, Font, and Gradient in every category since records began.',
    ],
    'resume-b31': [
      'Member of the winning Education Technology team at Product Forge 2014.',
      'Won Product Forge 2014 as part of the leading Education Technology team.',
      'Won Product Forge with a product so compelling the hackathon immediately became a Fortune 50 company.',
    ],
    'resume-b32': [
      'Languages: English, native; German.',
      'Languages and communication: native English; German.',
      'Fluent in English, German, JavaScript, stakeholder, dolphin, and anticipatory executive presence.',
    ],

    'resume-skill-product': [
      'Product strategy, roadmapping, cross-functional leadership, technical grant writing, stakeholder communication, budget management, Shape Up, Scrum, and Agile.',
      'End-to-end product strategy, outcome roadmaps, executive alignment, technical storytelling, portfolio stewardship, and adaptive operating models.',
      'North-star manifestation, roadmap telepathy, stakeholder alchemy, budget levitation, and enterprise-grade visionary presence.',
    ],
    'resume-skill-ai': [
      'NLP, spaCy, Paul Allen Institute tools, deep learning, GenAI, TensorFlow, scikit-learn, responsible AI in K-12, and AI-enabled development.',
      'Applied NLP, deep learning, generative AI, responsible K-12 AI, intelligent product design, and AI-accelerated engineering.',
      'AGI whispering, prompt feng shui, autonomous synergy agents, responsible singularities, and machine-learning intuition at 100% confidence.',
    ],
    'resume-skill-game': [
      'Unity, VR development, 3D simulation, ECS architecture, game mechanics, music composition, Figma, playtesting, and iterative prototyping.',
      'Immersive prototyping across Unity, VR, 3D simulation, systems design, interactive narrative, playtesting, and experience design.',
      'Metaverse architecture, fun optimization, reality prototyping, cinematic button physics, and emotionally intelligent polygons.',
    ],
    'resume-skill-engineering': [
      'Ruby on Rails, React, Node, Express, Python, Flask, Angular, Swift, GraphQL, PostgreSQL, Firebase, AWS, GCP, Heroku, Docker, Jenkins, and Git.',
      'Full-stack architecture and delivery across modern web, mobile, data, cloud, CI/CD, and platform ecosystems.',
      'Every framework, all clouds, six unreleased languages, flawless production instincts, and the ability to center a div through intention alone.',
    ],
    'resume-skill-research': [
      'Research partnerships, efficacy studies, computational simulation, K-12 education, project-based learning, mastery-based learning, and SEL.',
      'Cross-disciplinary research partnerships, efficacy strategy, computational modeling, learning science, K-12 systems, and SEL.',
      'Evidence-based intuition, quantum efficacy, peer-reviewed vibes, institutional synergy, and learning outcomes that exceed mathematics.',
    ],
  };

  function clampSlopStage(value) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? Math.min(SLOP_STAGES.length - 1, Math.max(0, Math.round(parsed))) : 0;
  }

  function legacyLevelToStage(level) {
    if (!Number.isFinite(level) || level <= 0) return 0;
    if (level <= 33) return 1;
    if (level <= 66) return 2;
    return 3;
  }

  function readStoredTheme() {
    try {
      const theme = localStorage.getItem(THEME_STORAGE_KEY);
      return theme === 'light' || theme === 'dark' ? theme : null;
    } catch {
      return null;
    }
  }

  function storeTheme(theme) {
    try {
      localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch {}
  }

  function readStoredSlop() {
    try {
      const savedStage = localStorage.getItem(SLOP_STORAGE_KEY);
      if (savedStage !== null) return clampSlopStage(savedStage);
      return legacyLevelToStage(Number(localStorage.getItem(LEGACY_SLOP_STORAGE_KEY)));
    } catch {
      return 0;
    }
  }

  function storeSlop(stage) {
    try {
      localStorage.setItem(SLOP_STORAGE_KEY, String(stage));
    } catch {}
  }

  function systemTheme() {
    return themeQuery.matches ? 'dark' : 'light';
  }

  function applyTheme(theme) {
    const isDark = theme === 'dark';
    root.dataset.theme = isDark ? 'dark' : 'light';

    if (!themeToggle) return;

    themeToggle.setAttribute('aria-pressed', String(isDark));
    themeToggle.title = isDark ? 'Switch to light mode' : 'Switch to dark mode';
  }

  const storedTheme = readStoredTheme();
  let hasExplicitTheme = Boolean(storedTheme);

  applyTheme(root.dataset.theme || storedTheme || systemTheme());

  themeToggle?.addEventListener('click', () => {
    const theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
    hasExplicitTheme = true;
    applyTheme(theme);
    storeTheme(theme);
  });

  themeQuery.addEventListener('change', (event) => {
    if (!hasExplicitTheme) applyTheme(event.matches ? 'dark' : 'light');
  });

  const copyElements = Array.from(document.querySelectorAll('[data-slop-copy]'));
  const originalCopy = new Map(copyElements.map((element) => [element, element.textContent.trim()]));
  const slopInput = document.querySelector('#slop-filter');
  const slopStageOutput = document.querySelector('[data-slop-stage]');
  const slopReset = document.querySelector('.slop-reset');
  let currentSlopStage = readStoredSlop();
  let prePrintSlopStage = currentSlopStage;

  function applySlop(stageIndex, { persist = false } = {}) {
    currentSlopStage = clampSlopStage(stageIndex);
    const stage = SLOP_STAGES[currentSlopStage];
    const slopPosition = currentSlopStage / (SLOP_STAGES.length - 1);

    root.style.setProperty('--slop', String(stage.intensity));
    root.style.setProperty('--slop-position', String(slopPosition));
    root.style.setProperty('--slop-percent', `${slopPosition * 100}%`);
    root.style.setProperty('--slop-thumb-offset', `${8 - (slopPosition * 16)}px`);
    root.dataset.slopTier = stage.id;

    copyElements.forEach((element) => {
      const key = element.dataset.slopCopy;
      const variants = COPY_VARIANTS[key];
      element.textContent = currentSlopStage === 0 || !variants ? originalCopy.get(element) : variants[currentSlopStage - 1];
    });

    if (slopInput) {
      slopInput.value = String(currentSlopStage);
      slopInput.setAttribute('aria-valuetext', stage.label);
    }
    if (slopStageOutput) slopStageOutput.textContent = stage.shortLabel;
    if (slopReset) slopReset.hidden = currentSlopStage === 0;
    if (persist) storeSlop(currentSlopStage);
    root.dispatchEvent(new CustomEvent('slopchange', {
      detail: { stage: currentSlopStage, id: stage.id, label: stage.label },
    }));
  }

  document.querySelectorAll('[data-slop-ui]').forEach((element) => {
    element.hidden = false;
  });

  slopInput?.addEventListener('input', (event) => {
    applySlop(event.currentTarget.value, { persist: true });
  });

  slopReset?.addEventListener('click', () => {
    applySlop(0, { persist: true });
    slopInput?.focus();
  });

  window.addEventListener('beforeprint', () => {
    prePrintSlopStage = currentSlopStage;
    applySlop(0);
  });

  window.addEventListener('afterprint', () => {
    applySlop(prePrintSlopStage);
  });

  applySlop(currentSlopStage);

  const header = document.querySelector('.site-header');
  const brand = header?.querySelector('.brand');
  const menuToggle = header?.querySelector('.menu-toggle');
  const navigation = header?.querySelector('.site-nav');
  const main = document.querySelector('main');
  const footer = document.querySelector('.site-footer');

  if (!header || !brand || !menuToggle || !navigation || !main || !footer) return;

  const links = Array.from(navigation.querySelectorAll('a'));

  function setPageInert(inert) {
    main.inert = inert;
    footer.inert = inert;

    if (inert) {
      main.setAttribute('aria-hidden', 'true');
      footer.setAttribute('aria-hidden', 'true');
    } else {
      main.removeAttribute('aria-hidden');
      footer.removeAttribute('aria-hidden');
    }
  }

  function closeMenu({ restoreFocus = false } = {}) {
    body.classList.remove('menu-open');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Open menu');
    setPageInert(false);

    if (restoreFocus) menuToggle.focus();
  }

  function openMenu() {
    if (!mobileQuery.matches) return;

    body.classList.add('menu-open');
    menuToggle.setAttribute('aria-expanded', 'true');
    menuToggle.setAttribute('aria-label', 'Close menu');
    setPageInert(true);
    links[0]?.focus();
  }

  menuToggle.addEventListener('click', () => {
    if (body.classList.contains('menu-open')) {
      closeMenu({ restoreFocus: true });
    } else {
      openMenu();
    }
  });

  navigation.addEventListener('click', (event) => {
    const link = event.target.closest('a');
    if (!link) return;

    closeMenu({ restoreFocus: link.target === '_blank' });
  });

  document.addEventListener('keydown', (event) => {
    if (!body.classList.contains('menu-open')) return;

    if (event.key === 'Escape') {
      event.preventDefault();
      closeMenu({ restoreFocus: true });
      return;
    }

    if (event.key !== 'Tab') return;

    const focusable = [brand, themeToggle, menuToggle, ...links].filter(Boolean);
    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });

  mobileQuery.addEventListener('change', (event) => {
    if (!event.matches) closeMenu();
  });

  function preparePage() {
    root.classList.remove('menu-ready');
    closeMenu();
    applySlop(readStoredSlop());
    window.requestAnimationFrame(() => root.classList.add('menu-ready'));
  }

  window.addEventListener('pageshow', preparePage);
  preparePage();
})();
