import mongoose from 'mongoose';
import { logger } from './logger';
import { MONGO_URI, NODE_ENV } from './env';

// Singleton pattern for MongoDB Connection
class DatabaseConnection {
  private static instance: DatabaseConnection;
  private isConnected: boolean = false;

  private constructor() {}

  public static getInstance(): DatabaseConnection {
    if (!DatabaseConnection.instance) {
      DatabaseConnection.instance = new DatabaseConnection();
    }
    return DatabaseConnection.instance;
  }

  public async connect(): Promise<void> {
    try {
      if (this.isConnected) {
        logger.info('Database already connected');
        return;
      }

      // Configure mongoose settings
      mongoose.set('strictQuery', false);
      
      // Enable debug mode in development
      if (NODE_ENV === 'development') {
        mongoose.set('debug', (collectionName: string, method: string, query: any, doc?: any) => {
          logger.debug(`Mongoose: ${collectionName}.${method}`, {
            query: JSON.stringify(query),
            doc: doc ? JSON.stringify(doc) : undefined,
          });
        });
      }

      // Connection options
const options = {
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
};

      await mongoose.connect(MONGO_URI, options);
      this.isConnected = true;
      
      logger.info('Database connected successfully');

      // Handle connection events
      mongoose.connection.on('error', (error) => {
        logger.error('Database connection error:', error);
        this.isConnected = false;
      });

      mongoose.connection.on('disconnected', () => {
        logger.warn('Database disconnected');
        this.isConnected = false;
      });

      mongoose.connection.on('reconnected', () => {
        logger.info('Database reconnected');
        this.isConnected = true;
      });

    } catch (error) {
      logger.error('Failed to connect to database:', error);
      this.isConnected = false;
      throw error;
    }
  }

  public async disconnect(): Promise<void> {
    try {
      if (!this.isConnected) {
        logger.info('Database already disconnected');
        return;
      }

      await mongoose.disconnect();
      this.isConnected = false;
      logger.info('Database connection closed');
    } catch (error) {
      logger.error('Error disconnecting from database:', error);
      throw error;
    }
  }

  public async healthCheck(): Promise<boolean> {
    try {
      if (!this.isConnected) {
        return false;
      }

      // Simple ping to check connection
      await mongoose.connection.db.admin().ping();
      return true;
    } catch (error) {
      logger.error('Database health check failed:', error);
      return false;
    }
  }

  public getConnection() {
    return mongoose.connection;
  }

  public isConnectionReady(): boolean {
    return this.isConnected && mongoose.connection.readyState === 1;
  }
}

export { DatabaseConnection };
export default DatabaseConnection.getInstance();