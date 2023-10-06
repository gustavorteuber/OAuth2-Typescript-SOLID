import express, { type Request, type Response, type NextFunction } from 'express';
import { errorHandlerMiddleware } from '../../drivers/errorHandlerMiddleware';
import passport from 'passport';
import oauth2orize from 'oauth2orize';
import { type IHttpServer } from './IHttpServer';

export default class ExpressAdapter implements IHttpServer {
  app: any;

  constructor () {
    this.app = express();
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(passport.initialize());
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const server = oauth2orize.createServer();
  }

  on (method: string, url: string, callback: (...args: any) => any): void {
    this.app[method](url, async (req: Request, res: Response, next: NextFunction) => {
      try {
        const output = await callback(req, res, req.headers, next);
        const response = errorHandlerMiddleware(output);

        res.status(response.statusCode).json(response.message);
      } catch (e: any) {
        const response = errorHandlerMiddleware(e);
        res.status(response.statusCode).json(response.message);
      }
    });
  }

  listen (port: number): void {
    this.app.use(errorHandlerMiddleware);
    this.app.listen(port, () => {
      console.log('Escutando a porta:', port);
    });
  }

  close (): void {
    const server = this.app.listen();
    server.close();
  }
}
