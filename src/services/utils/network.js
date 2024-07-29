// utils/network.js
export const checkOnlineStatus = async (url = 'https://www.google.com/', timeout = 5000) => {
    try {
      const controller = new AbortController();
      const signal = controller.signal;
      const fetchOptions = {
        method: 'HEAD',
        mode: 'no-cors',
        cache: 'no-cache',
        signal
      };
  
      const fetchPromise = fetch(url, fetchOptions);
      const timeoutId = setTimeout(() => controller.abort(), timeout);
  
      await fetchPromise;
      clearTimeout(timeoutId);
      return true;
    } catch (error) {
      return false;
    }
  };
  