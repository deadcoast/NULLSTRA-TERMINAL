declare module "express-serve-static-core" {
  interface ParamsDictionary {
    [key: string]: string;
  }

  interface Query {
    [key: string]: string | string[] | undefined;
  }

  interface Locals {
    [key: string]: any;
  }

  // Fix the ServerRequest issue
  namespace http {
    interface ServerRequest {}
  }

  // Fix NextFunction optionality
  interface NextFunction {
    (err?: any): void;
  }

  // Fix RequestHandler
  interface RequestHandler {
    (req: Request, res: Response, next: NextFunction | undefined): any;
  }

  // Fix Application.use method
  interface Application {
    use(handler: any): this;
    use(path: string, handler: any): this;
  }
}

export {};
