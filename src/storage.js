// Reimplements the same window.storage.{get,set,delete,list} API that
// Cuenta Clara's App.jsx already calls, but backed by the browser's
// localStorage instead of Claude's artifact storage. This means App.jsx
// needs zero changes to run standalone once deployed.

function nsKey(key) {
  return `cuenta-clara:${key}`;
}

window.storage = {
  async get(key) {
    const raw = localStorage.getItem(nsKey(key));
    if (raw === null) throw new Error(`key not found: ${key}`);
    return { key, value: raw, shared: false };
  },
  async set(key, value) {
    localStorage.setItem(nsKey(key), value);
    return { key, value, shared: false };
  },
  async delete(key) {
    const existed = localStorage.getItem(nsKey(key)) !== null;
    localStorage.removeItem(nsKey(key));
    return { key, deleted: existed, shared: false };
  },
  async list(prefix = "") {
    const keys = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && k.startsWith("cuenta-clara:" + prefix)) keys.push(k.replace("cuenta-clara:", ""));
    }
    return { keys, prefix, shared: false };
  },
};
