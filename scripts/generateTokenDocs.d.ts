export interface TokenDocumentationInventory {
  global: string[];
  components: string[];
  componentGroups: string[];
  custom: string[];
  agGrid: string[];
}

export interface TokenDocumentationResult {
  files: Record<string, string>;
  inventory: TokenDocumentationInventory;
}

export declare const toKebabCase: (value: string) => string;
export declare const flattenTokenValues: (
  value: unknown,
  pathParts?: string[],
  result?: Array<{ pathParts: string[]; value: unknown }>,
) => Array<{ pathParts: string[]; value: unknown }>;
export declare const buildTokenDocumentation: () => TokenDocumentationResult;
export declare const generateTokenDocumentation: (options?: {
  check?: boolean;
}) => TokenDocumentationResult & { staleFiles: string[] };
