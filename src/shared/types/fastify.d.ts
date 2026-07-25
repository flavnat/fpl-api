import { jwtPlugin } from './../plugins/jwt.plugin';
import type { Mongoose, Model } from 'mongoose';
import type { User } from '../models/user.model';
import type { UserService } from '../services/user.service';

declare module 'fastify' {
  interface FastifyInstance {
    mongoose: Mongoose;
    models: {
      User: Model<User>;
    },
    services: {
      user: UserService;
    }
  }
}