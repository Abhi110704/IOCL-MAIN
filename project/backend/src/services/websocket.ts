import { Server as SocketIOServer, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/env';
import { logger } from '../config/logger';
import { JwtPayload, StatusUpdate } from '../types';

let io: SocketIOServer | null = null;

// Initialize WebSocket server
export const initializeWebSocket = (socketServer: SocketIOServer): void => {
  io = socketServer;

  io.use(async (socket: Socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      
      if (!token) {
        return next(new Error('Authentication error: No token provided'));
      }

      // Verify JWT token
      const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
      
      // Attach user info to socket
      socket.data.user = {
        userId: decoded.userId,
        empId: decoded.empId,
        role: decoded.role,
      };

      next();
    } catch (error) {
      logger.warn('WebSocket authentication failed:', error);
      next(new Error('Authentication error: Invalid token'));
    }
  });

  io.on('connection', (socket: Socket) => {
    const user = socket.data.user;
    logger.info(`WebSocket connected: User ${user?.userId} (${user?.role})`);

    // Join user to their role-based room
    if (user?.role) {
      socket.join(user.role);
    }

    // Join user to their personal room
    if (user?.userId) {
      socket.join(`user:${user.userId}`);
    }

    // Join intern to their personal room
    if (user?.role === 'INTERN' && user?.empId) {
      socket.join(`intern:${user.empId}`);
    }

    // Join mentor to their personal room
    if (user?.role === 'MENTOR' && user?.empId) {
      socket.join(`mentor:${user.empId}`);
    }

    // Handle disconnect
    socket.on('disconnect', (reason) => {
      logger.info(`WebSocket disconnected: User ${user?.userId} - Reason: ${reason}`);
    });

    // Handle custom events
    socket.on('join_room', (room: string) => {
      socket.join(room);
      logger.debug(`User ${user?.userId} joined room: ${room}`);
    });

    socket.on('leave_room', (room: string) => {
      socket.leave(room);
      logger.debug(`User ${user?.userId} left room: ${room}`);
    });

    // Handle application status updates
    socket.on('application_status_update', (data: StatusUpdate) => {
      emitStatusUpdate(data);
    });

    // Handle project status updates
    socket.on('project_status_update', (data: StatusUpdate) => {
      emitStatusUpdate(data);
    });

    // Handle task status updates
    socket.on('task_status_update', (data: StatusUpdate) => {
      emitStatusUpdate(data);
    });
  });

  logger.info('WebSocket server initialized');
};

// Emit status update to relevant users
export const emitStatusUpdate = (update: StatusUpdate): void => {
  if (!io) {
    logger.warn('WebSocket server not initialized');
    return;
  }

  try {
    switch (update.type) {
      case 'APPLICATION_STATUS':
        // Notify L&D team (admins)
        io.to('ADMIN').emit('APPLICATION_STATUS', update);
        
        // Notify the specific user if provided
        if (update.userId) {
          io.to(`user:${update.userId}`).emit('APPLICATION_STATUS', update);
        }
        
        // Notify employees who might have referred this intern
        io.to('EMPLOYEE').emit('APPLICATION_STATUS', update);
        break;

      case 'PROJECT_STATUS':
        // Notify L&D team
        io.to('ADMIN').emit('PROJECT_STATUS', update);
        
        // Notify mentors
        io.to('MENTOR').emit('PROJECT_STATUS', update);
        
        // Notify the specific intern if provided
        if (update.userId) {
          io.to(`intern:${update.userId}`).emit('PROJECT_STATUS', update);
        }
        break;

      case 'TASK_STATUS':
        // Notify mentors
        io.to('MENTOR').emit('TASK_STATUS', update);
        
        // Notify the specific intern if provided
        if (update.userId) {
          io.to(`intern:${update.userId}`).emit('TASK_STATUS', update);
        }
        
        // Notify L&D team
        io.to('ADMIN').emit('TASK_STATUS', update);
        break;

      default:
        logger.warn(`Unknown status update type: ${update.type}`);
    }

    logger.debug(`Status update emitted: ${update.type} - ${update.id}`);
  } catch (error) {
    logger.error('Error emitting status update:', error);
  }
};

// Emit notification to specific user
export const emitToUser = (userId: string, event: string, data: any): void => {
  if (!io) {
    logger.warn('WebSocket server not initialized');
    return;
  }

  io.to(`user:${userId}`).emit(event, data);
  logger.debug(`Event emitted to user ${userId}: ${event}`);
};

// Emit notification to specific role
export const emitToRole = (role: string, event: string, data: any): void => {
  if (!io) {
    logger.warn('WebSocket server not initialized');
    return;
  }

  io.to(role).emit(event, data);
  logger.debug(`Event emitted to role ${role}: ${event}`);
};

// Emit notification to all connected clients
export const emitToAll = (event: string, data: any): void => {
  if (!io) {
    logger.warn('WebSocket server not initialized');
    return;
  }

  io.emit(event, data);
  logger.debug(`Event emitted to all clients: ${event}`);
};

// Get connected users count
export const getConnectedUsersCount = (): number => {
  if (!io) {
    return 0;
  }

  return io.engine.clientsCount;
};

// Get users in a specific room
export const getUsersInRoom = async (room: string): Promise<string[]> => {
  if (!io) {
    return [];
  }

  const sockets = await io.in(room).fetchSockets();
  return sockets.map(socket => socket.data.user?.userId).filter(Boolean);
};

// Disconnect user
export const disconnectUser = (userId: string): void => {
  if (!io) {
    logger.warn('WebSocket server not initialized');
    return;
  }

  io.to(`user:${userId}`).disconnectSockets();
  logger.info(`User ${userId} disconnected via server`);
};

export default {
  initializeWebSocket,
  emitStatusUpdate,
  emitToUser,
  emitToRole,
  emitToAll,
  getConnectedUsersCount,
  getUsersInRoom,
  disconnectUser,
};