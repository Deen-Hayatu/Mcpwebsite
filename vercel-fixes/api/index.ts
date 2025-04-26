// Vercel serverless handler for API routes
import { ServerResponse, IncomingMessage } from 'http';
import createVercelApp from '../server/vercel-express';

let app: any;

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  // Initialize Express app if it hasn't been initialized yet
  if (!app) {
    app = await createVercelApp();
  }
  
  // Forward the request to our Express app
  return new Promise((resolve, reject) => {
    // This helps Vercel identify when the request is complete
    const oldEnd = res.end;
    res.end = function(...args: any[]) {
      oldEnd.apply(res, args);
      resolve(undefined);
      return res;
    };
    
    app(req, res, (err: Error) => {
      if (err) {
        reject(err);
        return;
      }
      
      // Handle case where no middleware responded
      if (!res.headersSent) {
        res.statusCode = 404;
        res.end('Not found');
        resolve(undefined);
      }
    });
  });
}