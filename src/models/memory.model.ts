import {StatusCode} from "@/models/server.models";
import {sendRes} from "@/services/base/base.service";
import {ServerResponse} from "http";
import {BaseUser, UpdateBaseUser, User} from "@/models/user.model";
import {Balancer, UpdateNodeConn} from "@/models/balancer.model";

export interface IUserStorage {
  addUser(user: BaseUser): User;

  getAllUsers(): User[];

  getUserById(userId: string): User;

  deleteUser(userId: string): boolean;

  updateUser(user: UpdateBaseUser, id: string): User | undefined;

  clear(): void;
}

export interface IBalancerDataStorage {
  registerNode(id: number): Balancer | undefined

  getNodesASC(): Balancer[];

  updateNodeConn(id: number, type: UpdateNodeConn): Balancer[]
}

export class MemNotFound extends Error {
  constructor() {
    super('User or users not found!');
    this.name = 'MemNotFound';
  }
}

export class MemInvalidArgs extends Error {
  constructor() {
    super('Invalid arguments!');
    this.name = 'MemInvalidArgs';
  }
}

export enum MemErrorStatusCode {
  'MemNotFound' = StatusCode.NotFound,
  'MemInvalidArgs' = StatusCode.BadRequest,
  'MemAlreadyCreated' = StatusCode.NotFound,
}

export const CatchMemErrors = (name: keyof typeof MemErrorStatusCode, res: ServerResponse, msg?: string) => {
  const message = {message: msg ? msg : 'Internal server error'};
  const statusCode: MemErrorStatusCode | StatusCode = MemErrorStatusCode[name] || StatusCode.ServerError;

  return sendRes(statusCode, res, message);
}
