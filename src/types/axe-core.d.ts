// Type definitions for axe-core 4.10.3
// Project: https://github.com/dequelabs/axe-core
// Definitions by: Custom declarations for midaterminal

declare module "axe-core" {
  export type ElementContext =
    | string
    | Element
    | Document
    | { include?: string[] | Element[]; exclude?: string[] | Element[] };
  export type RunOptions = Partial<{
    runOnly: {
      type: "tag" | "rule";
      values: string[];
    };
    rules: {
      [key: string]: Partial<{
        enabled: boolean;
        runOnly: boolean;
      }>;
    };
    reporter: "v1" | "v2" | "raw" | "no-passes";
    resultTypes: Array<"passes" | "violations" | "incomplete" | "inapplicable">;
    selectors: boolean;
    ancestry: boolean;
    xpath: boolean;
    absolutePaths: boolean;
    iframes: boolean;
    elementRef: boolean;
    frameWaitTime: number;
    preload: boolean;
  }>;

  export interface Result {
    html: string;
    impact?: ImpactValue;
    target: string[];
    failureSummary?: string;
    any: CheckResult[];
    all: CheckResult[];
    none: CheckResult[];
  }

  export interface CheckResult {
    id: string;
    impact: ImpactValue;
    message: string;
    data: any;
    relatedNodes: RelatedNode[];
  }

  export interface RelatedNode {
    html: string;
    target: string[];
  }

  export type TagValue = string;
  export type ImpactValue = "minor" | "moderate" | "serious" | "critical";

  export interface Spec {
    [key: string]: any;
  }

  export interface AxeResults {
    violations: Array<{
      id: string;
      impact: ImpactValue;
      tags: TagValue[];
      description: string;
      help: string;
      helpUrl: string;
      nodes: Result[];
    }>;
    passes: Array<{
      id: string;
      impact: ImpactValue;
      tags: TagValue[];
      description: string;
      help: string;
      helpUrl: string;
      nodes: Result[];
    }>;
    incomplete: Array<{
      id: string;
      impact: ImpactValue;
      tags: TagValue[];
      description: string;
      help: string;
      helpUrl: string;
      nodes: Result[];
    }>;
    inapplicable: Array<{
      id: string;
      impact: ImpactValue;
      tags: TagValue[];
      description: string;
      help: string;
      helpUrl: string;
      nodes: Result[];
    }>;
  }
}
