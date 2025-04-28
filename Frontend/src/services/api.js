import axios from 'axios';
import config from '../config';

// Create an axios instance with default config
const api = axios.create({
  baseURL: config.api.url,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Email service
export const emailService = {
  sendContactEmail: (emailData) => {
    return api.post('/sendemail', emailData);
  }
};

export default api;