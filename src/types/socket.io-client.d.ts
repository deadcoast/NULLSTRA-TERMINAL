declare module "socket.io-client" {
  const io: (url: string, options?: Record<string, unknown>) => Socket;
  export interface Socket {
    on(event: string, callback: (...args: unknown[]) => void): void;
    emit(event: string, ...args: unknown[]): void;
    disconnect(): void;
  }
  export default io;
}

declare module "axios" {
  export interface AxiosResponse<T = unknown> {
    data: T;
    status: number;
    statusText: string;
    headers: Record<string, string>;
    config: Record<string, unknown>;
    request?: unknown;
  }

  export interface AxiosPromise<T = unknown>
    extends Promise<AxiosResponse<T>> {}

  export interface AxiosInstance {
    get<T = unknown>(
      url: string,
      config?: Record<string, unknown>,
    ): AxiosPromise<T>;
    post<T = unknown>(
      url: string,
      data?: unknown,
      config?: Record<string, unknown>,
    ): AxiosPromise<T>;
    put<T = unknown>(
      url: string,
      data?: unknown,
      config?: Record<string, unknown>,
    ): AxiosPromise<T>;
    delete<T = unknown>(
      url: string,
      config?: Record<string, unknown>,
    ): AxiosPromise<T>;
  }

  const axios: AxiosInstance;
  export default axios;
}
