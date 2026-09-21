import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { isDeepStrictEqual } from 'node:util';

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const modeFiles = ['Dark.tokens.json', 'Light.tokens.json'];
const groupFiles = {
  colors: modeFiles,
  seed: modeFiles,
  map: modeFiles,
  alias: modeFiles,
  static: modeFiles,
  components: modeFiles,
  responsive: [
    'Mobile.tokens.json',
    'Tablet.tokens.json',
    'Desktop SM.tokens.json',
    'Desktop.tokens.json',
  ],
};
const generatedPaths = [
  'gzd-design-tokens',
  'docs/tokens.md',
  'docs/tokens/components.md',
  'docs/tokens/custom.md',
  'docs/tokens/ag-grid-table.md',
];

const help = `用法：npm run tokens:import -- "UI 交付包目录" [--theme gold|blue] [--dry-run]

自动导入交付目录下 gold-theme、blue-theme 子目录中的所有主题，并自动生成
Token 和对应文档，无需另外执行生成命令。每个主题需包含 colors、seed、map、alias、static、
components、responsive 七个同名 ZIP 或已解压的分组目录。
也支持直接传入 gold-theme/blue-theme 目录；无主题标识的单主题包需用 --theme 指定。
AG Grid 使用独立交付流程，不在此命令的导入范围内。

  --theme gold|blue  仅为无主题标识的单主题包指定归属；多主题包无需此参数
  --dry-run          只校验并列出源文件差异，不写文件、不执行生成
  --help             显示帮助

ZIP 读取依赖系统 unzip（macOS 自带）；不会向交付包或仓库解压临时文件。`;

function parseArgs(argv) {
  const options = { dryRun: false };
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === '--help' || arg === '-h') options.help = true;
    else if (arg === '--dry-run') options.dryRun = true;
    else if (arg === '--theme') {
      options.theme = argv[++index];
      if (!options.theme || options.theme.startsWith('-')) throw new Error('--theme 需要 gold 或 blue');
    }
    else if (arg.startsWith('-')) throw new Error(`未知参数：${arg}`);
    else if (!options.source) options.source = arg;
    else throw new Error(`多余的路径参数：${arg}（含空格的路径请加引号）`);
  }
  if (options.help) return options;
  if (!options.source) throw new Error(`请提供 UI 交付包目录。\n${help}`);
  if (options.theme !== undefined && !['gold', 'blue'].includes(options.theme)) {
    throw new Error('--theme 只支持 gold 或 blue');
  }
  return options;
}

function unzip(args) {
  try {
    return execFileSync('unzip', args, {
      encoding: 'utf8',
      maxBuffer: 32 * 1024 * 1024,
      stdio: ['ignore', 'pipe', 'pipe'],
    });
  } catch (error) {
    if (error.code === 'ENOENT') throw new Error('读取 ZIP 需要系统 unzip，请安装后重试。');
    throw new Error(`无法读取 ZIP：${error.stderr?.toString().trim() || error.message}`);
  }
}

function isMetadata(name) {
  return name.split('/').some((part) => part === '__MACOSX' || part.startsWith('.'));
}

function readGroup(source, group, expected) {
  const archive = path.join(source, `${group}.zip`);
  const directory = path.join(source, group);
  if (fs.existsSync(archive) && fs.existsSync(directory)) {
    throw new Error(`${group} 同时存在 ZIP 和目录，请只保留一个来源。`);
  }
  let entries;
  let read;
  if (fs.existsSync(archive)) {
    entries = unzip(['-Z1', archive]).split(/\r?\n/).filter(Boolean);
    // 只通过 stdout 读取指定条目，不解压路径；同时拒绝越界路径及 unzip 通配符。
    for (const name of entries) {
      if (name.startsWith('/') || name.split('/').includes('..') || /[\\*?\[\]\u0000-\u001f]/.test(name)) {
        throw new Error(`${group}.zip 包含不支持的路径：${name}`);
      }
    }
    entries = entries.filter((name) => !name.endsWith('/') && !isMetadata(name));
    read = (name) => unzip(['-p', archive, name]);
  } else if (fs.existsSync(directory) && fs.statSync(directory).isDirectory()) {
    entries = fs.readdirSync(directory).filter((name) => !isMetadata(name));
    read = (name) => fs.readFileSync(path.join(directory, name), 'utf8');
  } else {
    throw new Error(`缺少分组：${group}.zip 或 ${group}/`);
  }

  const files = new Map();
  for (const entry of entries) {
    const name = path.posix.basename(entry);
    if (!expected.includes(name)) throw new Error(`${group} 中有未知文件：${entry}`);
    if (files.has(name)) throw new Error(`${group} 中有重复文件：${name}`);
    files.set(name, entry);
  }
  const missing = expected.filter((name) => !files.has(name));
  if (missing.length) throw new Error(`${group} 缺少文件：${missing.join('、')}`);

  return expected.map((name) => {
    const label = `${group}/${name}`;
    let data;
    try {
      data = JSON.parse(read(files.get(name)).replace(/^\uFEFF/, ''));
    } catch (error) {
      throw new Error(`${label} 读取或 JSON 解析失败：${error.message}`);
    }
    let leaves = 0;
    const walk = (node, tokenPath) => {
      if (!node || typeof node !== 'object' || Array.isArray(node)) {
        throw new Error(`${label} 的 ${tokenPath} 不是 Token 对象。`);
      }
      if ('$value' in node) {
        if (typeof node.$type !== 'string' || node.$value === null) {
          throw new Error(`${label} 的 ${tokenPath} 缺少有效的 $type/$value。`);
        }
        leaves += 1;
        return;
      }
      for (const [key, value] of Object.entries(node)) {
        if (!key.startsWith('$')) walk(value, `${tokenPath}.${key}`);
      }
    };
    walk(data, group);
    if (!leaves) throw new Error(`${label} 没有 Token。`);
    return { relative: label, content: `${JSON.stringify(data, null, 2)}\n`, leaves };
  });
}

function identifyTheme(name) {
  return /^(gold|blue)(?:-theme)?$/i.exec(name)?.[1].toLowerCase();
}

function discoverThemes(input, explicitTheme) {
  const entries = fs.readdirSync(input, { withFileTypes: true }).filter((entry) => !isMetadata(entry.name));
  const themes = [];
  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    const theme = identifyTheme(entry.name);
    if (theme) themes.push({ theme, directory: path.join(input, entry.name) });
    else if (entry.name.endsWith('-theme') || (!Object.hasOwn(groupFiles, entry.name)
      && fs.readdirSync(path.join(input, entry.name)).some((name) => Object.hasOwn(groupFiles, name.replace(/\.zip$/, ''))))) {
      throw new Error(`不支持的主题目录：${entry.name}。请使用 gold-theme 或 blue-theme 标识，当前仓库只支持 Gold、Blue。`);
    }
  }
  if (themes.length) {
    if (explicitTheme) throw new Error('多主题交付目录会自动导入所有主题，请移除 --theme。');
    if (entries.some((entry) => entry.name.endsWith('.zip') || Object.hasOwn(groupFiles, entry.name))) {
      throw new Error('主题目录与根目录分组混在一起，请将分组文件放入对应主题目录。');
    }
    if (new Set(themes.map((item) => item.theme)).size !== themes.length) {
      throw new Error('存在重复的主题目录，请为每个主题只保留一个来源。');
    }
    return themes.sort((a, b) => a.theme.localeCompare(b.theme));
  }
  const namedTheme = identifyTheme(path.basename(input));
  if (explicitTheme && namedTheme && explicitTheme !== namedTheme) {
    throw new Error('--theme 与交付目录的主题标识不一致。');
  }
  const theme = namedTheme || explicitTheme;
  if (!theme) {
    throw new Error('交付包没有 Gold/Blue 主题标识。请按 gold-theme/blue-theme 子目录组织；单主题旧包可用 --theme gold 或 --theme blue 指定归属。');
  }
  return [{ theme, directory: input }];
}

function planTheme(input, theme, projectRoot) {
  for (const name of fs.readdirSync(input)) {
    if (!isMetadata(name) && name.toLowerCase().endsWith('.zip') && !Object.hasOwn(groupFiles, name.slice(0, -4))) {
      throw new Error(`未知分组 ZIP：${name}。本命令只导入七个主主题分组。`);
    }
  }
  const files = Object.entries(groupFiles).flatMap(([group, expected]) => readGroup(input, group, expected));
  return files.map((file) => {
    const relative = `gzd-design-tokens-origin/${theme}-theme/${file.relative}`;
    const target = path.join(projectRoot, relative);
    const previous = fs.existsSync(target) ? fs.readFileSync(target, 'utf8') : undefined;
    let changed = true;
    try {
      // 忽略交付格式中的缩进和键顺序差异，避免整包产生无意义的 Git diff。
      changed = !isDeepStrictEqual(JSON.parse(previous), JSON.parse(file.content));
    } catch {
      // 尚不存在或已损坏的目标文件需要由通过校验的交付内容替换。
    }
    return { ...file, theme, relative, target, changed };
  });
}

// 所有主题完成校验后才允许写入，避免某个主题失败时已导入另一个主题。
export function planImport(source, theme, projectRoot = rootDir) {
  if (theme !== undefined && !['gold', 'blue'].includes(theme)) throw new Error('目标主题只支持 gold 或 blue');
  const input = path.resolve(source);
  if (!fs.existsSync(input) || !fs.statSync(input).isDirectory()) {
    throw new Error(`交付包目录不存在：${input}`);
  }
  return discoverThemes(input, theme).flatMap((item) => {
    try {
      return planTheme(item.directory, item.theme, projectRoot);
    } catch (error) {
      throw new Error(`${item.theme}-theme 校验失败：${error.message}`);
    }
  });
}

export function importTokens({ source, theme, dryRun = false, projectRoot = rootDir }) {
  const files = planImport(source, theme, projectRoot);
  const changed = files.filter((file) => file.changed);
  const themes = [...new Set(files.map((file) => `${file.theme}-theme`))];
  console.log(`导入目标：${themes.join('、')}；已校验 ${files.length} 个文件，${changed.length} 个需要更新。`);
  for (const file of changed) console.log(`  更新 ${file.relative}`);
  if (dryRun) {
    console.log('预览完成：未写入文件，未执行转换（引用与文档校验将在正式生成时执行）。');
    return;
  }

  // 保存调用前的实际文件（包括未提交改动），生成失败时恢复源、产物与文档。
  const backup = fs.mkdtempSync(path.join(os.tmpdir(), 'gzd-token-import-'));
  const targets = [...changed.map((file) => file.relative), ...generatedPaths];
  const snapshots = targets.map((relative, index) => ({
    target: path.join(projectRoot, relative),
    saved: path.join(backup, String(index)),
    existed: fs.existsSync(path.join(projectRoot, relative)),
  }));
  let keepBackup = false;
  try {
    for (const item of snapshots) {
      if (item.existed) fs.cpSync(item.target, item.saved, { recursive: true });
    }
    try {
      for (const file of changed) {
        fs.mkdirSync(path.dirname(file.target), { recursive: true });
        fs.writeFileSync(file.target, file.content, 'utf8');
      }
      console.log('\n> npm run tokens:transform');
      execFileSync('npm', ['run', 'tokens:transform'], { cwd: projectRoot, stdio: 'inherit' });
    } catch (error) {
      const failures = [];
      for (const item of snapshots) {
        try {
          fs.rmSync(item.target, { recursive: true, force: true });
          if (item.existed) {
            fs.mkdirSync(path.dirname(item.target), { recursive: true });
            fs.cpSync(item.saved, item.target, { recursive: true });
          }
        } catch (restoreError) {
          failures.push(`${item.target}: ${restoreError.message}`);
        }
      }
      if (failures.length) {
        keepBackup = true;
        fs.writeFileSync(path.join(backup, 'manifest.json'), JSON.stringify(snapshots, null, 2));
        throw new Error(`导入失败，部分文件恢复失败。备份保留于 ${backup}\n${failures.join('\n')}`);
      }
      throw new Error(`导入或生成失败，已恢复调用前的源文件、生成物和 Token 文档。\n${error.message}\n请按上方错误检查交付 JSON 或 scripts/token-doc-metadata.json 后重试。`);
    }
  } finally {
    if (!keepBackup) fs.rmSync(backup, { recursive: true, force: true });
  }
  console.log(`\n导入完成：${changed.length} 个源文件已更新，主题 Token、Gold AG Grid 和 Token 文档已生成。`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  try {
    const options = parseArgs(process.argv.slice(2));
    if (options.help) console.log(help);
    else importTokens(options);
  } catch (error) {
    console.error(`Token 导入失败：${error.message}`);
    process.exitCode = 1;
  }
}
