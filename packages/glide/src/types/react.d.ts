// Type declarations to work around dependency issues

declare module 'react/jsx-runtime' {
  export function jsx(type: unknown, props: unknown, key?: unknown): unknown;
  export function jsxs(type: unknown, props: unknown, key?: unknown): unknown;
  export const Fragment: unknown;
}

declare namespace React {
  interface ComponentType<P = Record<string, unknown>> {
    (props: P): JSX.Element | null;
    displayName?: string;
  }

  interface FC<P = Record<string, unknown>> extends ComponentType<P> {}

  type ReactNode = unknown;
  type Ref = unknown;
  type ElementType = unknown;
  type HTMLAttributes = unknown;
  type ButtonHTMLAttributes = unknown;
  type MouseEvent = unknown;
  type KeyboardEvent = unknown;
  type DependencyList = ReadonlyArray<unknown>;

  function createContext<T>(defaultValue: T): unknown;
  function useContext<T>(context: unknown): T;
  function useState<T>(initialState: T): [T, (value: T) => void];
  function useCallback<T extends (...args: unknown[]) => unknown>(
    callback: T,
    deps: DependencyList,
  ): T;
  function useEffect(effect: () => void | (() => void), deps?: DependencyList): void;
  function useRef<T>(initialValue: T | null): { current: T | null };
  function useId(): string;
  function useMemo<T>(factory: () => T, deps: DependencyList): T;
  function memo<T extends ComponentType<unknown>>(component: T): T & { displayName?: string };
  function startTransition(callback: () => void): void;

  interface Context<T> {
    Provider: ComponentType<{ value: T; children?: ReactNode }>;
    Consumer: ComponentType<{ children: (value: T) => ReactNode }>;
  }
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      div: unknown;
      span: unknown;
      p: unknown;
      h1: unknown;
      h2: unknown;
      h3: unknown;
      h4: unknown;
      h5: unknown;
      h6: unknown;
      button: unknown;
      [elemName: string]: unknown;
    }

    interface Element {
      type: unknown;
      props: unknown;
      key: unknown;
    }

    interface ElementClass {
      render(): unknown;
    }

    interface ElementAttributesProperty {
      props: {};
    }

    interface ElementChildrenAttribute {
      children: {};
    }
  }

  interface HTMLElement {}
  interface Element {}
}

declare module 'react' {
  export = React;
}
