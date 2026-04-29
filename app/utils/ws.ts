import { EmEvent } from './emEvent';

export function Socket(url: string) {
  let client: WebSocket | undefined = undefined;
  let reconnectTimer: number | undefined = undefined;
  let active = true;
  let status = 'connecting' as `connecting` | 'connected' | 'end';
  const { emit, on, once, clear: EmEventClear } = EmEvent();
  const clearClient = () => {
    if (client) {
      client.onopen = null;
      client.onmessage = null;
      client.onerror = null;
      client.onclose = null;
      client.close();
      client = undefined;
    }
  };

  const reconnect = () => {
    if (!active) {
      return;
    }
    status = 'connecting';
    if (reconnectTimer) return; // 已经在等待中
    reconnectTimer = setTimeout(() => {
      reconnectTimer = undefined;
      connect();
    }, 2000) as unknown as number; // 2 秒后重连
  };

  const connect = () => {
    // 防止重复连接
    clearClient();
    client = new WebSocket(url);
    client.onopen = () => {
      status = 'connected';
      emit('connected');
    };

    client.onmessage = (e) => {
      const data = JSON.parse(e.data);
      emit('data', data);
    };

    client.onclose = client.onerror = () => {
      emit('closed');
      reconnect();
    };
  };

  const send = (obj: string | object) => {
    if (status === 'end') {
      return;
    }
    if (status === 'connected') {
      client?.send(JSON.stringify(obj));
      return;
    }

    once('connected', () => {
      client?.send(JSON.stringify(obj));
    });
  };

  const end = () => {
    emit('end');
    status = 'end';
    active = false;
    clearClient();
    EmEventClear();
    clearTimeout(reconnectTimer);
  };

  // 首次连接
  connect();

  return { reconnect, send, on, once, end };
}
