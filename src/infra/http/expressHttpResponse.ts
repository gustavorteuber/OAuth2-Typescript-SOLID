import { type Response } from 'express';
import { type IHttpResponse } from './IHttpResponse';

export class ExpressHttpResponse implements IHttpResponse {
  constructor (private readonly response: Response) {}

  json (data: any): void {
    this.response.json(data);
  }
}
