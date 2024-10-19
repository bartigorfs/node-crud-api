export enum ContentTypes {
  JSON = 'application/json',
}

export interface SetHeaderOptions {
  name: string;
  type: string | ContentTypes;
}

export enum HTTPMethods {
  GET = 'GET',
  PUT = 'PUT',
  POST = 'POST',
  DELETE = 'DELETE',
}

export enum StatusCode {
  BadRequest = 400,
  NotFound = 404,
  OK = 200,
  Created = 201,
  ServerError = 500,
  NoContent= 204,
}

export interface InvalidParamsResponse {
  isValid: boolean,
  errors?: string[],
}
