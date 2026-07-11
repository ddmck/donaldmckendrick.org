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
    !nodesElement || !inspector || !picker || !status || !detailType || !detailTitle ||
    !detailCopy || !detailLink || !fictionNote || !relatedElement || !closeButton || !zoomInButton ||
    !zoomOutButton || !fitButton
  ) return;

  const NS = 'http://www.w3.org/2000/svg';
  const VIEW_WIDTH = 1600;
  const VIEW_HEIGHT = 1080;
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  const NODES = [
    { id: 'donald', label: 'Donald McKendrick', x: 800, y: 540, type: 'core', group: 'center', detail: 'CTO, software engineer, and product builder working across education, AI, research, and games.', link: 'resume.html', linkLabel: 'Read the résumé' },

    { id: 'products', parent: 'donald', label: 'Products & organizations', x: 440, y: 480, type: 'branch', group: 'products', detail: 'The organizations where Donald has built education, healthcare, and student-support products.' },
    { id: 'closegap', parent: 'products', label: 'Closegap', x: 235, y: 270, type: 'role', group: 'products', detail: 'Chief Technology Officer since November 2024, leading product strategy and engineering for K–12 mental-health and SEL tools.', link: 'https://www.closegap.org', linkLabel: 'Visit Closegap', external: true },
    { id: 'student-support', parent: 'closegap', label: 'K–12 mental health & SEL', x: 55, y: 165, type: 'evidence', group: 'products', detail: 'Free tools that help K–12 students identify and get support for emotional needs.' },
    { id: 'context-detection', parent: 'closegap', label: 'Context-aware detection', x: 55, y: 330, type: 'evidence', group: 'products', detail: 'A generative-AI crisis detection tool that replaced keyword matching with context-aware analysis.' },
    { id: 'quill', parent: 'products', label: 'Quill.org', x: 180, y: 440, type: 'role', group: 'products', detail: 'Cofounder and Technical Director from 2016 to 2019, building free literacy products and automated writing feedback.', link: 'https://www.quill.org', linkLabel: 'Visit Quill.org', external: true },
    { id: 'quill-growth', parent: 'quill', label: '10,000 → 1.5M+ learners', x: 20, y: 475, type: 'evidence', group: 'products', detail: 'Donald helped grow Quill from roughly 10,000 users to more than 1.5 million.' },
    { id: 'writing-feedback', parent: 'quill', label: 'NLP writing feedback', x: 95, y: 575, type: 'evidence', group: 'products', detail: 'Connect, Lessons, and Diagnostic used automated feedback for open-ended writing, including a deep-learning sentence-fragment detector.' },
    { id: 'czi', parent: 'products', label: 'Chan Zuckerberg Initiative', x: 220, y: 615, type: 'role', group: 'products', detail: 'Senior Software Engineer from 2020 to 2022, working on curriculum and differentiation for a project-based learning platform.' },
    { id: 'project-learning', parent: 'czi', label: 'Project-based learning', x: 40, y: 710, type: 'evidence', group: 'products', detail: 'Curriculum, differentiation, and the 2.0 launch of Announcements, a primary landing page during COVID.' },
    { id: 'one-medical', parent: 'products', label: 'One Medical', x: 360, y: 760, type: 'role', group: 'products', detail: 'Software Engineer on the Data Interoperability team from 2019 to 2020, including machine-learning work in a HIPAA-compliant healthcare environment.' },

    { id: 'independent', parent: 'donald', label: 'Games & independent work', x: 1130, y: 690, type: 'branch', group: 'independent', detail: 'Independent game development, interactive prototypes, and music created outside Donald’s product work.' },
    { id: 'ddm', parent: 'independent', label: 'Derivative Daydream Machine', x: 1350, y: 600, type: 'role', group: 'independent', detail: 'Donald’s independent game-development studio, active from 2022 to 2024.' },
    { id: 'donimoes', parent: 'ddm', label: 'Donimoes', x: 1510, y: 500, type: 'project', group: 'independent', detail: 'A simple two-player game that uses dominoes as playing pieces.', link: 'https://donimoes.fun/', linkLabel: 'Play Donimoes', external: true },
    { id: 'unity-vr', parent: 'ddm', label: 'Unity & VR', x: 1500, y: 685, type: 'project', group: 'independent', detail: 'Unity and 3D simulation prototypes, including a fourth-place VR game-jam project built around accessible spatial-memory play.' },
    { id: 'music', parent: 'ddm', label: 'Music', x: 1390, y: 845, type: 'evidence', group: 'independent', detail: 'Music and composition remain part of Donald’s independent game-making practice.' },

    { id: 'research', parent: 'donald', label: 'Research foundations', x: 720, y: 850, type: 'branch', group: 'research', detail: 'Donald’s background in computational chemistry, molecular modeling, and quantum simulation.' },
    { id: 'amsterdam', parent: 'research', label: 'University of Amsterdam', x: 730, y: 1020, type: 'role', group: 'research', detail: 'Assistant Researcher from 2011 to 2013 on a computational chemistry PhD track.' },
    { id: 'molecular-simulation', parent: 'amsterdam', label: 'Molecular simulation', x: 1000, y: 1020, type: 'evidence', group: 'research', detail: 'Research into gas absorption in metal-organic frameworks using Monte Carlo and molecular dynamics simulation.' },
    { id: 'heriot-watt', parent: 'research', label: 'Heriot-Watt University', x: 430, y: 1000, type: 'role', group: 'research', detail: 'Donald earned a Master of Chemistry at Heriot-Watt University.' },
    { id: 'quantum-simulation', parent: 'heriot-watt', label: 'Quantum simulation', x: 160, y: 1020, type: 'evidence', group: 'research', detail: 'His thesis used quantum simulation to study catalytic synthesis of isoquinoline.' },

    { id: 'practice', parent: 'donald', label: 'Leadership & practice', x: 680, y: 210, type: 'branch', group: 'practice', detail: 'How Donald approaches technical direction, product strategy, team design, and delivery.' },
    { id: 'technical-direction', parent: 'practice', label: 'Technical direction', x: 440, y: 70, type: 'practice', group: 'practice', detail: 'Technical strategy, architecture, engineering standards, and support for technical leads.' },
    { id: 'product-strategy', parent: 'practice', label: 'Product strategy', x: 650, y: 40, type: 'practice', group: 'practice', detail: 'Shaping product direction, prototyping ideas, setting priorities, and connecting technical choices to user needs.' },
    { id: 'team-design', parent: 'practice', label: 'Hiring & team design', x: 870, y: 70, type: 'practice', group: 'practice', detail: 'Hiring, team structure, collaboration practices, and creating room for technical leadership.' },
    { id: 'shape-up', parent: 'practice', label: 'Shape Up', x: 430, y: 255, type: 'practice', group: 'practice', detail: 'At Closegap, Donald runs development in six-week Shape Up cycles with prototyping weeks and cooldowns.' },
    { id: 'fractional', parent: 'practice', label: 'Fractional CTO work', x: 920, y: 215, type: 'practice', group: 'practice', detail: 'Donald is available for select fractional CTO and advisory engagements with small teams.', link: 'mailto:ddmckendrick@gmail.com', linkLabel: 'Start a conversation' },

    { id: 'themes', parent: 'donald', label: 'Recurring themes', x: 1100, y: 300, type: 'branch', group: 'themes', detail: 'Ideas that recur across otherwise separate organizations, projects, and research.' },
    { id: 'education-technology', parent: 'themes', label: 'Education technology', x: 1320, y: 145, type: 'theme', group: 'themes', detail: 'Learning products spanning literacy, project-based learning, student mental health, and social-emotional support.' },
    { id: 'applied-ai', parent: 'themes', label: 'Applied AI & NLP', x: 1380, y: 285, type: 'theme', group: 'themes', detail: 'Applied machine learning, NLP, deep learning, and generative AI used inside real product contexts.' },
    { id: 'privacy-safety', parent: 'themes', label: 'Privacy & safety', x: 1360, y: 435, type: 'theme', group: 'themes', detail: 'Privacy-sensitive healthcare systems and safety-sensitive analysis for student-support products.' },
    { id: 'simulation', parent: 'themes', label: 'Simulation', x: 1110, y: 70, type: 'theme', group: 'themes', detail: 'A through-line connecting molecular modeling with later Unity, 3D, and VR experiments.' },

    { id: 'synergy', parent: 'themes', label: 'Interdimensional synergy', x: 1510, y: 525, type: 'fictional', group: 'fictional', minStage: 2, detail: 'A fictional operating layer that allegedly aligns every stakeholder in this diagram before breakfast.', fictional: true },
    { id: 'quantum-tutor', parent: 'products', label: 'Quantum tutor network', x: 105, y: 850, type: 'fictional', group: 'fictional', minStage: 2, detail: 'A fictional tutoring system that only explains the lesson in universes where the learner already understands it.', fictional: true },
  ];

  const EDGES = [
    ['donald', 'products', ['has built products at', 'keeps building through', 'scales impact through', 'disrupts verticals through']],
    ['products', 'closegap', ['currently leads', 'currently steers', 'operationalizes care at', 'synergizes feelings through']],
    ['closegap', 'student-support', ['builds for', 'supports', 'unlocks support for', 'quantum-accelerates']],
    ['closegap', 'context-detection', ['developed', 'applies context through', 'strategically detects with', 'transcends keywords via']],
    ['products', 'quill', ['co-founded', 'helped grow', 'architected learner outcomes at', 'manifested 1.5M users at']],
    ['quill', 'quill-growth', ['grew from', 'scaled from', 'activated growth from', '10,000× transformed']],
    ['quill', 'writing-feedback', ['built', 'patiently improved', 'AI-enabled', 'hyper-personalized']],
    ['products', 'czi', ['worked at', 'shipped at', 'activated at', 'cross-pollinated at']],
    ['czi', 'project-learning', ['worked on', 'built infrastructure for', 'enabled outcomes in', 'reimagined the paradigm of']],
    ['products', 'one-medical', ['worked at', 'built healthcare systems at', 'operationalized interoperability at', 'healed data gravity at']],

    ['donald', 'independent', ['also makes', 'keeps making', 'explores new modalities through', 'gamifies the metaverse through']],
    ['independent', 'ddm', ['founded', 'built under', 'incubated through', 'dream-machined via']],
    ['ddm', 'donimoes', ['released', 'made playable at', 'shipped independently through', 'domino-pilled']],
    ['ddm', 'unity-vr', ['experiments with', 'builds in', 'creates immersive work with', 'spatially synergizes']],
    ['ddm', 'music', ['includes', 'makes room for', 'scores experiences with', 'sonically aligns']],

    ['donald', 'research', ['began in', 'draws foundations from', 'maintains rigor through', 'peer-reviews reality via']],
    ['research', 'amsterdam', ['included', 'continued at', 'generated findings at', 'molecularly disrupted']],
    ['amsterdam', 'molecular-simulation', ['researched', 'modeled with', 'generated findings through', 'quantum-vibed']],
    ['research', 'heriot-watt', ['began at', 'earned a chemistry degree at', 'built foundational rigor at', 'mastered matter at']],
    ['heriot-watt', 'quantum-simulation', ['studied with', 'modeled with', 'established rigor through', 'quantum-vibed']],

    ['donald', 'practice', ['works through', 'practices', 'operationalizes', 'thought-leads about']],
    ['practice', 'technical-direction', ['includes', 'is grounded in', 'provides leverage through', 'architects destiny via']],
    ['practice', 'product-strategy', ['includes', 'shapes through', 'aligns outcomes through', 'roadmaps the future with']],
    ['practice', 'team-design', ['includes', 'supports', 'unlocks teams through', 'org-designs the vibe with']],
    ['practice', 'shape-up', ['uses', 'runs cycles with', 'leverages', 'vibe-cycles via']],
    ['practice', 'fractional', ['includes', 'is available as', 'selectively offers', 'moonshots through']],

    ['donald', 'themes', ['keeps returning to', 'connects ideas through', 'finds through-lines across', 'summons']],
    ['themes', 'education-technology', ['includes', 'centers', 'activates learning through', 'reinvents education via']],
    ['themes', 'applied-ai', ['includes', 'applies cautiously', 'strategically deploys', 'summons intelligence through']],
    ['themes', 'privacy-safety', ['includes', 'takes seriously', 'operationalizes trust through', 'quantum-seals']],
    ['themes', 'simulation', ['includes', 'connects', 'models systems through', 'simulates the simulation of']],

    ['education-technology', 'quill', ['literacy products', 'connects to', 'activates at', 'learner-optimizes'], 0, true],
    ['education-technology', 'closegap', ['student support', 'connects to', 'operationalizes at', 'wellbeing-maximizes'], 0, true],
    ['education-technology', 'czi', ['project-based learning', 'connects to', 'enabled outcomes at', 'pedagogy-pivots at'], 0, true],
    ['applied-ai', 'quill', ['NLP writing feedback', 'connects to', 'pioneered at', 'did AI before your deck at'], 0, true],
    ['applied-ai', 'closegap', ['context-aware detection', 'connects to', 'deploys context at', 'transcends keywords at'], 0, true],
    ['applied-ai', 'one-medical', ['healthcare machine learning', 'connects to', 'applied carefully at', 'heals data gravity at'], 0, true],
    ['privacy-safety', 'one-medical', ['HIPAA-sensitive systems', 'connects to', 'operationalizes trust at', 'quantum-seals'], 0, true],
    ['privacy-safety', 'closegap', ['safety-sensitive analysis', 'connects to', 'protects students at', 'risk-aligns'], 0, true],
    ['simulation', 'molecular-simulation', ['molecular modeling', 'connects to', 'originates in', 'simulates reality through'], 0, true],
    ['simulation', 'unity-vr', ['3D and VR experiments', 'connects to', 'reappears in', 'spatially synergizes'], 0, true],
    ['technical-direction', 'closegap', ['CTO leadership', 'connects to', 'guides work at', 'thought-leads at'], 0, true],
    ['technical-direction', 'quill', ['technical leadership', 'connects to', 'guided architecture at', 'architected destiny at'], 0, true],
    ['product-strategy', 'closegap', ['product leadership', 'connects to', 'shapes direction at', 'roadmaps the future at'], 0, true],
    ['shape-up', 'closegap', ['six-week cycles', 'connects to', 'focuses delivery at', 'vibe-cycles at'], 0, true],

    ['products', 'quantum-tutor', ['fictionally enables', 'fictionally pilots', 'fictionally scales', 'fictionally hyper-scales'], 2],
    ['themes', 'synergy', ['fictionally powers', 'fictionally aligns', 'fictionally unlocks', 'fictionally transcends'], 2],
  ].map(([from, to, labels, minStage = 0, cross = false]) => ({ from, to, labels, minStage, cross }));

  const nodeById = new Map(NODES.map((node) => [node.id, node]));
  let stage = ['clean', 'subtle', 'awful', 'chaos'].indexOf(document.documentElement.dataset.slopTier);
  if (stage < 0) stage = 0;
  const expandedIds = new Set(['donald', 'products']);
  let selectedId = null;
  let camera = { x: 0, y: 0, scale: 1 };
  let drag = null;
  let dragged = false;

  function svgElement(name, attributes = {}) {
    const element = document.createElementNS(NS, name);
    Object.entries(attributes).forEach(([key, value]) => element.setAttribute(key, String(value)));
    return element;
  }

  function isAvailable(node) {
    return (node.minStage || 0) <= stage;
  }

  function isVisible(node) {
    if (!isAvailable(node)) return false;
    if (!node.parent) return true;
    const parent = nodeById.get(node.parent);
    return Boolean(parent && expandedIds.has(parent.id) && isVisible(parent));
  }

  function visibleNodes() {
    return NODES.filter(isVisible);
  }

  function childrenFor(id) {
    return NODES.filter((node) => node.parent === id && isAvailable(node));
  }

  function revealPath(node) {
    let parent = node.parent ? nodeById.get(node.parent) : null;
    while (parent) {
      expandedIds.add(parent.id);
      parent = parent.parent ? nodeById.get(parent.parent) : null;
    }
  }

  function collapseDescendants(id) {
    childrenFor(id).forEach((child) => {
      expandedIds.delete(child.id);
      collapseDescendants(child.id);
    });
  }

  function toggleExpanded(id) {
    const expanding = !expandedIds.has(id);
    if (!expanding) {
      expandedIds.delete(id);
      collapseDescendants(id);
    } else {
      expandedIds.add(id);
    }
    render();
    window.requestAnimationFrame(() => {
      if (expanding) centerOnNode(id);
      else fitMap({ readable: true });
      nodesElement.querySelector(`[data-expand-id="${id}"]`)?.focus();
    });
  }

  function displayType(node) {
    return {
      core: 'Primary subject', branch: 'Section', role: 'Organization', project: 'Project',
      practice: 'Way of working', theme: 'Recurring theme', evidence: 'Detail',
      fictional: 'Fictional slop node',
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
        class: `map-edge${edge.cross ? ' map-edge-cross' : ''}${edge.minStage ? ' map-edge-fictional' : ''}`,
        'data-from': edge.from,
        'data-to': edge.to,
        'vector-effect': 'non-scaling-stroke',
      });
      (edge.minStage ? extraEdgesElement : edgesElement).append(path);

      const label = svgElement('text', {
        x: geometry.mx,
        y: geometry.my - 7,
        class: `map-edge-label${edge.from === 'donald' ? ' map-edge-label-primary' : ''}${edge.cross ? ' map-edge-label-cross' : ''}${edge.minStage ? ' map-edge-label-fictional' : ''}`,
        'data-from': edge.from,
        'data-to': edge.to,
        'text-anchor': 'middle',
      });
      label.textContent = edge.labels[Math.min(stage, edge.labels.length - 1)];
      labelsElement.append(label);
    });

    visible.forEach((node, index) => {
      const size = nodeSize(node);
      const children = childrenFor(node.id);
      const expandable = children.length > 0;
      const expanded = expandedIds.has(node.id);
      const outer = svgElement('g', {
        class: `map-node map-node-${node.type}`,
        transform: `translate(${node.x} ${node.y})`,
        'data-node-id': node.id,
        style: `--node-index:${index};--chaos-x:${((index * 17) % 27) - 13}px;--chaos-y:${((index * 29) % 23) - 11}px`,
      });
      const motion = svgElement('g', { class: 'map-node-motion' });
      const select = svgElement('g', {
        class: 'map-node-select',
        tabindex: '0',
        role: 'button',
        'aria-label': `${node.label}. ${displayType(node)}. Select for details.`,
      });
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
      select.append(rect, text);
      select.addEventListener('click', (event) => {
        event.stopPropagation();
        if (!dragged) selectNode(node.id);
      });
      select.addEventListener('keydown', (event) => {
        if (event.key !== 'Enter' && event.key !== ' ') return;
        event.preventDefault();
        selectNode(node.id);
      });
      motion.append(select);

      if (expandable) {
        const expand = svgElement('g', {
          class: `map-node-expand${expanded ? ' is-expanded' : ''}`,
          transform: `translate(${size.width / 2 + 18} 0)`,
          tabindex: '0',
          role: 'button',
          'aria-label': `${expanded ? 'Collapse' : 'Expand'} connections from ${node.label}`,
          'aria-expanded': String(expanded),
          'data-expand-id': node.id,
        });
        const circle = svgElement('circle', { cx: 0, cy: 0, r: 16 });
        const horizontal = svgElement('path', { d: 'M -6 0 H 6' });
        const vertical = svgElement('path', { d: 'M 0 -6 V 6', class: 'map-expand-vertical' });
        expand.append(circle, horizontal, vertical);
        expand.addEventListener('click', (event) => {
          event.stopPropagation();
          toggleExpanded(node.id);
        });
        expand.addEventListener('keydown', (event) => {
          if (event.key !== 'Enter' && event.key !== ' ') return;
          event.preventDefault();
          event.stopPropagation();
          toggleExpanded(node.id);
        });
        motion.append(expand);
      }

      outer.append(motion);
      nodesElement.append(outer);
    });

    populatePicker(NODES.filter(isAvailable));
    if (selectedId && visibleIds.has(selectedId)) {
      updateSelection();
      showDetail(nodeById.get(selectedId));
    } else if (selectedId) {
      clearSelection();
    }

    const availableCount = NODES.filter(isAvailable).length;
    const messages = [
      `${visible.length} of ${availableCount} résumé topics visible`,
      `${visible.length} of ${availableCount} topics, lightly overinterpreted`,
      `${visible.length} of ${availableCount} nodes · fictional claims marked`,
      `${visible.length} of ${availableCount} nodes · methodology abandoned`,
    ];
    status.textContent = messages[stage];
  }

  function populatePicker(nodes) {
    const current = selectedId || '';
    const placeholder = document.createElement('option');
    placeholder.value = '';
    placeholder.textContent = 'Choose a node…';
    picker.replaceChildren(placeholder);

    const groups = new Map();
    nodes.forEach((node) => {
      const label = node.fictional ? 'Fictional slop' : {
        core: 'Overview',
        branch: 'Overview',
        role: 'Organizations',
        project: 'Projects',
        practice: 'Leadership and practice',
        theme: 'Recurring themes',
        evidence: 'Details',
      }[node.type] || 'Other topics';
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
    if (!node || !isAvailable(node)) return;
    const needsReveal = !isVisible(node);
    if (needsReveal) revealPath(node);
    selectedId = id;
    if (needsReveal) {
      render();
      window.requestAnimationFrame(() => centerOnNode(id));
    } else {
      updateSelection();
      showDetail(node);
      picker.value = id;
      window.requestAnimationFrame(() => centerOnNode(id));
    }
    if (focus) window.requestAnimationFrame(() => nodesElement.querySelector(`[data-node-id="${id}"] .map-node-select`)?.focus());
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
    const relatedNodes = [...new Set(relatedIds)].map((id) => nodeById.get(id)).filter((related) => related && isAvailable(related));
    if (relatedNodes.length) {
      const label = document.createElement('p');
      label.textContent = 'Related topics';
      const links = document.createElement('div');
      relatedNodes.forEach((related) => {
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

  function centerOnNode(id) {
    const node = nodeById.get(id);
    if (!node) return;
    camera.x = (VIEW_WIDTH / 2) - node.x * camera.scale;
    camera.y = (VIEW_HEIGHT / 2) - node.y * camera.scale;
    updateCamera();
  }

  function fitMap({ readable = false } = {}) {
    const visible = visibleNodes();
    if (!visible.length) return;
    const narrow = window.matchMedia('(max-width: 680px)').matches;
    const minX = Math.min(...visible.map((node) => node.x));
    const maxX = Math.max(...visible.map((node) => node.x));
    const minY = Math.min(...visible.map((node) => node.y));
    const maxY = Math.max(...visible.map((node) => node.y));
    const width = Math.max(420, maxX - minX + 330);
    const height = Math.max(360, maxY - minY + 250);
    const fittedScale = Math.max(0.62, Math.min(VIEW_WIDTH / width, VIEW_HEIGHT / height, narrow ? 2.05 : 1.65));
    const scale = readable && narrow ? Math.max(1.72, fittedScale) : fittedScale;
    const centerX = (minX + maxX) / 2;
    const centerY = (minY + maxY) / 2;
    camera = {
      scale,
      x: (VIEW_WIDTH / 2) - centerX * scale,
      y: (VIEW_HEIGHT / 2) - centerY * scale,
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
    if (!selectedId) fitMap({ readable: true });
  });

  render();
  fitMap({ readable: true });
  window.requestAnimationFrame(() => workspace.classList.add('map-ready'));
})();
