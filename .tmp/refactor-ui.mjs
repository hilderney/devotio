import fs from 'node:fs';
import path from 'node:path';
import ts from 'typescript';

const root = 'apps/web/src';
const files = fs.readdirSync(root, { recursive: true }).filter(file => file.endsWith('.tsx') && !file.includes('.test.') && !file.startsWith('ui'));
for (const file of files) {
  const filename = path.join(root, file);
  let source = fs.readFileSync(filename, 'utf8');
  const ast = ts.createSourceFile(filename, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  const edits = [];
  const imports = new Set();
  let picker = false;
  function visit(node) {
    if (ts.isJsxElement(node)) {
      const opening = node.openingElement;
      const tag = opening.tagName.getText(ast);
      const attribute = opening.attributes.properties.find(attr => ts.isJsxAttribute(attr) && attr.name.getText(ast) === 'className');
      const classes = attribute && attribute.initializer && ts.isStringLiteral(attribute.initializer) ? attribute.initializer.text.split(' ') : [];
      const has = value => classes.includes(value);
      const isButton = tag === 'button';
      const isLink = tag === 'Link' && has('button');
      const specialized = file === 'dropdown.tsx' || has('profile-card') || (file.endsWith('reading.tsx') && !attribute);
      if (isLink || (isButton && !specialized)) {
        let variant = has('secondary') ? 'secondary' : has('text-button') || has('icon-button') || has('selection-action') || has('form-button') || (!attribute && file === 'router.tsx') ? 'ghost' : 'primary';
        const icon = has('icon-button') || has('reading-action-icon') || has('audio-toggle');
        const floating = has('bible-picker-return');
        if (has('reading-action-icon') || floating) variant = 'secondary';
        if (file.endsWith('devotional-editor.tsx') && !floating) {
          const type = opening.attributes.properties.find(attr => ts.isJsxAttribute(attr) && attr.name.getText(ast) === 'type');
          variant = type?.initializer?.getText(ast) === '"submit"' ? 'primary' : 'secondary';
        }
        const remaining = classes.filter(value => !['button', 'secondary', 'small', 'text-button', 'icon-button', 'form-button', 'reading-action-icon', 'reading-favorite-toggle', 'selection-close', 'selection-toggle'].includes(value));
        if (has('form-button')) remaining.push('reading-tab');
        let appearance = [variant !== 'primary' ? `variant="${variant}"` : '', has('small') ? 'size="compact"' : '', remaining.length ? `className="${remaining.join(' ')}"` : ''].filter(Boolean).join(' ');
        if (isLink) {
          imports.add('buttonClassName');
          appearance = `className={buttonClassName({${variant !== 'primary' ? ` variant: "${variant}",` : ''}${has('small') ? ' size: "compact",' : ''}${remaining.length ? ` className: "${remaining.join(' ')}",` : ''} })}`;
        } else {
          const component = floating ? 'BiblePickerButton' : icon ? 'IconButton' : 'Button';
          if (floating) { picker = true; appearance = ''; } else imports.add(component);
          edits.push([opening.tagName.getStart(ast), opening.tagName.end, component]);
          edits.push([node.closingElement.tagName.getStart(ast), node.closingElement.tagName.end, component]);
          if (file === 'components.tsx' && has('button')) appearance += ' type="submit"';
        }
        if (attribute) edits.push([attribute.getStart(ast), attribute.end, appearance]);
        else if (appearance) edits.push([opening.tagName.end, opening.tagName.end, ' ' + appearance]);
      }
    }
    ts.forEachChild(node, visit);
  }
  visit(ast);
  for (const [start, end, replacement] of edits.sort((a,b) => b[0] - a[0])) source = source.slice(0,start) + replacement + source.slice(end);
  const prefix = file.includes(path.sep) || file.includes('/') ? '../' : './';
  if (imports.size) source = `import { ${[...imports].join(', ')} } from "${prefix}ui/button";\n` + source;
  if (picker) source = `import { BiblePickerButton } from "${prefix}ui/bible-picker-button";\n` + source;
  fs.writeFileSync(filename, source);
}

// Keep the route table separate from the authenticated reading layout.
const routerFile = path.join(root, 'router.tsx');
let router = fs.readFileSync(routerFile, 'utf8');
const shellStart = router.indexOf('function ReaderLayout()');
const shellEnd = router.indexOf('const rootRoute =');
let shell = router.slice(shellStart, shellEnd).replace('function ReaderLayout()', 'export function ReaderLayout()');
shell = `import { useEffect, useRef, useState, type CSSProperties } from "react";
import { Link, Outlet, useLocation, useMatches } from "@tanstack/react-router";
import { BookOpen, BookText, Users, ArrowUpRight, Leaf } from "lucide-react";
import { RepositoryProvider, useHome, useLocalDate } from "domain/react";
import { loginDestination, type Devotional } from "domain/core";
import { useApp, ReaderContext, AudioSelectionContext } from "./context";
import { Brand, AudioPlayer } from "./components";
import { RouteRedirect } from "./redirect";
import { NotificationsBell } from "./notifications";
import { useCompactHeader } from "./compact-header";
import { AccountMenu } from "./account-menu";

` + shell;
shell = shell.replace(/  const \[logoutError[^\n]*\n  const \[settingsOpen[^\n]*\n  const \[refreshing[^\n]*\n  const \[refreshError[^\n]*\n/, '');
shell = shell.replace(/  const accountMenu[^\n]*\n/, '');
const effectStart = shell.indexOf('  useEffect(() => {\n    const outside');
const effectEnd = shell.indexOf('  const audio =', effectStart);
shell = shell.slice(0, effectStart) + shell.slice(effectEnd);
const accountStart = shell.indexOf('          <details className="account-menu"');
const accountEnd = shell.indexOf('          </details>', accountStart) + '          </details>'.length;
shell = shell.slice(0, accountStart) + '          <AccountMenu name={home.data?.user.name} />' + shell.slice(accountEnd);
shell = shell.replace('      {settingsOpen && <SettingsModal onClose={() => setSettingsOpen(false)} />}\n', '');
fs.writeFileSync(path.join(root, 'reader-shell.tsx'), shell);
router = router.slice(0, shellStart) + router.slice(shellEnd);
router = router.replace('useEffect, useRef, useState, type CSSProperties', 'useEffect, useState');
router = router.replace('  useMatches,\n', '');
router = router.replace(/import \{\n  BookOpen,[\s\S]*?\} from "lucide-react";/, 'import { WifiOff } from "lucide-react";');
router = router.replace(/import \{ RepositoryProvider[^\n]*\n/, '');
router = router.replace('loginDestination, ', '').replace(', canPublish, type Devotional', '');
router = router.replace('  ReaderContext,\n  AudioSelectionContext,\n', '');
router = router.replace('Brand, Loading, AudioPlayer, ErrorMessage', 'Brand, Loading');
router = router.replace(/import \{ NotificationsBell[^\n]*\nimport \{ SettingsModal[^\n]*\nimport \{ useCompactHeader[^\n]*\n/, 'import { ReaderLayout } from "./reader-shell";\n');
// Button migrated in the shell is now owned by AccountMenu.
router = router.replace('import { Button, buttonClassName }', 'import { buttonClassName }');
fs.writeFileSync(routerFile, router);
