// #!/usr/bin/env bun

// /**
//  * 🎨 Script de Génération des Composants Sandpack
//  * 
//  * Usage: bun run scripts/generate-sandpack-components.ts
//  * 
//  * Ce script :
//  * 1. Lit tous les composants de /components/ui et /modules/misc/components
//  * 2. Convertit le code TypeScript + SCSS en code compatible Sandpack
//  * 3. Génère les fichiers *-code.tsx dans components-code/
//  * 4. Génère l'index.ts avec le mapping complet
//  */

// import { existsSync } from 'fs';
// import { join } from 'path';

// // Configuration des composants à générer
// const COMPONENTS_CONFIG = [
//     {
//         name: 'button',
//         sourcePath: 'frontend/src/components/ui/button/button.tsx',
//         scssPath: 'frontend/src/components/ui/button/button.module.scss',
//         dependencies: ['@radix-ui/react-slot', 'class-variance-authority'],
//     },
//     {
//         name: 'dialog',
//         sourcePath: 'frontend/src/modules/misc/components/dialog/dialog.tsx',
//         scssPath: 'frontend/src/modules/misc/components/dialog/dialog.module.scss',
//         dependencies: ['@radix-ui/react-dialog'],
//     },
//     {
//         name: 'badge',
//         sourcePath: 'frontend/src/components/ui/badge/badge.tsx',
//         scssPath: 'frontend/src/components/ui/badge/badge.module.scss',
//         dependencies: [],
//     },
//     {
//         name: 'input',
//         sourcePath: 'frontend/src/components/ui/form/base-fields/input/input.tsx',
//         scssPath: 'frontend/src/components/ui/form/base-fields/input/input.module.scss',
//         dependencies: [],
//     },
//     {
//         name: 'textarea',
//         sourcePath: 'frontend/src/components/ui/form/base-fields/textarea/textarea.tsx',
//         scssPath: 'frontend/src/components/ui/form/base-fields/textarea/textarea.module.scss',
//         dependencies: [],
//     },
//     {
//         name: 'label',
//         sourcePath: 'frontend/src/components/ui/form/label/label.tsx',
//         scssPath: 'frontend/src/components/ui/form/label/label.module.scss',
//         dependencies: ['@radix-ui/react-label'],
//     },
//     {
//         name: 'switch',
//         sourcePath: 'frontend/src/components/ui/form/base-fields/switch/switch.tsx',
//         scssPath: 'frontend/src/components/ui/form/base-fields/switch/switch.module.scss',
//         dependencies: ['@radix-ui/react-switch'],
//     },
//     {
//         name: 'separator',
//         sourcePath: 'frontend/src/modules/misc/components/separator/separator.tsx',
//         scssPath: 'frontend/src/modules/misc/components/separator/separator.module.scss',
//         dependencies: ['@radix-ui/react-separator'],
//     },
//     {
//         name: 'tabs',
//         sourcePath: 'frontend/src/components/ui/tabs/tabs.tsx',
//         scssPath: 'frontend/src/components/ui/tabs/tabs.module.scss',
//         dependencies: ['@radix-ui/react-tabs'],
//     },
//     {
//         name: 'dropdown-menu',
//         sourcePath: 'frontend/src/modules/misc/components/dropdown-menu/dropdown-menu.tsx',
//         scssPath: 'frontend/src/modules/misc/components/dropdown-menu/dropdown-menu.module.scss',
//         dependencies: ['@radix-ui/react-dropdown-menu'],
//     },
//     {
//         name: 'tooltip',
//         sourcePath: 'frontend/src/components/ui/tooltip/tooltip.tsx',
//         scssPath: 'frontend/src/components/ui/tooltip/tooltip.module.scss',
//         dependencies: ['@radix-ui/react-tooltip'],
//     },
//     {
//         name: 'popover',
//         sourcePath: 'frontend/src/components/ui/popover/popover.tsx',
//         scssPath: 'frontend/src/components/ui/popover/popover.module.scss',
//         dependencies: ['@radix-ui/react-popover'],
//     },
//     {
//         name: 'checkbox',
//         sourcePath: 'frontend/src/components/ui/form/base-fields/checkbox/checkbox.tsx',
//         scssPath: 'frontend/src/components/ui/form/base-fields/checkbox/checkbox.module.scss',
//         dependencies: ['@radix-ui/react-checkbox'],
//     },
//     {
//         name: 'select',
//         sourcePath: 'frontend/src/components/ui/form/base-fields/select/select.tsx',
//         scssPath: 'frontend/src/components/ui/form/base-fields/select/select.module.scss',
//         dependencies: ['@radix-ui/react-select'],
//     },
// ];

// const OUTPUT_DIR = 'frontend/src/modules/view/page-editor/page-renderer/components-code';

// /**
//  * Nettoie le code TypeScript pour être compatible Sandpack
//  */
// function cleanTSXCode(code: string): string {
//     let cleaned = code;
    
//     // Retirer les imports de SCSS
//     cleaned = cleaned.replace(/import\s+.*\.s?css['"];?\n?/g, '');
    
//     // Retirer "use client"
//     cleaned = cleaned.replace(/["']use client["'];?\n?/g, '');
    
//     // Retirer l'import de cn et ajouter le helper
//     if (cleaned.includes('cn(')) {
//         cleaned = cleaned.replace(/import\s*{\s*cn\s*}\s*from\s*['"].*utils['"];?\n?/g, '');
//         const cnHelper = `// Helper cn
// const cn = (...classes: any[]) => classes.filter(Boolean).join(' ');
// `;
//         cleaned = cnHelper + '\n' + cleaned;
//     }
    
//     // Remplacer les références à styles.xxx par des strings de classe
//     cleaned = cleaned.replace(/styles\.(\w+)/g, '"$1"');
    
//     return cleaned.trim();
// }

// /**
//  * Convertit SCSS en CSS simple
//  */
// function convertSCSSToCSS(scss: string, componentName: string): string {
//     let css = scss;
    
//     // Remplacer les variables SCSS par des valeurs hardcodées (temporaire)
//     css = css.replace(/var\(--([^)]+)\)/g, (match, varName) => {
//         // Map des variables communes
//         const varsMap: Record<string, string> = {
//             'text-sm': '14px',
//             'text-sm--line-height': '1.5',
//             'surface-primary': '#6366f1',
//             'text-primary-foreground': 'white',
//             'border-primary': '#6366f1',
//             'surface-danger': '#ef4444',
//             'border-color-standard': '#d1d5db',
//             // Ajouter d'autres variables au besoin
//         };
//         return varsMap[varName] || match;
//     });
    
//     // Retirer le nesting SCSS (conversion basique)
//     // On garde juste les sélecteurs de classe principaux
    
//     return css;
// }

// /**
//  * Génère un fichier *-code.tsx
//  */
// async function generateComponentCode(config: typeof COMPONENTS_CONFIG[0]) {
//     const { name, sourcePath, scssPath } = config;
    
//     console.log(`📝 Génération de ${name}-code.tsx...`);
    
//     // Lire le fichier source TypeScript
//     const tsxPath = join(import.meta.dir, '..', sourcePath);
//     if (!existsSync(tsxPath)) {
//         console.warn(`⚠️  Fichier non trouvé: ${sourcePath}`);
//         return null;
//     }
    
//     const tsxFile = Bun.file(tsxPath);
//     const tsxCode = await tsxFile.text();
    
//     // Nettoyer le code
//     const cleanedCode = cleanTSXCode(tsxCode);
    
//     // Générer le fichier de sortie
//     const outputContent = `export const ${name.replace(/-/g, '')}Code = \`${cleanedCode}\`;
// `;
    
//     const outputPath = join(import.meta.dir, '..', OUTPUT_DIR, `${name}-code.tsx`);
//     await Bun.write(outputPath, outputContent);
    
//     console.log(`  ✅ ${name}-code.tsx créé`);
    
//     return {
//         name,
//         varName: `${name.replace(/-/g, '')}Code`,
//         dependencies: config.dependencies,
//     };
// }

// /**
//  * Génère le fichier index.ts
//  */
// async function generateIndex(components: Array<{ name: string; varName: string; dependencies: string[] }>) {
//     const imports = components
//         .map(c => `export { ${c.varName} } from './${c.name}-code';`)
//         .join('\n');
    
//     const componentMap = components
//         .map(c => `  '${c.name}': ${c.varName},`)
//         .join('\n');
    
//     const dependenciesMap = components
//         .map(c => `  '${c.name}': [${c.dependencies.map(d => `'${d}'`).join(', ')}],`)
//         .join('\n');
    
//     const indexContent = `// 🎨 Index des Composants Sandpack
// // ⚠️  Auto-généré par scripts/generate-sandpack-components.ts
// // Ne pas modifier manuellement - Exécuter: bun run scripts/generate-sandpack-components.ts

// ${imports}

// // Map de tous les composants disponibles
// export const SANDPACK_COMPONENTS = {
// ${componentMap}
// } as const;

// // Dépendances npm requises pour chaque composant
// export const SANDPACK_DEPENDENCIES = {
// ${dependenciesMap}
// } as const;

// // Type pour l'autocomplétion
// export type SandpackComponentName = keyof typeof SANDPACK_COMPONENTS;

// // Fonction helper pour obtenir toutes les dépendances d'une liste de composants
// export function getSandpackDependencies(componentNames: SandpackComponentName[]): Record<string, string> {
//   const allDeps = new Set<string>();
  
//   componentNames.forEach(name => {
//     SANDPACK_DEPENDENCIES[name]?.forEach(dep => allDeps.add(dep));
//   });
  
//   const depsRecord: Record<string, string> = {};
//   allDeps.forEach(dep => {
//     depsRecord[dep] = 'latest';
//   });
  
//   return depsRecord;
// }
// `;
    
//     const indexPath = join(import.meta.dir, '..', OUTPUT_DIR, 'index.ts');
//     await Bun.write(indexPath, indexContent);
    
//     console.log(`\n✅ index.ts créé avec ${components.length} composants`);
// }

// /**
//  * Main
//  */
// async function main() {
//     console.log('🚀 Génération des composants Sandpack...\n');
    
//     // Générer tous les composants
//     const results = await Promise.all(
//         COMPONENTS_CONFIG.map(config => generateComponentCode(config))
//     );
    
//     // Filtrer les null (composants non trouvés)
//     const validComponents = results.filter((r): r is NonNullable<typeof r> => r !== null);
    
//     // Générer l'index
//     await generateIndex(validComponents);
    
//     console.log(`\n🎉 Terminé ! ${validComponents.length} composants générés.`);
//     console.log(`📁 Emplacement: ${OUTPUT_DIR}`);
//     console.log(`\n💡 Utilisation dans Sandpack:`);
//     console.log(`   import { SANDPACK_COMPONENTS, getSandpackDependencies } from './components-code';`);
//     console.log(`   const deps = getSandpackDependencies(['button', 'dialog', 'input']);`);
// }

// main().catch(console.error);

