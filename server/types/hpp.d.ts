declare module 'hpp' {
  import { RequestHandler } from 'express';
  
  interface HppOptions {
    whitelist?: string[];
    checkBody?: boolean;
    checkBodyOnlyForContentType?: string[];
    checkQuery?: boolean;
  }
  
  function hpp(options?: HppOptions): RequestHandler;
  
  export = hpp;
}