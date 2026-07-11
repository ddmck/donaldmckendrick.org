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
    { id: 'donald', label: 'Donald McKendrick', x: 800, y: 520, type: 'core', group: 'center', detail: 'CTO, software engineer, and product builder working across education, AI, and games.', link: 'resume.html', linkLabel: 'Read the résumé' },
    { id: 'education', parent: 'donald', label: 'Education products', x: 500, y: 355, type: 'branch', group: 'work', detail: 'More than a decade building learning products, from literacy practice to mental-health and social-emotional support.' },
    { id: 'quill', parent: 'education', label: 'Quill.org', x: 270, y: 420, type: 'role', group: 'work', detail: 'Cofounder and Technical Director from 2016 to 2019. Donald helped grow Quill from 10,000 to more than 1.5 million users.', link: 'https://www.quill.org', linkLabel: 'Visit Quill.org', external: true },
    { id: 'literacy', parent: 'quill', label: 'Literacy feedback', x: 70, y: 515, type: 'evidence', group: 'work', detail: 'At Quill, Donald shipped Connect, Lessons, and Diagnostic, with automated feedback for open-ended writing.' },
    { id: 'closegap', parent: 'education', label: 'Closegap', x: 285, y: 230, type: 'role', group: 'work', detail: 'Chief Technology Officer since November 2024, leading product strategy and engineering for K–12 mental-health and SEL tools.', link: 'https://www.closegap.org', linkLabel: 'Visit Closegap', external: true },
    { id: 'mental-health', parent: 'closegap', label: 'Student mental health', x: 80, y: 145, type: 'evidence', group: 'work', detail: 'At Closegap, Donald builds free tools that help K–12 students identify and get support for emotional needs.' },
    { id: 'czi', parent: 'education', label: 'Chan Zuckerberg Initiative', x: 490, y: 115, type: 'role', group: 'work', detail: 'Senior Software Engineer from 2020 to 2022, working on curriculum and differentiation for a project-based learning platform.' },
    { id: 'project-learning', parent: 'czi', label: 'Project-based learning', x: 290, y: 45, type: 'evidence', group: 'work', detail: 'Donald worked on curriculum, differentiation, and the 2.0 launch of Announcements, a primary landing page during COVID.' },
    { id: 'leadership', parent: 'donald', label: 'Engineering leadership', x: 790, y: 245, type: 'branch', group: 'leadership', detail: 'Product strategy, technical direction, hiring, team structure, process design, and support for technical leads.' },
    { id: 'fractional', parent: 'leadership', label: 'Fractional CTO work', x: 775, y: 55, type: 'evidence', group: 'leadership', detail: 'Donald is available for select fractional CTO and advisory engagements with small teams.', link: 'mailto:ddmckendrick@gmail.com', linkLabel: 'Start a conversation' },
    { id: 'shape-up', parent: 'leadership', label: 'Shape Up', x: 990, y: 135, type: 'evidence', group: 'leadership', detail: 'At Closegap, Donald runs development in six-week Shape Up cycles with prototyping weeks and cooldowns.' },
    { id: 'ai', parent: 'donald', label: 'AI & machine learning', x: 1080, y: 355, type: 'branch', group: 'ai', detail: 'Donald has worked with NLP, deep learning, generative AI, TensorFlow, scikit-learn, and responsible AI in K–12.' },
    { id: 'nlp', parent: 'ai', label: 'NLP since 2016', x: 1320, y: 275, type: 'evidence', group: 'ai', detail: 'At Quill, Donald introduced AI and NLP for writing feedback and built a deep-learning sentence-fragment detector.' },
    { id: 'generative-ai', parent: 'ai', label: 'Context-aware AI', x: 1370, y: 430, type: 'evidence', group: 'ai', detail: 'At Closegap, Donald built a generative-AI crisis detection tool that replaced keyword matching with context-aware analysis.' },
    { id: 'one-medical', parent: 'ai', label: 'One Medical', x: 1140, y: 165, type: 'role', group: 'ai', detail: 'Software Engineer on the Data Interoperability team from 2019 to 2020, including machine-learning work in healthcare.' },
    { id: 'privacy', parent: 'one-medical', label: 'Privacy-sensitive systems', x: 1385, y: 85, type: 'evidence', group: 'ai', detail: 'Donald has worked in a HIPAA-compliant environment with rigorous privacy and security requirements.' },
    { id: 'games', parent: 'donald', label: 'Games & interactive work', x: 1120, y: 675, type: 'branch', group: 'games', detail: 'Independent game development spanning an educational RPG, VR prototypes, spatial-memory play, and music composition.' },
    { id: 'ddm', parent: 'games', label: 'Derivative Daydream Machine', x: 1375, y: 600, type: 'role', group: 'games', detail: 'Donald’s independent game-development studio, active from 2022 to 2024.' },
    { id: 'unity-vr', parent: 'games', label: 'Unity & VR', x: 1430, y: 770, type: 'evidence', group: 'games', detail: 'Donald placed fourth in a VR game jam with an accessible spatial-memory party game and has built 3D simulation prototypes.' },
    { id: 'research', parent: 'donald', label: 'Research', x: 810, y: 820, type: 'branch', group: 'research', detail: 'Before product engineering, Donald worked in computational chemistry and now collaborates on research in education and emotional granularity.' },
    { id: 'amsterdam', parent: 'research', label: 'University of Amsterdam', x: 760, y: 1010, type: 'role', group: 'research', detail: 'Assistant Researcher from 2011 to 2013 on a computational chemistry PhD track.' },
    { id: 'chemistry', parent: 'amsterdam', label: 'Molecular simulation', x: 1010, y: 1020, type: 'evidence', group: 'research', detail: 'Donald researched gas absorption in metal-organic frameworks using Monte Carlo and molecular dynamics simulation.' },
    { id: 'heriot-watt', parent: 'research', label: 'Heriot-Watt University', x: 525, y: 930, type: 'role', group: 'research', detail: 'Donald earned a Master of Chemistry. His thesis used quantum simulation to study catalytic synthesis of isoquinoline.' },
    { id: 'synergy', parent: 'ai', label: 'Interdimensional synergy', x: 1510, y: 525, type: 'fictional', group: 'fictional', minStage: 2, detail: 'A fictional operating layer that allegedly aligns every stakeholder in this diagram before breakfast.', fictional: true },
    { id: 'quantum-tutor', parent: 'education', label: 'Quantum tutor network', x: 95, y: 685, type: 'fictional', group: 'fictional', minStage: 2, detail: 'A fictional tutoring system that only explains the lesson in universes where the learner already understands it.', fictional: true },
  ];

  const EDGES = [
    ['donald', 'education', ['builds', 'keeps returning to', 'scales impact through', 'disrupts the vertical of']],
    ['education', 'quill', ['co-founded', 'helped grow', 'architected learner outcomes at', 'manifested 1.5M users at']],
    ['quill', 'literacy', ['gave feedback on', 'patiently corrected', 'AI-enabled', '10,000× transformed']],
    ['education', 'closegap', ['now leads', 'now steers', 'operationalizes care at', 'synergizes feelings through']],
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
    ['donald', 'research', ['began in', 'still collaborates on', 'maintains epistemic leverage through', 'peer-reviews reality via']],
    ['research', 'amsterdam', ['included', 'once worked at', 'generated findings at', 'molecularly disrupted']],
    ['amsterdam', 'chemistry', ['simulated', 'involved', 'modeled innovation through', 'quantum-vibed']],
    ['research', 'heriot-watt', ['studied at', 'earned a chemistry degree at', 'built foundational rigor at', 'mastered matter at']],
    ['education', 'quantum-tutor', ['fictionally enables', 'fictionally pilots', 'fictionally scales', 'fictionally hyper-scales'], 2],
    ['ai', 'synergy', ['fictionally powers', 'fictionally aligns', 'fictionally unlocks', 'fictionally transcends'], 2],
  ].map(([from, to, labels, minStage = 0]) => ({ from, to, labels, minStage }));

  const nodeById = new Map(NODES.map((node) => [node.id, node]));
  let stage = ['clean', 'subtle', 'awful', 'chaos'].indexOf(document.documentElement.dataset.slopTier);
  if (stage < 0) stage = 0;
  const expandedIds = new Set(['donald']);
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
      core: 'Primary subject', branch: 'Working theme', role: 'Experience', evidence: 'Evidence',
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
      const label = node.fictional ? 'Fictional slop' : ['core', 'branch'].includes(node.type) ? 'Overview' : 'Experience and evidence';
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
    const scale = readable && narrow ? Math.max(2.05, fittedScale) : fittedScale;
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
