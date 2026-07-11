(() => {
  const svg = document.querySelector('[data-knowledge-map]');
  const workspace = document.querySelector('.map-workspace');
  const cameraElement = document.querySelector('[data-map-camera]');
  const edgesElement = document.querySelector('[data-map-edges]');
  const extraEdgesElement = document.querySelector('[data-map-extra-edges]');
  const labelsElement = document.querySelector('[data-map-edge-labels]');
  const nodesElement = document.querySelector('[data-map-nodes]');
  const inspector = document.querySelector('[data-map-inspector]');
  const picker = document.querySelector('#map-topic-picker');
  const status = document.querySelector('[data-map-status]');
  const fictionLabel = document.querySelector('[data-map-fiction]');
  const detailType = document.querySelector('[data-map-detail-type]');
  const detailTitle = document.querySelector('[data-map-detail-title]');
  const detailCopy = document.querySelector('[data-map-detail-copy]');
  const detailLink = document.querySelector('[data-map-detail-link]');
  const fictionNote = document.querySelector('[data-map-fiction-note]');
  const relatedElement = document.querySelector('[data-map-related]');
  const closeButton = document.querySelector('[data-map-close]');
  const zoomInButton = document.querySelector('[data-map-zoom-in]');
  const zoomOutButton = document.querySelector('[data-map-zoom-out]');
  const fitButton = document.querySelector('[data-map-fit]');

  if (
    !svg || !workspace || !cameraElement || !edgesElement || !extraEdgesElement || !labelsElement ||
    !nodesElement || !inspector || !picker || !status || !fictionLabel || !detailType || !detailTitle ||
    !detailCopy || !detailLink || !fictionNote || !relatedElement || !closeButton || !zoomInButton ||
    !zoomOutButton || !fitButton
  ) return;

  const NS = 'http://www.w3.org/2000/svg';
  const VIEW_WIDTH = 1600;
  const VIEW_HEIGHT = 1080;
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  const NODES = [
    {
      id: 'donald', label: 'Donald McKendrick', x: 800, y: 520, type: 'core', group: 'center',
      detail: 'CTO, software engineer, product builder, and the only person this diagram has been authorized to over-analyze.',
      link: 'resume.html', linkLabel: 'Read the résumé',
    },
    {
      id: 'education', label: 'Education products', x: 520, y: 360, type: 'branch', group: 'work',
      detail: 'More than a decade building learning products, from literacy practice to mental-health and social-emotional support.',
    },
    {
      id: 'quill', label: 'Quill.org', x: 285, y: 410, type: 'role', group: 'work',
      detail: 'Cofounder and Technical Director from 2016 to 2019. Donald helped grow Quill from 10,000 to more than 1.5 million users.',
      link: 'https://www.quill.org', linkLabel: 'Visit Quill.org', external: true,
    },
    {
      id: 'closegap', label: 'Closegap', x: 300, y: 230, type: 'role', group: 'work',
      detail: 'Chief Technology Officer since November 2024, leading product strategy and engineering for K–12 mental-health and SEL tools.',
      link: 'https://www.closegap.org', linkLabel: 'Visit Closegap', external: true,
    },
    {
      id: 'literacy', label: 'Literacy feedback', x: 90, y: 510, type: 'evidence', group: 'work',
      detail: 'At Quill, Donald shipped writing tools including Connect, Lessons, and Diagnostic, with automated feedback for open-ended writing.',
    },
    {
      id: 'mental-health', label: 'Student mental health', x: 105, y: 160, type: 'evidence', group: 'work',
      detail: 'At Closegap, Donald builds free tools that help K–12 students identify and get support for emotional needs.',
    },
    {
      id: 'czi', label: 'Chan Zuckerberg Initiative', x: 485, y: 125, type: 'role', group: 'work',
      detail: 'Senior Software Engineer from 2020 to 2022, working on curriculum and differentiation for a project-based learning platform.',
    },
    {
      id: 'project-learning', label: 'Project-based learning', x: 285, y: 55, type: 'evidence', group: 'work',
      detail: 'Donald worked on curriculum, differentiation, and the 2.0 launch of Announcements, a primary landing page during COVID.',
    },
    {
      id: 'leadership', label: 'Engineering leadership', x: 785, y: 245, type: 'branch', group: 'leadership',
      detail: 'Product strategy, technical direction, hiring, team structure, process design, and support for technical leads.',
    },
    {
      id: 'fractional', label: 'Fractional CTO work', x: 770, y: 65, type: 'evidence', group: 'leadership',
      detail: 'Donald is available for select fractional CTO and advisory engagements with small teams.',
      link: 'mailto:ddmckendrick@gmail.com', linkLabel: 'Start a conversation',
    },
    {
      id: 'shape-up', label: 'Shape Up', x: 970, y: 135, type: 'evidence', group: 'leadership',
      detail: 'At Closegap, Donald runs development in six-week Shape Up cycles with prototyping weeks and cooldowns.',
    },
    {
      id: 'ai', label: 'AI & machine learning', x: 1060, y: 355, type: 'branch', group: 'ai',
      detail: 'Donald has worked with NLP, deep learning, generative AI, TensorFlow, scikit-learn, and responsible AI in K–12.',
    },
    {
      id: 'nlp', label: 'NLP since 2016', x: 1300, y: 270, type: 'evidence', group: 'ai',
      detail: 'At Quill, Donald introduced AI and NLP for writing feedback and built a deep-learning sentence-fragment detector.',
    },
    {
      id: 'generative-ai', label: 'Context-aware AI', x: 1345, y: 420, type: 'evidence', group: 'ai',
      detail: 'At Closegap, Donald built a generative-AI crisis detection tool that replaced keyword matching with context-aware analysis.',
    },
    {
      id: 'one-medical', label: 'One Medical', x: 1125, y: 165, type: 'role', group: 'ai',
      detail: 'Software Engineer on the Data Interoperability team from 2019 to 2020, including machine-learning work in a healthcare environment.',
    },
    {
      id: 'privacy', label: 'Privacy-sensitive systems', x: 1365, y: 90, type: 'evidence', group: 'ai',
      detail: 'Donald has worked in a HIPAA-compliant environment with rigorous privacy and security requirements.',
    },
    {
      id: 'games', label: 'Games & interactive work', x: 1120, y: 660, type: 'branch', group: 'games',
      detail: 'Independent game development spanning an educational RPG, VR prototypes, spatial-memory play, and music composition.',
    },
    {
      id: 'ddm', label: 'Derivative Daydream Machine', x: 1370, y: 590, type: 'role', group: 'games',
      detail: 'Donald’s independent game-development studio, active from 2022 to 2024.',
    },
    {
      id: 'unity-vr', label: 'Unity & VR', x: 1430, y: 750, type: 'evidence', group: 'games',
      detail: 'Donald placed fourth in a VR game jam with an accessible spatial-memory party game and has built 3D simulation prototypes.',
    },
    {
      id: 'final-fantasy', label: 'Final Fantasy VI', x: 1230, y: 885, type: 'oddity', group: 'games',
      detail: 'Donald’s favorite entry in the series, for its wide cast and its dramatic return to a changed world.',
    },
    {
      id: 'research', label: 'Research', x: 825, y: 815, type: 'branch', group: 'research',
      detail: 'Before product engineering, Donald worked in computational chemistry and now collaborates on research in education and emotional granularity.',
    },
    {
      id: 'amsterdam', label: 'University of Amsterdam', x: 720, y: 1010, type: 'role', group: 'research',
      detail: 'Assistant Researcher from 2011 to 2013 on a computational chemistry PhD track.',
    },
    {
      id: 'chemistry', label: 'Molecular simulation', x: 970, y: 1015, type: 'evidence', group: 'research',
      detail: 'Donald researched gas absorption in metal-organic frameworks using Monte Carlo and molecular dynamics simulation.',
    },
    {
      id: 'heriot-watt', label: 'Heriot-Watt University', x: 520, y: 920, type: 'role', group: 'research',
      detail: 'Donald earned a Master of Chemistry. His thesis used quantum simulation to study catalytic synthesis of isoquinoline.',
    },
    {
      id: 'scotland-germany', label: 'Scotland & Germany', x: 285, y: 745, type: 'oddity', group: 'personal',
      detail: 'Donald grew up in Scotland and Germany. Edinburgh is probably his favorite city.',
    },
    {
      id: 'music', label: 'Music', x: 455, y: 730, type: 'oddity', group: 'personal',
      detail: 'Donald likes making orchestral game scores and dark synth music. It often turns out sad.',
    },
    {
      id: 'health-band', label: 'HEALTH', x: 255, y: 900, type: 'oddity', group: 'personal',
      detail: 'Donald’s favorite band: moody, cathartic, and good for focusing.',
    },
    {
      id: 'uematsu', label: 'Nobuo Uematsu', x: 365, y: 1030, type: 'oddity', group: 'personal',
      detail: 'Donald’s favorite composer, and an enduring influence on how he thinks about music for games.',
    },
    {
      id: 'food', label: 'Chicken parm & builder’s tea', x: 610, y: 670, type: 'oddity', group: 'personal',
      detail: 'Favorite food: chicken parm. Usual drink: builder’s tea with milk and two sugars, or as much sugar as will dissolve.',
    },
    {
      id: 'binturongs', label: 'Binturongs', x: 490, y: 555, type: 'oddity', group: 'personal',
      detail: 'Donald finds binturongs funny and endearingly indifferent, and is fascinated that they smell like popcorn.',
    },
    {
      id: 'pesto', label: 'Pesto', x: 610, y: 815, type: 'oddity', group: 'personal',
      detail: 'Avoided after a college roommate left enough pesto-smeared dishes to turn a condiment into a long-term adversary.',
    },
    {
      id: 'synergy', label: 'Interdimensional synergy', x: 1500, y: 505, type: 'fictional', group: 'fictional', minStage: 2,
      detail: 'A fictional operating layer that allegedly aligns every stakeholder in this diagram before breakfast.', fictional: true,
    },
    {
      id: 'quantum-tutor', label: 'Quantum tutor network', x: 90, y: 690, type: 'fictional', group: 'fictional', minStage: 2,
      detail: 'A fictional tutoring system that only explains the lesson in universes where the learner already understands it.', fictional: true,
    },
    {
      id: 'pesto-chain', label: 'Pesto blockchain', x: 625, y: 55, type: 'fictional', group: 'fictional', minStage: 3,
      detail: 'A fictional distributed ledger designed to ensure every pesto-covered dish can be traced back to the responsible roommate.', fictional: true,
    },
  ];

  const EDGES = [
    ['donald', 'education', ['builds', 'keeps returning to', 'scales impact through', 'disrupts the vertical of']],
    ['education', 'quill', ['co-founded', 'helped grow', 'architected learner outcomes at', 'manifested 1.5M users at']],
    ['education', 'closegap', ['now leads', 'now steers', 'operationalizes care at', 'synergizes feelings through']],
    ['quill', 'literacy', ['gave feedback on', 'patiently corrected', 'AI-enabled', '10,000× transformed']],
    ['closegap', 'mental-health', ['supports', 'builds for', 'unlocks', 'quantum-accelerates']],
    ['education', 'czi', ['also passed through', 'shipped at', 'activated at', 'cross-pollinated at']],
    ['czi', 'project-learning', ['worked on', 'made infrastructure for', 'enabled outcomes in', 'reimagined the paradigm of']],
    ['donald', 'leadership', ['provides', 'practices', 'operationalizes', 'thought-leads about']],
    ['leadership', 'fractional', ['available for', 'selectively offers', 'unlocks', 'moonshots through']],
    ['leadership', 'shape-up', ['uses', 'runs cycles with', 'leverages', 'vibe-cycles via']],
    ['donald', 'ai', ['builds with', 'has used since before the hype', 'strategically deploys', 'summons']],
    ['ai', 'nlp', ['includes', 'started with', 'pioneered learner intelligence via', 'was doing before your deck said AI']],
    ['ai', 'generative-ai', ['now includes', 'applies cautiously to', 'unlocks context through', 'transcends keywords with']],
    ['ai', 'one-medical', ['was applied at', 'met healthcare at', 'cross-functionally activated at', 'healed data gravity at']],
    ['one-medical', 'privacy', ['required', 'took seriously', 'operationalized trust through', 'quantum-sealed']],
    ['donald', 'games', ['also makes', 'keeps making', 'explores new modalities through', 'gamifies the metaverse through']],
    ['games', 'ddm', ['founded', 'built under', 'incubated through', 'dream-machined via']],
    ['games', 'unity-vr', ['uses', 'experiments with', 'builds immersive value in', 'spatially synergizes']],
    ['games', 'final-fantasy', ['favorite:', 'has strong opinions about', 'derives narrative leadership from', 'benchmarks civilization against']],
    ['donald', 'research', ['began in', 'still collaborates on', 'maintains epistemic leverage through', 'peer-reviews reality via']],
    ['research', 'amsterdam', ['included', 'once lived at', 'generated findings at', 'molecularly disrupted']],
    ['research', 'chemistry', ['simulated', 'involved', 'modeled innovation through', 'quantum-vibed']],
    ['research', 'heriot-watt', ['studied at', 'earned a chemistry degree at', 'built foundational rigor at', 'mastered matter at']],
    ['donald', 'scotland-germany', ['grew up in', 'was geographically compiled in', 'developed cross-border perspective in', 'globally localized across']],
    ['donald', 'music', ['makes', 'spends free afternoons on', 'composes focus assets in', 'sonically transforms']],
    ['music', 'health-band', ['soundtracked by', 'focuses with', 'leverages catharsis from', 'emotionally benchmarks against']],
    ['music', 'uematsu', ['influenced by', 'takes game-music notes from', 'draws melodic strategy from', 'orchestrates stakeholder feelings via']],
    ['donald', 'food', ['runs on', 'is provisioned by', 'maintains founder energy with', 'biohacks through']],
    ['donald', 'binturongs', ['strongly endorses', 'finds correctly funny', 'identifies untapped charisma in', 'smells disruption around']],
    ['donald', 'pesto', ['avoids', 'has evidence against', 'maintains a zero-trust policy for', 'decentralizes away from']],
    ['music', 'final-fantasy', ['meets in', 'converges on', 'creates a transmedia flywheel around', 'achieves melodic singularity in']],
    ['education', 'quantum-tutor', ['fictionally enables', 'fictionally pilots', 'fictionally scales', 'fictionally hyper-scales'], 2],
    ['ai', 'synergy', ['fictionally powers', 'fictionally aligns', 'fictionally unlocks', 'fictionally transcends'], 2],
    ['pesto', 'pesto-chain', ['fictionally audits', 'fictionally tokenizes', 'fictionally decentralizes', 'fictionally puts on-chain'], 3],
    ['leadership', 'synergy', ['fictionally aligns', 'fictionally activates', 'fictionally multiplies', 'fictionally achieves escape velocity through'], 3],
    ['quantum-tutor', 'pesto-chain', ['has no defensible link to', 'should not connect to', 'cross-synergizes for no reason with', 'inevitably converges with'], 3],
  ].map(([from, to, labels, minStage = 0]) => ({ from, to, labels, minStage }));

  const nodeById = new Map(NODES.map((node) => [node.id, node]));
  let stage = ['clean', 'subtle', 'awful', 'chaos'].indexOf(document.documentElement.dataset.slopTier);
  if (stage < 0) stage = 0;
  let selectedId = null;
  let camera = { x: 0, y: 0, scale: 1 };
  let drag = null;
  let dragged = false;

  function svgElement(name, attributes = {}) {
    const element = document.createElementNS(NS, name);
    Object.entries(attributes).forEach(([key, value]) => element.setAttribute(key, String(value)));
    return element;
  }

  function isVisible(node) {
    return (node.minStage || 0) <= stage;
  }

  function visibleNodes() {
    return NODES.filter(isVisible);
  }

  function displayType(node) {
    return {
      core: 'Primary subject', branch: 'Working theme', role: 'Experience', evidence: 'Evidence',
      oddity: 'Relevant somehow', fictional: 'Fictional slop node',
    }[node.type] || 'Topic';
  }

  function splitLabel(label) {
    if (label.length <= 19) return [label];
    const words = label.split(' ');
    let first = '';
    let second = '';
    words.forEach((word) => {
      if (!second && `${first} ${word}`.trim().length <= Math.ceil(label.length / 2) + 3) {
        first = `${first} ${word}`.trim();
      } else {
        second = `${second} ${word}`.trim();
      }
    });
    return second ? [first, second] : [first];
  }

  function nodeSize(node) {
    const lines = splitLabel(node.label);
    const longest = Math.max(...lines.map((line) => line.length));
    const base = node.type === 'core' ? 218 : node.type === 'branch' ? 190 : 154;
    return {
      width: Math.max(base, Math.min(238, 48 + longest * 10.5)),
      height: lines.length > 1 ? 66 : node.type === 'core' ? 66 : 54,
      lines,
    };
  }

  function curvedPath(from, to, index) {
    const dx = to.x - from.x;
    const dy = to.y - from.y;
    const length = Math.hypot(dx, dy) || 1;
    const bend = ((index % 3) - 1) * Math.min(38, length * 0.1);
    const mx = (from.x + to.x) / 2 - (dy / length) * bend;
    const my = (from.y + to.y) / 2 + (dx / length) * bend;
    return { d: `M ${from.x} ${from.y} Q ${mx} ${my} ${to.x} ${to.y}`, mx, my };
  }

  function render() {
    edgesElement.replaceChildren();
    extraEdgesElement.replaceChildren();
    labelsElement.replaceChildren();
    nodesElement.replaceChildren();
    workspace.dataset.mapStage = String(stage);

    const visible = visibleNodes();
    const visibleIds = new Set(visible.map((node) => node.id));
    const visibleEdges = EDGES.filter((edge) => edge.minStage <= stage && visibleIds.has(edge.from) && visibleIds.has(edge.to));

    visibleEdges.forEach((edge, index) => {
      const from = nodeById.get(edge.from);
      const to = nodeById.get(edge.to);
      const geometry = curvedPath(from, to, index);
      const path = svgElement('path', {
        d: geometry.d,
        class: `map-edge${edge.minStage ? ' map-edge-fictional' : ''}`,
        'data-from': edge.from,
        'data-to': edge.to,
        'vector-effect': 'non-scaling-stroke',
      });
      (edge.minStage ? extraEdgesElement : edgesElement).append(path);

      const label = svgElement('text', {
        x: geometry.mx,
        y: geometry.my - 7,
        class: `map-edge-label${edge.from === 'donald' ? ' map-edge-label-primary' : ''}${edge.minStage ? ' map-edge-label-fictional' : ''}`,
        'data-from': edge.from,
        'data-to': edge.to,
        'text-anchor': 'middle',
      });
      label.textContent = edge.labels[Math.min(stage, edge.labels.length - 1)];
      labelsElement.append(label);
    });

    visible.forEach((node, index) => {
      const size = nodeSize(node);
      const outer = svgElement('g', {
        class: `map-node map-node-${node.type}`,
        transform: `translate(${node.x} ${node.y})`,
        tabindex: '0',
        role: 'button',
        'aria-label': `${node.label}. ${displayType(node)}. Select for details.`,
        'data-node-id': node.id,
        style: `--node-index:${index};--chaos-x:${((index * 17) % 27) - 13}px;--chaos-y:${((index * 29) % 23) - 11}px`,
      });
      const motion = svgElement('g', { class: 'map-node-motion' });
      const rect = svgElement('rect', {
        x: -size.width / 2,
        y: -size.height / 2,
        width: size.width,
        height: size.height,
        rx: node.type === 'core' ? 33 : 5,
      });
      const text = svgElement('text', { 'text-anchor': 'middle', 'aria-hidden': 'true' });
      size.lines.forEach((line, lineIndex) => {
        const tspan = svgElement('tspan', {
          x: 0,
          dy: lineIndex === 0 ? (size.lines.length > 1 ? '-0.16em' : '0.34em') : '1.18em',
        });
        tspan.textContent = line;
        text.append(tspan);
      });
      motion.append(rect, text);
      outer.append(motion);
      outer.addEventListener('click', (event) => {
        event.stopPropagation();
        if (!dragged) selectNode(node.id);
      });
      outer.addEventListener('keydown', (event) => {
        if (event.key !== 'Enter' && event.key !== ' ') return;
        event.preventDefault();
        selectNode(node.id);
      });
      nodesElement.append(outer);
    });

    populatePicker(visible);
    if (selectedId && visibleIds.has(selectedId)) {
      updateSelection();
      showDetail(nodeById.get(selectedId));
    } else if (selectedId) {
      clearSelection();
    }

    const messages = [
      '31 documented topics',
      '31 facts, lightly overinterpreted',
      `${visible.length} nodes · fictional claims marked`,
      `${visible.length} nodes · methodology abandoned`,
    ];
    status.textContent = messages[stage];
    fictionLabel.hidden = stage < 2;
  }

  function populatePicker(nodes) {
    const current = selectedId || '';
    const placeholder = document.createElement('option');
    placeholder.value = '';
    placeholder.textContent = 'Choose a node…';
    picker.replaceChildren(placeholder);

    const groups = new Map();
    nodes.forEach((node) => {
      const label = node.fictional ? 'Fictional slop' : node.type === 'oddity' ? 'Personal rabbit holes' : 'Work and evidence';
      if (!groups.has(label)) groups.set(label, []);
      groups.get(label).push(node);
    });
    groups.forEach((groupNodes, label) => {
      const optgroup = document.createElement('optgroup');
      optgroup.label = label;
      groupNodes.forEach((node) => {
        const option = document.createElement('option');
        option.value = node.id;
        option.textContent = node.label;
        optgroup.append(option);
      });
      picker.append(optgroup);
    });
    picker.value = current;
  }

  function selectNode(id, { focus = false } = {}) {
    const node = nodeById.get(id);
    if (!node || !isVisible(node)) return;
    selectedId = id;
    updateSelection();
    showDetail(node);
    picker.value = id;
    if (focus) nodesElement.querySelector(`[data-node-id="${id}"]`)?.focus();
  }

  function updateSelection() {
    const connectedIds = new Set([selectedId]);
    EDGES.forEach((edge) => {
      if (edge.minStage > stage) return;
      if (edge.from === selectedId) connectedIds.add(edge.to);
      if (edge.to === selectedId) connectedIds.add(edge.from);
    });
    workspace.classList.add('has-selection');
    nodesElement.querySelectorAll('.map-node').forEach((element) => {
      const id = element.dataset.nodeId;
      element.classList.toggle('is-selected', id === selectedId);
      element.classList.toggle('is-related', id !== selectedId && connectedIds.has(id));
      element.classList.toggle('is-dimmed', !connectedIds.has(id));
    });
    [...edgesElement.children, ...extraEdgesElement.children, ...labelsElement.children].forEach((element) => {
      const connected = element.dataset.from === selectedId || element.dataset.to === selectedId;
      element.classList.toggle('is-selected', connected);
      element.classList.toggle('is-dimmed', !connected);
    });
  }

  function showDetail(node) {
    inspector.hidden = false;
    workspace.classList.add('detail-open');
    detailType.textContent = displayType(node);
    detailTitle.textContent = node.label;
    detailCopy.textContent = node.detail;
    fictionNote.hidden = !node.fictional;

    relatedElement.replaceChildren();
    const relatedIds = [];
    EDGES.forEach((edge) => {
      if (edge.minStage > stage) return;
      if (edge.from === node.id) relatedIds.push(edge.to);
      if (edge.to === node.id) relatedIds.push(edge.from);
    });
    const visibleRelated = [...new Set(relatedIds)].map((id) => nodeById.get(id)).filter((related) => related && isVisible(related));
    if (visibleRelated.length) {
      const label = document.createElement('p');
      label.textContent = 'Connected to';
      const links = document.createElement('div');
      visibleRelated.forEach((related) => {
        const button = document.createElement('button');
        button.type = 'button';
        button.textContent = related.label;
        button.addEventListener('click', () => selectNode(related.id));
        links.append(button);
      });
      relatedElement.append(label, links);
    }

    if (node.link) {
      detailLink.hidden = false;
      detailLink.href = node.link;
      detailLink.firstChild.textContent = `${node.linkLabel || 'Follow the evidence'} `;
      if (node.external) {
        detailLink.target = '_blank';
        detailLink.rel = 'noopener noreferrer';
      } else {
        detailLink.removeAttribute('target');
        detailLink.removeAttribute('rel');
      }
    } else {
      detailLink.hidden = true;
      detailLink.removeAttribute('href');
    }
  }

  function clearSelection() {
    selectedId = null;
    inspector.hidden = true;
    workspace.classList.remove('has-selection', 'detail-open');
    picker.value = '';
    nodesElement.querySelectorAll('.map-node').forEach((element) => {
      element.classList.remove('is-selected', 'is-related', 'is-dimmed');
    });
    [...edgesElement.children, ...extraEdgesElement.children, ...labelsElement.children].forEach((element) => {
      element.classList.remove('is-selected', 'is-dimmed');
    });
  }

  function updateCamera() {
    cameraElement.setAttribute('transform', `translate(${camera.x} ${camera.y}) scale(${camera.scale})`);
  }

  function zoomAt(nextScale, point = { x: VIEW_WIDTH / 2, y: VIEW_HEIGHT / 2 }) {
    const clamped = Math.max(0.62, Math.min(3.2, nextScale));
    const contentX = (point.x - camera.x) / camera.scale;
    const contentY = (point.y - camera.y) / camera.scale;
    camera.x = point.x - contentX * clamped;
    camera.y = point.y - contentY * clamped;
    camera.scale = clamped;
    updateCamera();
  }

  function fitMap({ initial = false } = {}) {
    const narrow = window.matchMedia('(max-width: 680px)').matches;
    const scale = initial && narrow ? 2.05 : 1;
    camera = {
      scale,
      x: (VIEW_WIDTH / 2) * (1 - scale),
      y: (VIEW_HEIGHT / 2) * (1 - scale),
    };
    updateCamera();
  }

  function clientToView(event) {
    const bounds = svg.getBoundingClientRect();
    return {
      x: ((event.clientX - bounds.left) / bounds.width) * VIEW_WIDTH,
      y: ((event.clientY - bounds.top) / bounds.height) * VIEW_HEIGHT,
    };
  }

  svg.addEventListener('pointerdown', (event) => {
    if (event.target.closest?.('.map-node')) return;
    const point = clientToView(event);
    drag = { pointerId: event.pointerId, x: point.x, y: point.y };
    dragged = false;
    svg.setPointerCapture(event.pointerId);
    svg.classList.add('is-dragging');
  });

  svg.addEventListener('pointermove', (event) => {
    if (!drag || drag.pointerId !== event.pointerId) return;
    const point = clientToView(event);
    const dx = point.x - drag.x;
    const dy = point.y - drag.y;
    if (Math.abs(dx) + Math.abs(dy) > 2) dragged = true;
    camera.x += dx;
    camera.y += dy;
    drag.x = point.x;
    drag.y = point.y;
    updateCamera();
  });

  function endDrag(event) {
    if (!drag || drag.pointerId !== event.pointerId) return;
    drag = null;
    svg.classList.remove('is-dragging');
  }

  svg.addEventListener('pointerup', endDrag);
  svg.addEventListener('pointercancel', endDrag);
  svg.addEventListener('click', (event) => {
    if (!dragged && !event.target.closest?.('.map-node')) clearSelection();
    dragged = false;
  });
  svg.addEventListener('wheel', (event) => {
    event.preventDefault();
    const point = clientToView(event);
    zoomAt(camera.scale * (event.deltaY > 0 ? 0.9 : 1.1), point);
  }, { passive: false });

  picker.addEventListener('change', () => {
    if (picker.value) selectNode(picker.value, { focus: true });
  });
  closeButton.addEventListener('click', clearSelection);
  zoomInButton.addEventListener('click', () => zoomAt(camera.scale * 1.2));
  zoomOutButton.addEventListener('click', () => zoomAt(camera.scale / 1.2));
  fitButton.addEventListener('click', () => fitMap());

  document.documentElement.addEventListener('slopchange', (event) => {
    stage = event.detail.stage;
    render();
  });

  window.addEventListener('resize', () => {
    if (!selectedId) fitMap({ initial: true });
  });

  render();
  fitMap({ initial: true });
  window.requestAnimationFrame(() => workspace.classList.add('map-ready'));
})();
