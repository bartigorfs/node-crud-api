import {StatusCode} from "@/models/server.models";
import {sendRes} from "@/services/base.service";
import {ServerResponse} from "http";

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

export class MemAlreadyCreated extends Error {
  constructor() {
    super('User already created!');
    this.name = 'MemAlreadyCreated';
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
