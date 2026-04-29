export type RequestParamBase = {
  url: string;
  method: 'get' | 'post' | 'put' | 'delete';
  data?: any;
  params?: any;
  paramsSerializer?: (params: any) => string;
};

function cleanObj(obj: Record<any, any>) {
  for (const key in obj) {
    if (obj[key] === undefined) {
      delete obj[key];
    }
  }
  return obj;
}

export function requestBase(ps: RequestParamBase, headers: any = {}) {
  const { url, method, data, params, paramsSerializer } = ps;
  let newUrl = url;
  if (params) {
    const newParams = cleanObj(params);
    if (Object.keys(newParams).length) {
      let paramsUrl = '';
      if (paramsSerializer) {
        paramsUrl = paramsSerializer(newParams);
      } else {
        paramsUrl = new URLSearchParams(newParams).toString();
      }
      newUrl = `${newUrl}?${paramsUrl}`;
    }
  }

  let body = null;
  if (data) {
    const newData = cleanObj(data);
    if (Object.keys(newData).length) {
      body = JSON.stringify(newData);
    }
  }

  return fetch(newUrl, {
    method,
    body,
    headers: headers,
  });
}
