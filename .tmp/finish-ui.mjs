import fs from 'node:fs';
import postcss from 'postcss';
import prettier from 'prettier';

const deadClasses = ['reading-intro', 'reading-meta', 'date-label', 'reading-close', 'tiny-line', 'reflection-heading'];
for (const name of fs.readdirSync('apps/web/src/styles')) {
  const file = 'apps/web/src/styles/' + name;
  const root = postcss.parse(fs.readFileSync(file, 'utf8'));
  root.walkRules(rule => {
    const selectors = rule.selectors.filter(selector => selector.trim() && !deadClasses.some(value => new RegExp(`\\.${value}(?![\\w-])`).test(selector)));
    if (!selectors.length) { rule.remove(); return; }
    rule.selectors = selectors;
  });
  root.walkAtRules(rule => { if (rule.nodes && !rule.nodes.length) rule.remove(); });
  // Adjacent rules can be joined without altering their place in the cascade.
  root.walkRules(rule => {
    const previous = rule.prev();
    if (previous?.type === 'rule' && rule.selector === previous.selector) {
      previous.append(rule.nodes); rule.remove();
    }
  });
  fs.writeFileSync(file, await prettier.format(root.toString(), { parser: 'css' }));
}
const source = 'apps/web/src';
for (const file of fs.readdirSync(source, { recursive: true })) {
  if (!file.endsWith('.tsx') || file.endsWith('.test.tsx') || ['context.tsx', 'local-app.tsx', 'redirect.tsx'].includes(file)) continue;
  const full = source + '/' + file;
  fs.writeFileSync(full, await prettier.format(fs.readFileSync(full, 'utf8'), { parser: 'typescript' }));
}
