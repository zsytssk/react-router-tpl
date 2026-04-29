export function EmEvent() {
  const eventMap = new Map<string, Set<(data?: any) => void>>();
  const emit = (type: string, data?: any) => {
    eventMap.get(type)?.forEach((fn) => fn(data));
  };

  const on = (event: string, callback: (data?: any) => void) => {
    let events = eventMap.get(event);
    if (!events) {
      events = new Set();
      eventMap.set(event, events);
    }
    events.add(callback);
    return () => events.delete(callback);
  };

  const once = (event: string, callback: (data?: any) => void) => {
    const offFn = on(event, (data: any) => {
      try {
        callback(data);
      } finally {
        offFn();
      }
    });
    return offFn;
  };

  const clear = () => eventMap.clear();

  return { once, on, emit, clear };
}
