import fs from 'node:fs';
import postcss from 'postcss';

const filename = 'apps/web/src/styles.css';
const ast = postcss.parse(fs.readFileSync(filename, 'utf8'));
const removedSelectors = new Set([
  '.text-button', '.text-button:hover', '.button', '.button:hover:not(:disabled)',
  '.button:active:not(:disabled)', '.button.secondary', '.button.secondary:hover',
  '.button.small', '.icon-button', '.icon-button:hover:not(:disabled)',
  '.field select', '.reading-select-row select', '.reading-select-row .button',
  '.reading-tabs>.button', '.reading-tabs>.button[aria-pressed="true"]',
  '.reading-tabs .reading-recent-toggle', '.reading-tabs .reading-action-icon',
  '.reading-tabs .reading-action-icon svg', '.reading-tabs .reading-action-icon[aria-expanded="true"]',
  '.reading-tabs .reading-favorite-toggle[aria-pressed="true"]', '.reading-tabs .reading-action-icon:focus-visible',
  '.reading-tabs .reading-action-icon:not(:disabled):hover',
  '.reading-tabs .reading-recent-toggle:not(:disabled):not([aria-expanded="true"]):hover svg',
  '.reading-tabs .reading-favorite-toggle:not(:disabled):hover svg',
  '.reading-tabs .reading-action-icon:not(:disabled):active',
  '.reading-tabs .reading-action-icon:not(:disabled):active svg', '.reading-tabs .reading-action-icon:disabled',
  '.reading-tabs button:focus-visible', '.devotional-editor button', '.devotional-editor button:disabled',
  '.devotional-editor :is(input, textarea, button):focus-visible',
  '.devotional-editor input[type="date"]::-webkit-calendar-picker-indicator',
  '.scripture-picker-search button', '.bible-picker-return:focus-visible',
  '.devotional-editor .bible-picker-return', '.selection-menu .selection-action svg',
  '.selection-menu-controls button', '.selection-menu :is(button, input, textarea):focus-visible',
  '.group-scripture .icon-button', '.dropdown-trigger:focus-visible', '.dropdown-trigger:disabled',
  '.dropdown-option:disabled', '.account-popover a:hover', '.account-popover button:hover',
]);
const fieldStyles = new Set(['.field input', '.field textarea', '.devotional-editor input', '.devotional-editor textarea']);

ast.walkRules(rule => {
  rule.selectors = rule.selectors.filter(selector => !removedSelectors.has(selector));
  if (!rule.selectors.length) { rule.remove(); return; }
  rule.selectors = rule.selectors.map(selector => selector.replaceAll('.icon-button', '.button--icon').replaceAll('.text-button', '.button--ghost').replaceAll('.form-button', '.reading-tab'));
  if (rule.selector === '.reading-tabs button' || rule.selector === '.reading-tabs button[aria-pressed="true"]') {
    rule.selector = rule.selector.replace('button', '.reading-tab');
    rule.walkDecls('padding', decl => { decl.value = '12px 8px'; });
    rule.append({ prop: 'border-radius', value: '0' });
    rule.append({ prop: 'background', value: 'transparent' });
  }
  if (rule.selector === ':focus-visible') rule.walkDecls('outline', decl => { decl.value = '2px solid var(--gold)'; });
  if (rule.selector === '.mobile-nav') rule.walkDecls('padding', decl => { decl.value = '8px max(8px, env(safe-area-inset-right)) calc(8px + env(safe-area-inset-bottom)) max(8px, env(safe-area-inset-left))'; });
  if (rule.selector === '.mobile-nav a') {
    rule.walkDecls('min-width', decl => { decl.value = '0'; });
    rule.append({ prop: 'flex', value: '1 1 0' });
    rule.append({ prop: 'overflow-wrap', value: 'anywhere' });
    rule.walkDecls('padding', decl => { decl.value = '6px 4px'; });
  }
  if (rule.selector === '.editorial-actions' || rule.selector === '.chapter-navigation') rule.append({ prop: 'flex-wrap', value: 'wrap' });
  if (rule.selector === '.notification-line') rule.append({ prop: 'flex-wrap', value: 'wrap' });
  if (rule.selector === '.account-popover') rule.append({ prop: 'max-width', value: 'calc(100vw - 32px)' });
  if (rule.selector === '.account-popover a,\n.account-popover button') {
    rule.removeAll();
    rule.append({ prop: 'justify-content', value: 'flex-start' }, { prop: 'width', value: '100%' }, { prop: 'text-align', value: 'left' });
  }
  if (rule.selector === '.reading-tabs') {
    rule.walkDecls('flex-wrap', decl => { decl.value = 'wrap'; });
    rule.walkDecls('gap', decl => { decl.value = '4px 16px'; });
  }
  if (rule.selectors.includes('.reading-tabs .reading-devotional-group')) {
    rule.walkDecls('width', decl => decl.remove());
    rule.append({ prop: 'flex', value: '1 1 auto' });
  }
  if (rule.selectors.includes('.reading-devotional-group')) rule.walkDecls('gap', decl => { decl.value = '4px'; });
  if (rule.selector === '.bible-picker-return') {
    rule.walkDecls(decl => { if (['display', 'place-items', 'padding', 'border', 'background', 'color'].includes(decl.prop)) decl.remove(); });
  }
  if (rule.selector === '.audio-toggle') {
    rule.removeAll(); rule.append({ prop: 'border-radius', value: '50%' });
  }
  if (rule.selector === '.selection-menu .selection-action') {
    rule.walkDecls(decl => { if (['display','align-items','gap','min-height'].includes(decl.prop)) decl.remove(); });
    rule.append({ prop: 'justify-content', value: 'flex-start' });
  }
  if (rule.selector === '.modal') rule.append({ prop: 'overscroll-behavior', value: 'contain' });
  if (rule.selectors.every(selector => fieldStyles.has(selector))) {
    for (const decl of [...rule.nodes]) if (decl.type === 'decl' && ['border','border-radius','background','color','width','padding','font-size','line-height','display','margin-top','min-width','max-width'].includes(decl.prop)) decl.remove();
  }
  rule.walkDecls(decl => {
    if (decl.value.includes('#b7a277')) decl.value = decl.value.replace('#b7a277', 'var(--gold)');
    if (decl.value.includes('var(--accent)')) decl.value = decl.value.replace('var(--accent)', 'var(--gold)');
    if (decl.prop === 'box-shadow' && decl.value.includes('#000000')) decl.value = decl.value.replace(/#000000[0-9a-f]{2}/g, 'color-mix(in srgb, var(--ink) 12%, transparent)');
  });
  if (!rule.nodes.length) rule.remove();
});

const modules = new Map();
const order = ['base', 'controls', 'shell', 'devotional', 'community', 'bible', 'editorial', 'access', 'feedback', 'preferences'];
for (const name of order) modules.set(name, postcss.root());
function category(selector) {
  if (selector.includes('devotional-editor') || selector.startsWith('.editorial-page') || selector.startsWith('.editorial-list') || selector.startsWith('.editorial-actions')) return 'editorial';
  if (/^\.(button|form|field|modal|dialog-description|dropdown)/.test(selector)) return 'controls';
  if (/^\.(reader-(shell|header|masthead)|site-|header-|brand|desktop-nav|account-|avatar|preview-|monthly-theme|theme-|mobile-nav|skip-link)/.test(selector)) return 'shell';
  if (/^\.(bible-|chapter-|verse-result|selection-|share-copy|scripture-picker)/.test(selector) || selector.startsWith('[data-reading-mode')) return 'bible';
  if (/^\.(community-|group-|create-community|message-|checklist-|check-|member-|invitation-|invite-|load-more|card-link|section-top)/.test(selector)) return 'community';
  if (/^\.(reading-|devotional-|date-label|scripture-|reflection-|prayer-|weekly-|editorial-credit|recent-devotional-|snapshot-note)/.test(selector)) return 'devotional';
  if (/^\.(access-|login-|privacy-|info-|profile-|offline-page)/.test(selector)) return 'access';
  if (/^\.(settings-)/.test(selector) || selector.startsWith('html[data-theme') || selector.startsWith('[data-theme')) return 'preferences';
  if (/^\.(notification|error|success|empty|loading|skeleton|notice|update-notice|persistent-audio|audio-)/.test(selector) || selector === 'audio') return 'feedback';
  return 'base';
}
function partition(nodes, parents = []) {
  for (const node of nodes) {
    if (node.type === 'comment') continue;
    if (node.type === 'atrule' && node.name === 'tailwind') { modules.get('base').append(node.clone()); continue; }
    if (node.type === 'atrule' && node.name === 'media') { partition(node.nodes, [...parents, node]); continue; }
    const groups = node.type === 'rule' ? Map.groupBy(node.selectors, category) : new Map([['feedback', null]]);
    for (const [name, selectors] of groups) {
      let copy = node.clone();
      if (selectors) copy.selectors = selectors;
      for (const parent of parents.toReversed()) { const wrapper = parent.clone({ nodes: [] }); wrapper.append(copy); copy = wrapper; }
      modules.get(name).append(copy);
    }
  }
}
partition(ast.nodes);
fs.mkdirSync('apps/web/src/styles', { recursive: true });
for (const [name, root] of modules) {
  // Declarations superseded by the exact same selector/condition cannot affect the final cascade.
  const seen = new Set();
  const rules = []; root.walkRules(rule => rules.push(rule));
  for (const rule of rules.reverse()) {
    const context = rule.parent.type === 'atrule' ? rule.parent.toString().split('{')[0] : '';
    for (const decl of [...rule.nodes].reverse()) {
      if (decl.type !== 'decl') continue;
      const key = [context, rule.selector, decl.prop, decl.important].join('|');
      if (seen.has(key)) decl.remove(); else seen.add(key);
    }
    if (!rule.nodes.length) rule.remove();
  }
  // Rejoin adjacent media conditions, keeping their original order.
  for (const node of [...root.nodes]) {
    const previous = node.prev();
    if (node.type === 'atrule' && previous?.type === 'atrule' && node.name === previous.name && node.params === previous.params) { previous.append(node.nodes); node.remove(); }
  }
  root.walkAtRules(node => { if (node.nodes && !node.nodes.length) node.remove(); });
  fs.writeFileSync(`apps/web/src/styles/${name}.css`, root.toString().trim() + '\n');
}
fs.writeFileSync(filename, order.map(name => `@import "./styles/${name}.css";`).join('\n') + '\n');
