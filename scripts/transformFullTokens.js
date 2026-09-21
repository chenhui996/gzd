import fs from 'node:fs';
import path from 'node:path';

const TOKEN_GROUPS = ['colors', 'seed', 'map', 'alias', 'static', 'components'];

function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function parseArgs(argv) {
  const args = {};

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (!arg.startsWith('--')) continue;

    const key = arg.slice(2);
    const next = argv[index + 1];

    if (!next || next.startsWith('--')) {
      args[key] = true;
    } else {
      args[key] = next;
      index += 1;
    }
  }

  return args;
}

function normalizeMode(mode) {
  if (!mode) return mode;
  return `${mode.charAt(0).toUpperCase()}${mode.slice(1).toLowerCase()}`;
}

function upperFirst(value) {
  return `${value.charAt(0).toUpperCase()}${value.slice(1)}`;
}

function tokenNameFromPath(pathParts) {
  if (pathParts.length <= 1) {
    return pathParts[0];
  }

  return `${pathParts[0]}${pathParts.slice(1).map(upperFirst).join('')}`;
}

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, 'utf-8'));
}

function findTokenFile(tokensDir, group, mode) {
  const modeName = normalizeMode(mode);
  const candidates = [
    path.join(tokensDir, group, `${modeName}.tokens.json`),
    path.join(tokensDir, `${group}-${modeName}.tokens.json`),
  ];

  return candidates.find((file) => fs.existsSync(file));
}

function countTokenLeaves(obj) {
  let count = 0;

  const walk = (node) => {
    if (!node || typeof node !== 'object') return;

    for (const value of Object.values(node)) {
      if (value && typeof value === 'object' && value.$type !== undefined && value.$value !== undefined) {
        count += 1;
      } else {
        walk(value);
      }
    }
  };

  walk(obj);
  return count;
}

function collectUnresolvedAliases(obj, pathParts = [], result = []) {
  if (!obj || typeof obj !== 'object') return result;

  for (const [key, value] of Object.entries(obj)) {
    const nextPath = [...pathParts, key];

    if (typeof value === 'string' && value.startsWith('{') && value.endsWith('}')) {
      result.push({
        path: nextPath.join('.'),
        value,
      });
    } else if (typeof value === 'object' && value !== null) {
      collectUnresolvedAliases(value, nextPath, result);
    }
  }

  return result;
}

// 辅助函数：将 Figma 的 components (0-1) 和 alpha 转换为 rgba 字符串
function rgbaFromComponents(components, alpha) {
  if (!components || components.length !== 3) return null;
  const r = Math.round(components[0] * 255);
  const g = Math.round(components[1] * 255);
  const b = Math.round(components[2] * 255);
  const a = alpha !== undefined ? Number(alpha.toFixed(2)) : 1;
  return `rgba(${r}, ${g}, ${b}, ${a})`;
}

function normalizeTokenValue(key, value) {
  if (value.$type === 'color' && value.$value?.hex) {
    if (value.$value.alpha !== undefined && value.$value.alpha < 1) {
      return rgbaFromComponents(value.$value.components, value.$value.alpha) || value.$value.hex;
    }

    return value.$value.hex;
  }

  if (['number', 'string', 'boolean'].includes(typeof value.$value)) {
    if (key === 'wireframe') {
      return Boolean(value.$value);
    }

    return value.$value;
  }

  return undefined;
}

// 递归遍历 Figma Token JSON 并提取值
function extractValues(obj, result = {}, pathParts = []) {
  for (const [key, value] of Object.entries(obj)) {
    const tokenName = tokenNameFromPath([...pathParts, key]);

    if (value && value.$type !== undefined && value.$value !== undefined) {
      // 优先处理 Figma 的 Alias 引用
      if (
        value.$extensions &&
        value.$extensions['com.figma.aliasData'] &&
        value.$extensions['com.figma.aliasData'].targetVariableName
      ) {
        result[tokenName] = `{${value.$extensions['com.figma.aliasData'].targetVariableName}}`;
      } else if (key === 'descriptionMaxWidth') {
        // 在 Antd v6 的 Steps 组件中，强制注入 descriptionMaxWidth 会破坏连线 flex 计算。
        continue;
      } else if (key === 'radioSize') {
        // radioSize 不应作为全局 token 注入，稍后统一挂到 components.Radio。
        continue;
      } else {
        const normalizedValue = normalizeTokenValue(key, value);
        if (normalizedValue !== undefined) {
          result[tokenName] = normalizedValue;
        }
      }
    } else if (typeof value === 'object' && value !== null) {
      // 如果 key 是首字母大写，通常是组件名，如 Button。
      if (pathParts.length === 0 && /^[A-Z]/.test(key)) {
        result[key] = {};
        extractValues(value, result[key]);
      } else {
        extractValues(value, result, [...pathParts, key]);
      }
    }
  }

  return result;
}

// 辅助函数：解析变量引用 (Alias)，例如 "{screenXS}" 或 "{Slider.controlSize}"
function resolveAliases(themeData) {
  let hasChanges = true;
  let loops = 0;
  const maxLoops = 10;

  const getValueByPath = (rawPath) => {
    const candidatePaths = [rawPath];

    if (rawPath.includes('/')) {
      candidatePaths.push(rawPath.replace(/\//g, ''));
    }

    if (rawPath.includes('.') && !/^[A-Z]/.test(rawPath)) {
      candidatePaths.push(tokenNameFromPath(rawPath.split('.')));
    }

    for (const candidatePath of candidatePaths) {
      if (themeData.token[candidatePath] !== undefined) {
        return themeData.token[candidatePath];
      }
    }

    if (rawPath.includes('.')) {
      const parts = rawPath.split('.');
      let current = themeData.components;

      for (const part of parts) {
        if (current && current[part] !== undefined) {
          current = current[part];
        } else {
          return undefined;
        }
      }

      return current;
    }

    return undefined;
  };

  const processNode = (node) => {
    let changed = false;

    for (const [key, value] of Object.entries(node)) {
      if (typeof value === 'string' && value.startsWith('{') && value.endsWith('}')) {
        const aliasPath = value.slice(1, -1);
        const resolvedValue = getValueByPath(aliasPath);

        if (resolvedValue !== undefined && resolvedValue !== value) {
          node[key] = resolvedValue;
          changed = true;
        }
      } else if (typeof value === 'object' && value !== null) {
        if (processNode(value)) changed = true;
      }
    }

    return changed;
  };

  while (hasChanges && loops < maxLoops) {
    hasChanges = processNode(themeData);
    loops += 1;
  }
}

function trackSourceFile(file, tokensDir, sourceFiles, sourceStats) {
  const rawData = readJson(file);
  sourceFiles.push(path.relative(tokensDir, file));
  sourceStats.leafCount += countTokenLeaves(rawData);
  return rawData;
}

function readColors(tokensDir, mode, themeData, sourceFiles, sourceStats) {
  const colorsFile = findTokenFile(tokensDir, 'colors', mode);
  if (!colorsFile) return;

  const rawData = trackSourceFile(colorsFile, tokensDir, sourceFiles, sourceStats);

  for (const [colorName, colorScale] of Object.entries(rawData)) {
    if (colorName.startsWith('$') || !colorScale || typeof colorScale !== 'object') {
      continue;
    }

    for (const [index, tokenData] of Object.entries(colorScale)) {
      if (!tokenData || typeof tokenData !== 'object' || !tokenData.$value?.hex) {
        continue;
      }

      const tokenName = `${colorName}${index}`;
      themeData.token[tokenName] = normalizeTokenValue(tokenName, tokenData);
    }
  }
}

function readTokenGroup(tokensDir, mode, group, themeData, sourceFiles, sourceStats) {
  const tokenFile = findTokenFile(tokensDir, group, mode);
  if (!tokenFile) return;

  const rawData = trackSourceFile(tokenFile, tokensDir, sourceFiles, sourceStats);

  if (group === 'components') {
    themeData.components = extractValues(rawData);
  } else {
    Object.assign(themeData.token, extractValues(rawData));
  }
}

function readResponsiveTokens(tokensDir, themeData, sourceFiles, sourceStats) {
  const responsiveDir = path.join(tokensDir, 'responsive');
  if (!fs.existsSync(responsiveDir)) return;

  const responsiveTokens = {};
  const files = fs
    .readdirSync(responsiveDir)
    .filter((file) => file.endsWith('.tokens.json'))
    .sort();

  for (const file of files) {
    const absoluteFile = path.join(responsiveDir, file);
    const rawData = readJson(absoluteFile);
    const tokenName = file.replace(/\.tokens\.json$/, '');
    responsiveTokens[tokenName] = extractValues(rawData);
    sourceFiles.push(path.join('responsive', file));
    sourceStats.leafCount += countTokenLeaves(rawData);
  }

  if (Object.keys(responsiveTokens).length > 0) {
    themeData.custom.responsive = responsiveTokens;
  }
}

function processTheme(mode, tokensDir) {
  const modeName = normalizeMode(mode);
  const sourceFiles = [];
  const sourceStats = {
    leafCount: 0,
  };
  const themeData = {
    token: {},
    components: {},
    custom: {},
  };

  readColors(tokensDir, modeName, themeData, sourceFiles, sourceStats);

  for (const group of TOKEN_GROUPS.filter((item) => !['colors', 'components'].includes(item))) {
    readTokenGroup(tokensDir, modeName, group, themeData, sourceFiles, sourceStats);
  }

  readTokenGroup(tokensDir, modeName, 'components', themeData, sourceFiles, sourceStats);
  readResponsiveTokens(tokensDir, themeData, sourceFiles, sourceStats);

  if (!themeData.components.Radio) {
    themeData.components.Radio = {};
  }
  themeData.components.Radio.radioSize = 16;

  if (themeData.token.radioSize !== undefined) {
    delete themeData.token.radioSize;
  }

  if (themeData.components.Timeline && themeData.components.Timeline.dotBg !== undefined) {
    delete themeData.components.Timeline.dotBg;
  }

  resolveAliases(themeData);
  const unresolvedAliases = collectUnresolvedAliases(themeData);

  return {
    ...themeData,
    meta: {
      mode: modeName,
      sourceFiles,
      sourceLeafCount: sourceStats.leafCount,
      tokenCount: Object.keys(themeData.token).length,
      componentCount: Object.keys(themeData.components).length,
      customGroups: Object.keys(themeData.custom),
      unresolvedAliasCount: unresolvedAliases.length,
      unresolvedAliases,
    },
  };
}

function resolveAlgorithmExpression(algorithm) {
  if (!algorithm || algorithm === 'none') {
    return null;
  }

  if (algorithm === 'dark') {
    return 'theme.darkAlgorithm';
  }

  if (algorithm === 'default') {
    return 'theme.defaultAlgorithm';
  }

  throw new Error(`Unsupported algorithm: ${algorithm}`);
}

function writeNamedTheme({ name, outputDir, themeData, algorithm }) {
  ensureDir(outputDir);

  const exportName = `${name}Tokens`;
  const configName = `${name}Config`;
  const customName = `${name}CustomTokens`;
  const algorithmExpression = resolveAlgorithmExpression(algorithm);
  const themeImport = algorithmExpression ? "import { theme } from 'antd';\n" : '';
  const algorithmLine = algorithmExpression ? `  algorithm: ${algorithmExpression},\n` : '';

  fs.writeFileSync(path.join(outputDir, 'tokens.json'), `${JSON.stringify(themeData, null, 2)}\n`, 'utf-8');

  fs.writeFileSync(
    path.join(outputDir, `${exportName}.ts`),
    `export const ${exportName} = ${JSON.stringify(themeData, null, 2)};\n`,
    'utf-8',
  );

  fs.writeFileSync(
    path.join(outputDir, `${configName}.ts`),
    `${themeImport}import type { ThemeConfig } from 'antd/es/config-provider/context';\nimport { ${exportName} } from './${exportName}';\n\nexport const ${configName}: ThemeConfig = {\n${algorithmLine}  token: ${exportName}.token as ThemeConfig['token'],\n  components: ${exportName}.components as ThemeConfig['components'],\n};\n\nexport const ${customName} = ${exportName}.custom;\n`,
    'utf-8',
  );

  fs.writeFileSync(
    path.join(outputDir, 'index.ts'),
    `export { ${exportName} } from './${exportName}';\nexport { ${configName}, ${customName} } from './${configName}';\n`,
    'utf-8',
  );
}

function writeSummary(themeData, tokensDir, outputDir) {
  const summary = {
    source: path.relative(process.cwd(), tokensDir) || '.',
    output: path.relative(process.cwd(), outputDir) || '.',
    mode: themeData.meta.mode,
    files: themeData.meta.sourceFiles.length,
    sourceTokenLeaves: themeData.meta.sourceLeafCount,
    tokens: themeData.meta.tokenCount,
    components: themeData.meta.componentCount,
    customGroups: themeData.meta.customGroups,
    unresolvedAliases: themeData.meta.unresolvedAliasCount,
  };

  console.log(JSON.stringify(summary, null, 2));
}

function requireArg(args, name) {
  const value = args[name];

  if (typeof value !== 'string' || !value.trim()) {
    throw new Error(`--${name} is required`);
  }

  return value;
}

function runNamed(args) {
  const sourceDir = path.resolve(process.cwd(), requireArg(args, 'source'));
  const outputDir = path.resolve(process.cwd(), requireArg(args, 'output'));
  const mode = normalizeMode(requireArg(args, 'mode'));
  const name = requireArg(args, 'name');
  const algorithm = args.algorithm || 'none';

  const missingGroups = TOKEN_GROUPS.filter((group) => !findTokenFile(sourceDir, group, mode));

  if (missingGroups.length > 0) {
    throw new Error(`Missing token files for groups: ${missingGroups.join(', ')}`);
  }

  const themeData = processTheme(mode, sourceDir);

  if (themeData.meta.unresolvedAliasCount > 0) {
    const unresolvedList = themeData.meta.unresolvedAliases
      .map(({ path: tokenPath, value }) => `${tokenPath}=${value}`)
      .join(', ');

    throw new Error(
      `Unresolved token aliases in ${name}: ${unresolvedList}`,
    );
  }

  writeNamedTheme({ name, outputDir, themeData, algorithm });
  writeSummary(themeData, sourceDir, outputDir);
}

const cliArgs = parseArgs(process.argv.slice(2));
runNamed(cliArgs);
