import { Types } from 'mongoose';

export function toObjectId(id: string): Types.ObjectId {
  return new Types.ObjectId(id);
}