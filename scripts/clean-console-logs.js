#!/usr/bin/env node

/**
 * Script pour remplacer automatiquement console.log/error/warn par logger
 * Usage: node scripts/clean-console-logs.js
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Patterns à remplacer
const replacements = [
  // console.log simple
  {
    pattern: /console\.log\((.*?)\)/g,
    replacement: (match, content) => {
      // Si c'est un simple string, utiliser logger.debug
      if (content.trim().startsWith("'") || content.trim().startsWith('"') || content.trim().startsWith('`')) {
        return `logger.debug(${content}, {}, { context: 'auto-cleaned' })`;
      }
      return `logger.debug('Log', { data: ${content} }, { context: 'auto-cleaned' })`;
    }
  },
  // console.error
  {
    pattern: /console\.error\((.*?)\)/g,
    replacement: (match, content) => {
      return `logger.error('Error', new Error(String(${content})), { context: 'auto-cleaned' })`;
    }
  },
  // console.warn
  {
    pattern: /console\.warn\((.*?)\)/g,
    replacement: (match, content) => {
      return `logger.warn(${content}, {}, { context: 'auto-cleaned' })`;
    }
  }
];

// Fichiers à traiter
const filesToProcess = [
  'app/**/*.ts',
  'app/**/*.tsx',
  '!app/**/node_modules/**',
  '!app/**/*.test.ts',
  '!app/**/*.test.tsx'
];

let totalReplacements = 0;
let filesModified = 0;

console.log('🧹 Nettoyage des console.log...\n');

// Trouver tous les fichiers
const files = glob.sync(filesToProcess.join(','), { 
  cwd: process.cwd(),
  ignore: ['node_modules/**', '.next/**', 'dist/**']
});

files.forEach(file => {
  const filePath = path.join(process.cwd(), file);
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;
  let replacementsInFile = 0;

  // Vérifier si le fichier contient déjà logger import
  const hasLoggerImport = content.includes("import logger from '@/lib/logger'");
  const needsLoggerImport = /console\.(log|error|warn)/.test(content);

  // Appliquer les remplacements
  replacements.forEach(({ pattern, replacement }) => {
    const matches = content.match(pattern);
    if (matches) {
      content = content.replace(pattern, replacement);
      replacementsInFile += matches.length;
      modified = true;
    }
  });

  // Ajouter l'import logger si nécessaire
  if (needsLoggerImport && !hasLoggerImport && modified) {
    // Trouver la dernière ligne d'import
    const lines = content.split('\n');
    let lastImportIndex = -1;
    
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].trim().startsWith('import ')) {
        lastImportIndex = i;
      }
    }

    if (lastImportIndex !== -1) {
      lines.splice(lastImportIndex + 1, 0, "import logger from '@/lib/logger'");
      content = lines.join('\n');
    }
  }

  // Sauvegarder si modifié
  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ ${file} (${replacementsInFile} remplacements)`);
    filesModified++;
    totalReplacements += replacementsInFile;
  }
});

console.log(`\n✨ Nettoyage terminé !`);
console.log(`📁 Fichiers modifiés : ${filesModified}`);
console.log(`🔄 Remplacements total : ${totalReplacements}`);

