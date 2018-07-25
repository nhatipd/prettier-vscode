export type ParserOption =
    | 'babylon'
    | 'flow'
    | 'postcss' // deprecated, but may be found in getSupportInfo
    | 'css'
    | 'less'
    | 'scss'
    | 'typescript'
    | 'json'
    | 'json-stringify'
    | 'graphql'
    | 'markdown';

type TrailingCommaOption = 'none' | 'es5' | 'all';

interface PrettierSupportInfo {
    languages: {
        name: string;
        since: string;
        parsers: ParserOption[];
        group?: string;
        tmScope: string;
        aceMode: string;
        codemirrorMode: string;
        codemirrorMimeType: string;
        aliases?: string[];
        extensions: string[];
        filenames?: string[];
        linguistLanguageId: number;
        vscodeLanguageIds: string[];
    }[];
}

/**
 * Prettier configuration
 */
export interface PrettierConfig {
    printWidth: number;
    tabWidth: number;
    singleQuote: boolean;
    trailingComma: TrailingCommaOption;
    bracketSpacing: boolean;
    jsxBracketSameLine: boolean;
    parser: ParserOption;
    semi: boolean;
    useTabs: boolean;
    proseWrap: 'preserve' | 'always' | 'never';
    arrowParens: 'avoid' | 'always';
    rangeStart: number;
    rangeEnd: number;
    filepath: string;
}
/**
 * prettier-vscode specific configuration
 */
interface ExtensionConfig {
    /**
     * Use 'prettier-eslint' instead of 'prettier-ipd'.
     * Other settings will only be fallbacks in case they could not be inferred from eslint rules.
     */
    eslintIntegration: boolean;
    /**
     * Use 'prettier-stylelint' instead of 'prettier-ipd'.
     * Other settings will only be fallbacks in case they could not be inferred from eslint rules.
     */
    stylelintIntegration: boolean;
    /**
     * Path to '.prettierignore' or similar.
     */
    ignorePath: string;
    /**
     * If true will skip formatting if a prettierconfig isn't found.
     */
    requireConfig: boolean;
    /**
     * Array of language IDs to ignore
     */
    disableLanguages: string[];
}

/**
 * Configuration for prettier-vscode
 */
export type PrettierVSCodeConfig = ExtensionConfig & PrettierConfig;
export interface Prettier {
    format: (text: string, options?: Partial<PrettierConfig>) => string;
    resolveConfig: (
        filePath: string,
        options?: {
            /**
             * Use cache, defaults to true.
             */
            useCache?: boolean;
            /**
             * read editorconfig, defaults to false.
             */
            editorconfig?: boolean;
        }
    ) => Promise<PrettierConfig>;
    clearConfigCache: () => void;
    getSupportInfo(version?: string): PrettierSupportInfo;
    readonly version: string;
}
type LogLevel = 'error' | 'warn' | 'info' | 'debug' | 'trace';
interface PrettierEslintOptions {
    /**
     * The path of the file being formatted
     * can be used in lieu of `eslintConfig` (eslint will be used to find the
     * relevant config for the file). Will also be used to load the `text` if
     * `text` is not provided.
     */
    filePath?: string;
    /**
     * The text (JavaScript code) to format
     */
    text: string;
    /**
     * The path to the eslint module to use.
     * Will default to require.resolve('eslint')
     */
    eslintPath?: string;
    /**
     * The config to use for formatting
     * with ESLint.
     */
    eslintConfig?: object;
    /**
     * The options to pass for
     * formatting with `prettier`. If not provided, prettier-eslint will attempt
     * to create the options based on the eslintConfig
     */
    prettierOptions?: Partial<PrettierConfig>;
    /**
     * The options to pass for
     * formatting with `prettier` if the given option is not inferrable from the
     * eslintConfig.
     */
    fallbackPrettierOptions?: Partial<PrettierConfig>;
    /**
     * The level for the logs
     */
    logLevel?: LogLevel;
    /**
     * Run Prettier Last. Default false
     */
    prettierLast?: boolean;
}

/**
 * Format javascript code with prettier-eslint.
 *
 * @param {PrettierEslintOptions} options - Option bag for prettier-eslint.
 * @returns {string} the formatted code.
 */
export type PrettierEslintFormat = (options: PrettierEslintOptions) => string;

export interface PrettierStylelint {
    format: (options: PrettierEslintOptions) => Promise<string>;
    resolveConfig: (
        file: string,
        options?: {
            useCache: boolean;
        }
    ) => Promise<[PrettierConfig, Object]>;
}
