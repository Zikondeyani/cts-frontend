// src/services/sync.js
import { getDataOffline, removeDataOffline } from './localbase';

const API_ENDPOINT = 'https://your-api-endpoint.com/data';

export const syncDataToApi = async () => {
  const offlineData = await getDataOffline('');

  for (const document of offlineData) {
    try {
      const response = await fetch(API_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(document)
      });

      if (response.ok) {
        await removeDataOffline('my-collection', document.id);
      } else {
        console.error('Failed to sync data to API', response.statusText);
      }
    } catch (err) {
      console.error('Error syncing data to API', err);
    }
  }
};

window.addEventListener('online', syncDataToApi);
