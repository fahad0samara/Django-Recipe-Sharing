export const Storage = {
  set(key, value, expiry = null) {
    const item = {
      value,
      timestamp: Date.now(),
      expiry: expiry ? Date.now() + expiry : null
    };
    localStorage.setItem(key, JSON.stringify(item));
  },

  get(key) {
    const item = localStorage.getItem(key);
    if (!item) return null;

    const { value, expiry } = JSON.parse(item);
    if (expiry && Date.now() > expiry) {
      localStorage.removeItem(key);
      return null;
    }
    
    return value;
  },

  remove(key) {
    localStorage.removeItem(key);
  },

  clear() {
    localStorage.clear();
  }
};