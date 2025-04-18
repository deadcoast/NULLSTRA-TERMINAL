// Fix Next.js metadata types
declare module "next/dist/lib/metadata/types/metadata-interface.js" {
  import { Metadata } from "next";

  export interface Metadata {
    title?: string | { default?: string; template?: string };
    description?: string;
    applicationName?: string;
    authors?: Array<{ name: string; url?: string }>;
    generator?: string;
    keywords?: string[];
    referrer?: string;
    themeColor?: string;
    colorScheme?: string;
    viewport?: string;
    robots?: string | { index?: boolean; follow?: boolean };
    icons?: { icon?: string[] | string; apple?: string[] | string };
    openGraph?: {
      title?: string;
      description?: string;
      url?: string;
      siteName?: string;
      images?: string[] | { url: string }[];
      locale?: string;
      type?: string;
    };
    twitter?: {
      card?: string;
      title?: string;
      description?: string;
      images?: string[];
    };
    verification?: {
      google?: string;
      yandex?: string;
      yahoo?: string;
      bing?: string;
    };
    [key: string]: any;
  }

  export interface AppMetadata extends Metadata {
    metadataBase?: URL | null;
  }

  export interface ResolvingMetadata extends Metadata {}
  export interface ResolvingViewport {}
  export type { Metadata };
}

declare module "next" {
  import { FC, ReactNode } from "react";

  export interface Metadata {
    title?: string | { default?: string; template?: string };
    description?: string;
    applicationName?: string;
    authors?: Array<{ name: string; url?: string }>;
    generator?: string;
    keywords?: string[];
    referrer?: string;
    themeColor?: string;
    colorScheme?: string;
    viewport?: string;
    robots?: string | { index?: boolean; follow?: boolean };
    icons?: { icon?: string[] | string; apple?: string[] | string };
    openGraph?: {
      title?: string;
      description?: string;
      url?: string;
      siteName?: string;
      images?: string[] | { url: string }[];
      locale?: string;
      type?: string;
    };
    twitter?: {
      card?: string;
      title?: string;
      description?: string;
      images?: string[];
    };
    verification?: {
      google?: string;
      yandex?: string;
      yahoo?: string;
      bing?: string;
    };
    [key: string]: any;
  }

  export interface LayoutProps {
    children: ReactNode;
  }

  export type NextPage<P = {}, IP = P> = FC<P> & {
    getInitialProps?: (context: any) => IP | Promise<IP>;
  };

  export type Viewport = {
    width?: string | number;
    height?: string | number;
    initialScale?: number;
    minimumScale?: number;
    maximumScale?: number;
    userScalable?: boolean;
    viewportFit?: string;
    interactiveWidget?: string;
  };

  export interface NextConfig {
    reactStrictMode?: boolean;
    experimental?: {
      appDir?: boolean;
      serverComponentsExternalPackages?: string[];
      [key: string]: any;
    };
    [key: string]: any;
  }

  export default function createServer(options?: {
    dev?: boolean;
    dir?: string;
    quiet?: boolean;
    conf?: NextConfig;
  }): {
    prepare(): Promise<void>;
    getRequestHandler(): (req: any, res: any) => Promise<void>;
    start(port: number): Promise<void>;
  };

  export interface GetServerSidePropsContext {
    req: any;
    res: any;
    params?: any;
    query: any;
  }

  export interface GetStaticPropsContext {
    params?: any;
  }
}

export {};
