export class HTTP {
  async get<T>(url: string, options?: any) {
    const res = await fetch(url, options);

    if (res.status !== 200) {
      throw new Error(`res to ${url} returned an error`);
    }

    const response: T = await (options?.plainText ? res.text() : res.json());
    return response;
  }

  async post<T>(url: string, body: any, options?: any) {
    const headers = options?.headers || {};
    const contentType = headers['content-type'] || headers['Content-Type'] || 'application/json';

    const encodedBody = contentType === 'application/json' ? JSON.stringify(body) : body;

    const res = await fetch(url, {
      ...options,
      headers: {
        'content-type': contentType,
        ...headers,
      },
      body: encodedBody,
      method: 'POST',
    });

    if (res.status !== 200) {
      throw new Error(`res to ${url} returned an error (${res.status})`);
    }

    const response: T = await (options?.plainText ? res.text() : res.json());

    return response;
  }
}