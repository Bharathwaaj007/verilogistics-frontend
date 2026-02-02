// Socket.io client placeholder for VeriLogistics.
// Configure namespaces, authentication, and event handlers here.

import { io } from 'socket.io-client'

// Use an env variable or config file for the URL in real deployments
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:4000'

export const socket = io(SOCKET_URL, {
  autoConnect: false,
  transports: ['websocket'],
})

export function connectSocket() {
  if (!socket.connected) {
    socket.connect()
  }
}

export function disconnectSocket() {
  if (socket.connected) {
    socket.disconnect()
  }
}

