import { message, Modal, ModalFuncProps } from 'antd';
import qs from 'qs';

import { useUserStore } from '@/store/user';

import { requestBase, RequestParamBase } from './requestBase';

type RequestParam = RequestParamBase;
type RequestTempItem = {
  res?: string;
  task?: Promise<any>;
  expireTime: number;
};
const tempMap: Record<string, RequestTempItem> = {};
// 请求缓存
export async function requestWithCache(ps: RequestParam, tempTime = 1000 * 60) {
  const hash =
    ps.url +
    ':' +
    ps.method +
    ':' +
    JSON.stringify(ps.params) +
    JSON.stringify(ps.data);
  if (tempMap[hash]) {
    if (Date.now() < tempMap[hash].expireTime) {
      if (tempMap[hash].res) {
        return JSON.parse(tempMap[hash].res);
      }
      return tempMap[hash].task?.then((res) => {
        return JSON.parse(JSON.stringify(res));
      });
    }
    delete tempMap[hash];
  }
  const task = request({ ...ps });

  tempMap[hash] = {
    task,
    expireTime: Date.now() + tempTime,
  };
  task.then((res) => {
    if (tempMap[hash]) {
      tempMap[hash].res = JSON.stringify(res);
      tempMap[hash].task = undefined;
    }
  });

  return task;
}

interface RequestError extends Error {
  response?: Response;
}
export type ServerData<T> = {
  code: number;
  msg?: string;
  data?: T;
};
const BaseApi = (import.meta as any).env.VITE_BASE_API;
const request = <T = any,>(ps: RequestParam, headers: any = {}) => {
  const userStore = useUserStore.getState();
  const newHeaders = {
    'Content-Type': 'application/json',
    'x-token': userStore.token,
    'x-user-id': userStore.userInfo?.ID,
    ...(headers as any),
  };

  ps.url = `${BaseApi}/${ps.url}`;

  return requestBase(
    { ...ps, paramsSerializer: ps.paramsSerializer || defaultParamsSerializer },
    newHeaders
  )
    .then((response) => {
      if (!response.ok) {
        const error = new Error(
          `HTTP error! status: ${response.status}`
        ) as RequestError;
        error.response = response;
        throw error;
      }
      if (response.headers.get('new-token')) {
        userStore.setToken(response.headers.get('new-token')!);
      }
      return response.json() as Promise<ServerData<T>>;
    })
    .then((data) => {
      if (data.code !== 0 && data.code !== 4) {
        message.error(data.msg);
      }
      return data;
    })
    .catch(errorHandler as never);
};

request.get = (url: string, params?: any) =>
  request({ url, method: 'get', params });
request.post = (url: string, data?: any) =>
  request({ url, method: 'post', data });
request.delete = (url: string, params?: any) =>
  request({ url, method: 'delete', params });
request.put = (url: string, data?: any) =>
  request({ url, method: 'put', data });

// export default service
export default request;

function defaultParamsSerializer(params: any) {
  return qs.stringify(params, { arrayFormat: 'repeat' });
}

export function tipCatchError(error: { code: number; msg: string }) {
  message.error(error.msg);
  return error;
}

export function errorHandler(error: RequestError) {
  if (!error.response) {
    onConfirm('请求报错' + error.message, {
      title: '请求报错',
      content: (
        <>
          <p>检测到请求错误</p>
          <p>${error.message}</p>
        </>
      ),
      okText: '稍后重试',
      cancelText: '取消',
    });
    return;
  }

  switch (error.response.status) {
    case 500:
      onConfirm('接口报错' + error.message, {
        title: '接口报错',
        content: (
          <>
            <p>检测到接口错误${error.message}</p>
            <p>
              错误码<span style={{ color: 'red' }}> 500 </span>
              ：此类错误内容常见于后台panic，请先查看后台日志，如果影响您正常使用可强制登出清理缓存
            </p>
          </>
        ),
        okText: '清理缓存',
        cancelText: '取消',
      }).then(() => {
        const userStore = useUserStore.getState();
        userStore.clearStorage();
        location.href = '/login';
      });
      break;
    case 404:
      onConfirm('接口报错' + error.message, {
        title: '接口报错',
        content: (
          <>
            <p>检测到接口错误${error.message}</p>
            <p>
              错误码<span style={{ color: 'red' }}> 404 </span>
              ：此类错误多为接口未注册（或未重启）或者请求路径（方法）与api路径（方法）不符--如果为自动化代码请检查是否存在空格
            </p>
          </>
        ),
        okText: '我知道了',
        cancelText: '取消',
      });
      break;
    case 401:
      onConfirm('身份信息' + error.message, {
        title: '身份信息',
        content: (
          <>
            <p>无效的令牌</p>
            <p>
              错误码:<span style={{ color: 'red' }}> 401 </span>
              错误信息: {error.message}
            </p>
          </>
        ),
        okText: '重新登录',
        cancelText: '取消',
        cancelButtonProps: {
          style: { display: 'none' },
        },
      }).then(() => {
        const userStore = useUserStore.getState();
        userStore.clearStorage();
        location.href = '/login';
      });
      break;
  }

  throw error;
}

const TaskMap: Record<string, undefined | Promise<void>> = {};
function onConfirm(groupName: string, props: ModalFuncProps) {
  if (TaskMap[groupName]) {
    return TaskMap[groupName];
  }
  return (TaskMap[groupName] = new Promise<void>((resolve, reject) => {
    Modal.confirm({
      ...props,
      onOk() {
        resolve();
      },
      onCancel() {
        reject();
      },
    });
  }).finally(() => {
    TaskMap[groupName] = undefined;
  }));
}
