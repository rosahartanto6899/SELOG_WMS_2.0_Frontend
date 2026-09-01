const LocalStorageUtils = () => {
  const setWithExpiry = (key: string, value: string, ttl: number) => {
    const now = new Date();

    // `item` is an object which contains the original value
    // as well as the time when it's supposed to expire
    const item = {
      value,
      expiry: now.getTime() + ttl,
    };
    localStorage.setItem(key, JSON.stringify(item));
  };

  const getWithExpiry = (key: string) => {
    const itemStr = localStorage.getItem(key);

    // if the item doesn't exist, return { value: process.env.NEXT_PUBLIC_MAX_FAILED_ATTEMPTS, expiry: 0 }
    if (!itemStr) {
      return { value: process.env.MAX_FAILED_LOGIN_ATTEMPTS, expiry: 0 };
    }

    const item = JSON.parse(itemStr);
    const now = new Date();

    // compare the expiry time of the item with the current time
    if (now.getTime() > item.expiry) {
      // If the item is expired, delete the item from storage
      // and return { value: process.env.NEXT_PUBLIC_MAX_FAILED_ATTEMPTS, expiry: 0 }
      localStorage.removeItem(key);
      return { value: process.env.MAX_FAILED_LOGIN_ATTEMPTS, expiry: 0 };
    }
    return item;
  };

  return {
    setWithExpiry,
    getWithExpiry,
  };
};

export default LocalStorageUtils;
