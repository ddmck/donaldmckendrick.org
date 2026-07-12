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
  const detailTitle = document.querySelector('[data-map-detail-title]');
  const detailCopy = document.querySelector('[data-map-detail-copy]');
  const detailLink = document.querySelector('[data-map-detail-link]');
  const fictionNote = document.querySelector('[data-map-fiction-note]');
  const relatedElement = document.querySelector('[data-map-related]');
  const closeButton = document.querySelector('[data-map-close]');
  const zoomInButton = document.querySelector('[data-map-zoom-in]');
  const zoomOutButton = document.querySelector('[data-map-zoom-out]');
  const expandAllButton = document.querySelector('[data-map-expand-all]');
  const collapseAllButton = document.querySelector('[data-map-collapse-all]');
  const fitButton = document.querySelector('[data-map-fit]');

  if (
    !svg || !workspace || !cameraElement || !edgesElement || !extraEdgesElement || !labelsElement ||
    !nodesElement || !inspector || !picker || !status || !detailTitle ||
    !detailCopy || !detailLink || !fictionNote || !relatedElement || !closeButton || !zoomInButton ||
    !zoomOutButton || !expandAllButton || !collapseAllButton || !fitButton
  ) return;

  const NS = 'http://www.w3.org/2000/svg';
  const VIEW_WIDTH = 1600;
  const VIEW_HEIGHT = 1080;
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  const NODES = [
    { id: 'donald', label: 'Donald McKendrick', x: 800, y: 540, type: 'core', group: 'center', detail: 'CTO, software engineer, and product builder working across education, AI, research, and games.', link: 'resume.html', linkLabel: 'Read the résumé' },

    { id: 'products', parent: 'donald', label: 'Products & organizations', x: 440, y: 480, type: 'branch', group: 'products', detail: 'The organizations where Donald has built education, healthcare, and student-support products.' },
    { id: 'closegap', parent: 'products', label: 'Closegap', x: 200, y: 270, type: 'role', group: 'products', detail: 'Chief Technology Officer since November 2024, leading product strategy and engineering for K–12 mental-health and SEL tools.', link: 'https://www.closegap.org', linkLabel: 'Visit Closegap', external: true },
    { id: 'student-support', parent: 'closegap', label: 'K–12 mental health & SEL', x: 55, y: 165, type: 'evidence', group: 'products', detail: 'Free tools that help K–12 students identify and get support for emotional needs.' },
    { id: 'context-detection', parent: 'closegap', label: 'Context-aware detection', x: -60, y: 350, type: 'evidence', group: 'products', detail: 'A generative-AI crisis detection tool that replaced keyword matching with context-aware analysis.' },
    { id: 'quill', parent: 'products', label: 'Quill.org', x: 180, y: 440, type: 'role', group: 'products', detail: 'Cofounder and Technical Director from 2016 to 2019, building free literacy products and automated writing feedback.', link: 'https://www.quill.org', linkLabel: 'Visit Quill.org', external: true },
    { id: 'quill-growth', parent: 'quill', label: '10,000 → 1.5M+ learners', x: -40, y: 490, type: 'evidence', group: 'products', detail: 'Donald helped grow Quill from roughly 10,000 users to more than 1.5 million.' },
    { id: 'writing-feedback', parent: 'quill', label: 'NLP writing feedback', x: 10, y: 600, type: 'evidence', group: 'products', detail: 'Connect, Lessons, and Diagnostic used automated feedback for open-ended writing, including a deep-learning sentence-fragment detector.' },
    { id: 'czi', parent: 'products', label: 'Chan Zuckerberg Initiative', x: 280, y: 650, type: 'role', group: 'products', detail: 'Senior Software Engineer from 2020 to 2022, working on curriculum and differentiation for a project-based learning platform.' },
    { id: 'project-learning', parent: 'czi', label: 'Project-based learning', x: 70, y: 755, type: 'evidence', group: 'products', detail: 'Curriculum, differentiation, and the 2.0 launch of Announcements, a primary landing page during COVID.' },
    { id: 'one-medical', parent: 'products', label: 'One Medical', x: 360, y: 760, type: 'role', group: 'products', detail: 'Software Engineer on the Data Interoperability team from 2019 to 2020, including machine-learning work in a HIPAA-compliant healthcare environment.' },

    { id: 'independent', parent: 'donald', label: 'Games & independent work', x: 1080, y: 720, type: 'branch', group: 'independent', detail: 'Independent game development, interactive prototypes, and music created outside Donald’s product work.' },
    { id: 'ddm', parent: 'independent', label: 'Derivative Daydream Machine', x: 1390, y: 600, type: 'role', group: 'independent', detail: 'Donald’s independent game-development studio, active from 2022 to 2024.' },
    { id: 'donimoes', parent: 'ddm', label: 'Donimoes', x: 1580, y: 480, type: 'project', group: 'independent', detail: 'A simple two-player game that uses dominoes as playing pieces.', link: 'https://donimoes.fun/', linkLabel: 'Play Donimoes', external: true },
    { id: 'unity-vr', parent: 'ddm', label: 'Unity & VR', x: 1540, y: 735, type: 'project', group: 'independent', detail: 'Unity and 3D simulation prototypes, including a fourth-place VR game-jam project built around accessible spatial-memory play.' },
    { id: 'music', parent: 'ddm', label: 'Music', x: 1390, y: 845, type: 'evidence', group: 'independent', detail: 'Music and composition remain part of Donald’s independent game-making practice.' },

    { id: 'research', parent: 'donald', label: 'Research foundations', x: 720, y: 850, type: 'branch', group: 'research', detail: 'Donald’s background in computational chemistry, molecular modeling, and quantum simulation.' },
    { id: 'amsterdam', parent: 'research', label: 'University of Amsterdam', x: 730, y: 1020, type: 'role', group: 'research', detail: 'Assistant Researcher from 2011 to 2013 on a computational chemistry PhD track.' },
    { id: 'molecular-simulation', parent: 'amsterdam', label: 'Molecular simulation', x: 1000, y: 1020, type: 'evidence', group: 'research', detail: 'Research into gas absorption in metal-organic frameworks using Monte Carlo and molecular dynamics simulation.' },
    { id: 'heriot-watt', parent: 'research', label: 'Heriot-Watt University', x: 430, y: 1000, type: 'role', group: 'research', detail: 'Donald earned a Master of Chemistry at Heriot-Watt University.' },
    { id: 'quantum-simulation', parent: 'heriot-watt', label: 'Quantum simulation', x: 160, y: 1020, type: 'evidence', group: 'research', detail: 'His thesis used quantum simulation to study catalytic synthesis of isoquinoline.' },

    { id: 'practice', parent: 'donald', label: 'Leadership & practice', x: 680, y: 210, type: 'branch', group: 'practice', detail: 'How Donald approaches technical direction, product strategy, team design, and delivery.' },
    { id: 'technical-direction', parent: 'practice', label: 'Technical direction', x: 360, y: 70, type: 'practice', group: 'practice', detail: 'Technical strategy, architecture, engineering standards, and support for technical leads.' },
    { id: 'product-strategy', parent: 'practice', label: 'Product strategy', x: 650, y: 40, type: 'practice', group: 'practice', detail: 'Shaping product direction, prototyping ideas, setting priorities, and connecting technical choices to user needs.' },
    { id: 'team-design', parent: 'practice', label: 'Hiring & team design', x: 920, y: 70, type: 'practice', group: 'practice', detail: 'Hiring, team structure, collaboration practices, and creating room for technical leadership.' },
    { id: 'shape-up', parent: 'practice', label: 'Shape Up', x: 450, y: 300, type: 'practice', group: 'practice', detail: 'At Closegap, Donald runs development in six-week Shape Up cycles with prototyping weeks and cooldowns.' },
    { id: 'fractional', parent: 'practice', label: 'Fractional CTO work', x: 820, y: 350, type: 'practice', group: 'practice', detail: 'Donald is available for select fractional CTO and advisory engagements with small teams.', link: 'mailto:ddmckendrick@gmail.com', linkLabel: 'Start a conversation' },

    { id: 'themes', parent: 'donald', label: 'Recurring themes', x: 1100, y: 300, type: 'branch', group: 'themes', detail: 'Ideas that recur across otherwise separate organizations, projects, and research.' },
    { id: 'education-technology', parent: 'themes', label: 'Education technology', x: 1320, y: 145, type: 'theme', group: 'themes', detail: 'Learning products spanning literacy, project-based learning, student mental health, and social-emotional support.' },
    { id: 'applied-ai', parent: 'themes', label: 'Applied AI & NLP', x: 1420, y: 285, type: 'theme', group: 'themes', detail: 'Applied machine learning, NLP, deep learning, and generative AI used inside real product contexts.' },
    { id: 'privacy-safety', parent: 'themes', label: 'Privacy & safety', x: 1360, y: 435, type: 'theme', group: 'themes', detail: 'Privacy-sensitive healthcare systems and safety-sensitive analysis for student-support products.' },
    { id: 'simulation', parent: 'themes', label: 'Simulation', x: 1160, y: 0, type: 'theme', group: 'themes', detail: 'A through-line connecting molecular modeling with later Unity, 3D, and VR experiments.' },

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

  ].map(([from, to, labels, minStage = 0, cross = false]) => ({ from, to, labels, minStage, cross }));

  const nodeById = new Map(NODES.map((node) => [node.id, node]));
  let stage = ['clean', 'subtle', 'awful', 'chaos'].indexOf(document.documentElement.dataset.slopTier);
  if (stage < 0) stage = 0;
  const expandedIds = new Set(['donald', 'products']);
  let selectedId = null;
  let camera = { x: 0, y: 0, scale: 1 };
  let drag = null;
  let dragged = false;
  let renderedVisibleIds = new Set();
  let renderedVisibleEdgeIds = new Set();

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
      if (expanding) ensureExpandedClusterInSafeArea(id);
      else ensureNodeInSafeArea(id);
      nodesElement.querySelector(`[data-expand-id="${id}"]`)?.focus();
    });
  }

  function expandAll() {
    clearSelection();
    NODES.filter(isAvailable).forEach((node) => {
      if (childrenFor(node.id).length) expandedIds.add(node.id);
    });
    render();
    window.requestAnimationFrame(() => fitMap());
  }

  function collapseAll() {
    clearSelection();
    expandedIds.clear();
    render();
    window.requestAnimationFrame(() => fitMap({ readable: true }));
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
    const visibleEdges = EDGES.filter((edge) => (
      !edge.cross && edge.minStage <= stage && visibleIds.has(edge.from) && visibleIds.has(edge.to)
    ));
    const visibleEdgeIds = new Set(visibleEdges.map((edge) => `${edge.from}:${edge.to}`));

    visibleEdges.forEach((edge, index) => {
      const from = nodeById.get(edge.from);
      const to = nodeById.get(edge.to);
      const geometry = curvedPath(from, to, index);
      const path = svgElement('path', {
        d: geometry.d,
        class: `map-edge${renderedVisibleEdgeIds.has(`${edge.from}:${edge.to}`) ? '' : ' is-entering'}${edge.cross ? ' map-edge-cross' : ''}${edge.minStage ? ' map-edge-fictional' : ''}`,
        'data-from': edge.from,
        'data-to': edge.to,
        'vector-effect': 'non-scaling-stroke',
      });
      (edge.minStage ? extraEdgesElement : edgesElement).append(path);

      if (stage === 3) {
        const label = svgElement('text', {
          x: geometry.mx,
          y: geometry.my - 7,
          class: `map-edge-label${edge.from === 'donald' ? ' map-edge-label-primary' : ''}`,
          'data-from': edge.from,
          'data-to': edge.to,
          'text-anchor': 'middle',
        });
        label.textContent = edge.labels[3];
        labelsElement.append(label);
      }
    });

    visible.forEach((node, index) => {
      const size = nodeSize(node);
      const children = childrenFor(node.id);
      const expandable = children.length > 0;
      const expanded = expandedIds.has(node.id);
      const outer = svgElement('g', {
        class: `map-node map-node-${node.type}${renderedVisibleIds.has(node.id) ? '' : ' is-entering'}`,
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
      `${visible.length} of ${availableCount} nodes · aggressively framed`,
      `${visible.length} of ${availableCount} nodes · methodology abandoned`,
    ];
    status.textContent = messages[stage];
    renderedVisibleIds = visibleIds;
    renderedVisibleEdgeIds = visibleEdgeIds;
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
      window.requestAnimationFrame(() => ensureNodeInSafeArea(id));
    } else {
      updateSelection();
      showDetail(node);
      picker.value = id;
      window.requestAnimationFrame(() => ensureNodeInSafeArea(id));
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
    detailTitle.textContent = node.label;
    detailCopy.textContent = node.detail;
    fictionNote.hidden = !node.fictional;

    relatedElement.replaceChildren();
    const primaryIds = [];
    const otherIds = [];
    EDGES.forEach((edge) => {
      if (edge.minStage > stage) return;
      const relatedId = edge.from === node.id ? edge.to : edge.to === node.id ? edge.from : null;
      if (!relatedId) return;
      (edge.cross ? otherIds : primaryIds).push(relatedId);
    });

    const relatedNodes = [...new Set([...primaryIds, ...otherIds])]
      .map((id) => nodeById.get(id))
      .filter((related) => related && isAvailable(related));
    if (relatedNodes.length) {
      const links = document.createElement('div');
      relatedNodes.forEach((related) => {
        const button = document.createElement('button');
        button.type = 'button';
        button.textContent = related.label;
        button.addEventListener('click', () => selectNode(related.id));
        links.append(button);
      });
      relatedElement.append(links);
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

  function renderedNodeBounds(node) {
    const size = nodeSize(node);
    const motionAllowance = stage === 3 && !prefersReducedMotion.matches ? 18 : 2;
    const expandAllowance = childrenFor(node.id).length ? 34 : 0;
    return {
      left: node.x - size.width / 2 - motionAllowance,
      right: node.x + size.width / 2 + expandAllowance + motionAllowance,
      top: node.y - size.height / 2 - motionAllowance,
      bottom: node.y + size.height / 2 + motionAllowance,
    };
  }

  function combinedBounds(nodes) {
    const bounds = nodes.map(renderedNodeBounds);
    return {
      left: Math.min(...bounds.map((item) => item.left)),
      right: Math.max(...bounds.map((item) => item.right)),
      top: Math.min(...bounds.map((item) => item.top)),
      bottom: Math.max(...bounds.map((item) => item.bottom)),
    };
  }

  function visibleDescendants(id) {
    return childrenFor(id).flatMap((child) => (
      isVisible(child) ? [child, ...visibleDescendants(child.id)] : []
    ));
  }

  function ensureBoundsInSafeArea(bounds, fraction, { allowZoomOut = false } = {}) {
    const safeWidth = VIEW_WIDTH * fraction;
    const safeHeight = VIEW_HEIGHT * fraction;
    const safeLeft = (VIEW_WIDTH - safeWidth) / 2;
    const safeRight = safeLeft + safeWidth;
    const safeTop = (VIEW_HEIGHT - safeHeight) / 2;
    const safeBottom = safeTop + safeHeight;
    let nextScale = camera.scale;

    if (allowZoomOut) {
      const width = Math.max(1, bounds.right - bounds.left);
      const height = Math.max(1, bounds.bottom - bounds.top);
      nextScale = Math.max(0.62, Math.min(camera.scale, safeWidth / width, safeHeight / height));
    }

    const projected = {
      left: camera.x + bounds.left * nextScale,
      right: camera.x + bounds.right * nextScale,
      top: camera.y + bounds.top * nextScale,
      bottom: camera.y + bounds.bottom * nextScale,
    };
    let dx = 0;
    let dy = 0;

    if (projected.right - projected.left > safeWidth) {
      dx = VIEW_WIDTH / 2 - (projected.left + projected.right) / 2;
    } else if (projected.left < safeLeft) {
      dx = safeLeft - projected.left;
    } else if (projected.right > safeRight) {
      dx = safeRight - projected.right;
    }

    if (projected.bottom - projected.top > safeHeight) {
      dy = VIEW_HEIGHT / 2 - (projected.top + projected.bottom) / 2;
    } else if (projected.top < safeTop) {
      dy = safeTop - projected.top;
    } else if (projected.bottom > safeBottom) {
      dy = safeBottom - projected.bottom;
    }

    if (Math.abs(nextScale - camera.scale) < 0.0001 && Math.abs(dx) < 0.01 && Math.abs(dy) < 0.01) return;
    camera = { x: camera.x + dx, y: camera.y + dy, scale: nextScale };
    updateCamera();
  }

  function ensureNodeInSafeArea(id) {
    const node = nodeById.get(id);
    if (!node) return;
    ensureBoundsInSafeArea(renderedNodeBounds(node), 0.8);
  }

  function ensureExpandedClusterInSafeArea(id) {
    const node = nodeById.get(id);
    if (!node) return;
    ensureBoundsInSafeArea(combinedBounds([node, ...visibleDescendants(id)]), 0.9, { allowZoomOut: true });
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
  expandAllButton.addEventListener('click', expandAll);
  collapseAllButton.addEventListener('click', collapseAll);
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
