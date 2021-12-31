import { Dict } from '@mohism/utils';
import request from 'umi-request';
import download from 'download';

export interface IHttpOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'HEAD';
  headers?: Dict<any>;
  data?: Dict<any>;
  [key: string]: any;
}

export interface IDownloadOptions extends IHttpOptions {
  extract?: boolean;
}

const DEFAULT_OPTIONS: IHttpOptions = {
  method: 'GET',
};

export interface IHttp {
  // 接口类请求
  fetch<T>(url: string, options: IHttpOptions): Promise<T>;
  // 文件下载
  download(url: string, distPath: string, options: IDownloadOptions): Promise<string>;
}

export class Http implements IHttp {

  async fetch<T>(url: string, options: IHttpOptions = DEFAULT_OPTIONS): Promise<T> {
    const data = await request(url, options);
    return data as T;
  }

  async download(url: string, distPath: string, options: IDownloadOptions = { extract: false }): Promise<string> {
    await download(url, distPath, { extract: options.extract });
    return distPath;
  }
}
