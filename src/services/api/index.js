// Central place to configure Axios for VeriLogistics.
// Wire this to your backend base URL, auth, and interceptors.

import axios from 'axios'

export const apiClient = axios.create({
  baseURL: '/api', // TODO: replace with your API gateway URL
  timeout: 15000,
})

// Example placeholder call so imports have a target:
export async function fetchHealth() {
  // Replace with a real endpoint once available
  return apiClient.get('/health')
}

