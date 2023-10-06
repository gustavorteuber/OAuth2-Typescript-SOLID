export interface IJwt {
  sign: (payload: any, secret: string, options?: any) => string
  verify: (token: string, secret: string) => Promise<any>
}
