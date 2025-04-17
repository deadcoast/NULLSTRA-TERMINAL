declare module 'socket.io-client' {
  const io: (url: string, options?: any) => any;
  export interface Socket {
    on(event: string, callback: (...args: any[]) => void): void;
    emit(event: string, ...args: any[]): void;
    disconnect(): void;
  }
  export default io;
}

declare module 'axios' {
  export interface AxiosResponse<T = any> {
    data: T;
    status: number;
    statusText: string;
    headers: any;
    config: any;
    request?: any;
  }

  export interface AxiosPromise<T = any> extends Promise<AxiosResponse<T>> {}

  export interface AxiosInstance {
    get<T = any>(url: string, config?: any): AxiosPromise<T>;
    post<T = any>(url: string, data?: any, config?: any): AxiosPromise<T>;
    put<T = any>(url: string, data?: any, config?: any): AxiosPromise<T>;
    delete<T = any>(url: string, config?: any): AxiosPromise<T>;
  }

  const axios: AxiosInstance;
  export default axios;
} 