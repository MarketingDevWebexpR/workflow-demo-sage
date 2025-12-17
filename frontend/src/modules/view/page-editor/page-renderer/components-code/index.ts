// 🎨 Index des Composants Sandpack - Structure organisée
// Chaque composant a son dossier avec code.tsx + styles.css

// Imports des codes
import { buttonCode } from './button/code';
import { dialogCode } from './dialog/code';
import { badgeCode } from './badge/code';
import { inputCode } from './input/code';
import { labelCode } from './label/code';
import { cardCode } from './card/code';
import { textareaCode } from './textarea/code';
import { switchCode } from './switch/code';
import { separatorCode } from './separator/code';
import { tabsCode } from './tabs/code';

// Imports des styles (raw CSS)
import globalStyles from './global-styles.css?raw';
import buttonStyles from './button/styles.css?raw';
import dialogStyles from './dialog/styles.css?raw';
import badgeStyles from './badge/styles.css?raw';
import inputStyles from './input/styles.css?raw';
import labelStyles from './label/styles.css?raw';
import cardStyles from './card/styles.css?raw';
import textareaStyles from './textarea/styles.css?raw';
import switchStyles from './switch/styles.css?raw';
import separatorStyles from './separator/styles.css?raw';
import tabsStyles from './tabs/styles.css?raw';

// Map de tous les composants disponibles
export const SANDPACK_COMPONENTS = {
  'button': buttonCode,
  'dialog': dialogCode,
  'badge': badgeCode,
  'input': inputCode,
  'label': labelCode,
  'card': cardCode,
  'textarea': textareaCode,
  'switch': switchCode,
  'separator': separatorCode,
  'tabs': tabsCode,
} as const;

// Map de tous les styles CSS
export const SANDPACK_STYLES = {
  'button': buttonStyles,
  'dialog': dialogStyles,
  'badge': badgeStyles,
  'input': inputStyles,
  'label': labelStyles,
  'card': cardStyles,
  'textarea': textareaStyles,
  'switch': switchStyles,
  'separator': separatorStyles,
  'tabs': tabsStyles,
} as const;

// Dépendances npm requises pour chaque composant
export const SANDPACK_DEPENDENCIES = {
  'button': ['@radix-ui/react-slot', 'class-variance-authority'],
  'dialog': ['@radix-ui/react-dialog', 'lucide-react'],
  'badge': [],
  'input': [],
  'label': ['@radix-ui/react-label'],
  'card': [],
  'textarea': [],
  'switch': ['@radix-ui/react-switch'],
  'separator': ['@radix-ui/react-separator'],
  'tabs': ['@radix-ui/react-tabs'],
} as const;

// Type pour l'autocomplétion
export type SandpackComponentName = keyof typeof SANDPACK_COMPONENTS;

// Fonction helper pour obtenir toutes les dépendances d'une liste de composants
export function getSandpackDependencies(componentNames: SandpackComponentName[]): Record<string, string> {
  const allDeps = new Set<string>();
  
  componentNames.forEach(name => {
    SANDPACK_DEPENDENCIES[name]?.forEach(dep => allDeps.add(dep));
  });
  
  const depsRecord: Record<string, string> = {};
  allDeps.forEach(dep => {
    depsRecord[dep] = 'latest';
  });
  
  return depsRecord;
}

// ✅ Fonction helper qui combine AUTOMATIQUEMENT tous les styles disponibles
// Inclut les styles globaux + tous les styles des composants
export function getCombinedStyles(): string {
  const componentsStyles = Object.values(SANDPACK_STYLES).join('\n\n');
  
  return `/* ===== STYLES GLOBAUX ===== */
${globalStyles}

/* ===== STYLES DES COMPOSANTS ===== */
${componentsStyles}`;
}
