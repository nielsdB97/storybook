import { HooksContext } from './hooks';
import { Addon } from './index';

export enum types {
  TAB = 'tab',
  PANEL = 'panel',
  TOOL = 'tool',
  TOOLEXTRA = 'toolextra',
  PREVIEW = 'preview',
  NOTES_ELEMENT = 'notes-element',
}

export type Types = types | string;

export function isSupportedType(type: Types): boolean {
  return !!Object.values(types).find((typeVal) => typeVal === type);
}

export type StoryId = string;
export type StoryKind = string;
export type StoryName = string;
export type ViewMode = 'story' | 'docs';

export interface Parameters {
  fileName?: string;
  options?: OptionsParameter;
  layout?: 'centered' | 'fullscreen' | 'padded';
  docsOnly?: boolean;
  [key: string]: any;
}

// This is duplicated in @storybook/api because there is no common place to put types (manager/preview)
// We cannot import from @storybook/api here because it will lead to manager code (i.e. emotion) imported in the preview
export interface Args {
  [key: string]: any;
}

export interface ArgType {
  name?: string;
  description?: string;
  defaultValue?: any;
  [key: string]: any;
}

export interface ArgTypes {
  [key: string]: ArgType;
}

export interface StoryIdentifier {
  id: StoryId;
  kind: StoryKind;
  name: StoryName;
}

export type StoryContext = StoryIdentifier & {
  [key: string]: any;
  parameters: Parameters;
  args: Args;
  argTypes: ArgTypes;
  globals: Args;
  hooks?: HooksContext;
  viewMode?: ViewMode;
};

export interface WrapperSettings {
  options: OptionsParameter;
  parameters: {
    [key: string]: any;
  };
}

export type Comparator<T> = ((a: T, b: T) => boolean) | ((a: T, b: T) => number);
export type StorySortMethod = 'configure' | 'alphabetical';
export interface StorySortObjectParameter {
  method?: StorySortMethod;
  order?: any[];
  locales?: string;
}
// The `any` here is the story store's `StoreItem` record. Ideally we should probably only
// pass a defined subset of that full data, but we pass it all so far :shrug:
export type StorySortComparator = Comparator<[StoryId, any, Parameters, Parameters]>;
export type StorySortParameter = StorySortComparator | StorySortObjectParameter;

export interface OptionsParameter extends Object {
  storySort?: StorySortParameter;
  theme?: {
    base: string;
    brandTitle?: string;
  };
  [key: string]: any;
}

export type StoryGetter = (context: StoryContext) => any;

export type LegacyStoryFn<ReturnType = unknown> = (p?: StoryContext) => ReturnType;
export type ArgsStoryFn<ReturnType = unknown> = (a?: Args, p?: StoryContext) => ReturnType;
export type StoryFn<ReturnType = unknown> = LegacyStoryFn<ReturnType> | ArgsStoryFn<ReturnType>;

export type StoryWrapper = (
  getStory: StoryGetter,
  context: StoryContext,
  settings: WrapperSettings
) => any;

export type MakeDecoratorResult = (...args: any) => any;

export interface AddStoryArgs<StoryFnReturnType = unknown> {
  id: StoryId;
  kind: StoryKind;
  name: StoryName;
  storyFn: StoryFn<StoryFnReturnType>;
  parameters: Parameters;
}

export interface ClientApiAddon<StoryFnReturnType = unknown> extends Addon {
  apply: (a: StoryApi<StoryFnReturnType>, b: any[]) => any;
}
export interface ClientApiAddons<StoryFnReturnType> {
  [key: string]: ClientApiAddon<StoryFnReturnType>;
}

export type ClientApiReturnFn<StoryFnReturnType> = (...args: any[]) => StoryApi<StoryFnReturnType>;

export interface StoryApi<StoryFnReturnType = unknown> {
  kind: StoryKind;
  add: (
    storyName: StoryName,
    storyFn: StoryFn<StoryFnReturnType>,
    parameters?: Parameters
  ) => StoryApi<StoryFnReturnType>;
  addDecorator: (decorator: DecoratorFunction<StoryFnReturnType>) => StoryApi<StoryFnReturnType>;
  addParameters: (parameters: Parameters) => StoryApi<StoryFnReturnType>;
  [k: string]: string | ClientApiReturnFn<StoryFnReturnType>;
}

export type DecoratorFunction<StoryFnReturnType = unknown> = (
  fn: StoryFn<StoryFnReturnType>,
  c: StoryContext
) => ReturnType<StoryFn<StoryFnReturnType>>;

export type DecorateStoryFunction<StoryFnReturnType = unknown> = (
  storyFn: StoryFn<StoryFnReturnType>,
  decorators: DecoratorFunction<StoryFnReturnType>[]
) => StoryFn<StoryFnReturnType>;

export interface ClientStoryApi<StoryFnReturnType = unknown> {
  storiesOf(kind: StoryKind, module: NodeModule): StoryApi<StoryFnReturnType>;
  addDecorator(decorator: DecoratorFunction<StoryFnReturnType>): StoryApi<StoryFnReturnType>;
  addParameters(parameter: Parameters): StoryApi<StoryFnReturnType>;
}

type LoadFn = () => any;
type RequireContext = any; // FIXME
export type Loadable = RequireContext | [RequireContext] | LoadFn;

// CSF types, to be re-org'ed in 6.1

export type BaseDecorators<StoryFnReturnType> = Array<
  (story: () => StoryFnReturnType, context: StoryContext) => StoryFnReturnType
>;

export interface Annotations<Args, StoryFnReturnType> {
  /**
   * Dynamic data that are provided (and possibly updated by) Storybook and its addons.
   * @see [Arg story inputs](https://github.com/storybookjs/storybook/blob/next/docs/src/pages/formats/component-story-format/index.md#args-story-inputs)
   */
  args?: Partial<Args>;

  /**
   * ArgTypes encode basic metadata for args, such as `name`, `description`, `defaultValue` for an arg. These get automatically filled in by Storybook Docs.
   * @see [Control annotations](https://github.com/storybookjs/storybook/blob/91e9dee33faa8eff0b342a366845de7100415367/addons/controls/README.md#control-annotations)
   */
  argTypes?: ArgTypes;

  /**
   * Custom metadata for a story.
   * @see [Parameters](https://storybook.js.org/docs/basics/writing-stories/#parameters)
   */
  parameters?: Parameters;

  /**
   * Wrapper components or Storybook decorators that wrap a story.
   *
   * Decorators defined in Meta will be applied to every story variation.
   * @see [Decorators](https://storybook.js.org/docs/addons/introduction/#1-decorators)
   */
  decorators?: BaseDecorators<StoryFnReturnType>;

  /**
   * Used to only include certain named exports as stories. Useful when you want to have non-story exports such as mock data or ignore a few stories.
   * @example
   * includeStories: ['SimpleStory', 'ComplexStory']
   * includeStories: /.*Story$/
   *
   * @see [Non-story exports](https://storybook.js.org/docs/formats/component-story-format/#non-story-exports)
   */
  includeStories?: string[] | RegExp;

  /**
   * Used to exclude certain named exports. Useful when you want to have non-story exports such as mock data or ignore a few stories.
   * @example
   * excludeStories: ['simpleData', 'complexData']
   * excludeStories: /.*Data$/
   *
   * @see [Non-story exports](https://storybook.js.org/docs/formats/component-story-format/#non-story-exports)
   */
  excludeStories?: string[] | RegExp;
}

export interface BaseMeta<ComponentType> {
  /**
   * Title of the story which will be presented in the navigation. **Should be unique.**
   *
   * Stories can be organized in a nested structure using "/" as a separator.
   *
   * @example
   * export default {
   *   ...
   *   title: 'Design System/Atoms/Button'
   * }
   *
   * @see [Story Hierarchy](https://storybook.js.org/docs/basics/writing-stories/#story-hierarchy)
   */
  title: string;

  /**
   * The primary component for your story.
   *
   * Used by addons for automatic prop table generation and display of other component metadata.
   */
  component?: ComponentType;

  /**
   * Auxiliary subcomponents that are part of the stories.
   *
   * Used by addons for automatic prop table generation and display of other component metadata.
   *
   * @example
   * import { Button, ButtonGroup } from './components';
   *
   * export default {
   *   ...
   *   subcomponents: { Button, ButtonGroup }
   * }
   *
   * By defining them each component will have its tab in the args table.
   */
  subcomponents?: Record<string, ComponentType>;
}

export interface BaseStory<Args, StoryFnReturnType> {
  (args: Args, context: StoryContext): StoryFnReturnType;

  /**
   * Override the display name in the UI
   */
  storyName?: string;
}
