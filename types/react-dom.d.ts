declare module "react-dom" {
  import { ReactNode } from "react";

  export function render(
    element: ReactNode,
    container: Element | null,
    callback?: () => void,
  ): void;

  export function hydrate(
    element: ReactNode,
    container: Element | null,
    callback?: () => void,
  ): void;

  export function createPortal(
    children: ReactNode,
    container: Element,
    key?: string,
  ): ReactNode;

  export function unmountComponentAtNode(container: Element): boolean;

  export function findDOMNode(
    component: React.Component<any, any> | Element | null | undefined,
  ): Element | null | Text;

  export const version: string;

  export const unstable_batchedUpdates: <T>(
    callback: (param: T) => void,
    param: T,
  ) => void;
}

declare module "react-dom/client" {
  import { ReactNode } from "react";

  export interface Root {
    render(children: ReactNode): void;
    unmount(): void;
  }

  export function createRoot(container: Element | DocumentFragment): Root;
  export function hydrateRoot(
    container: Element | DocumentFragment,
    initialChildren: ReactNode,
  ): Root;
}
