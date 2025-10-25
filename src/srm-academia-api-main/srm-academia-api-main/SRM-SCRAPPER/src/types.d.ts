declare module 'got' {
  interface GotOptions {
    json?: any;
    form?: any;
    headers?: { [key: string]: string };
    cookieJar?: any;
    timeout?: {
      request?: number;
    };
    followRedirect?: boolean;
  }

  interface GotResponse {
    body: string;
    statusCode: number;
    headers: { [key: string]: string };
  }

  interface Got {
    get(url: string, options?: GotOptions): Promise<GotResponse>;
    post(url: string, options?: GotOptions): Promise<GotResponse>;
    put(url: string, options?: GotOptions): Promise<GotResponse>;
  }

  const got: Got;
  export = got;
}

