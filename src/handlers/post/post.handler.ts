import {IncomingMessage} from "node:http";
import {ServerResponse} from "http";
import {InvalidParamsResponse, StatusCode} from "@/models/server.models";
import {getRequestBody, sendNotFound, sendRes} from "@/services/base.service";
import {BaseUser, User} from "@/models/user.model";
import {addUser} from "@/services/memory.service";
import {CatchMemErrors} from "@/models/memory.model";

const validateUserBody = (body: any): InvalidParamsResponse => {
  const errors: string[] = [];

  if (!body.username || typeof body.username !== 'string') {
    errors.push('Username is missing or its not a type of number!');
  }

  if (!body.age || typeof body.age !== 'number') {
    errors.push('Age parameter is missing or its not a type of number!');
  }

  if (!body.hobbies || !Array.isArray(body.hobbies) || !body.hobbies.every((hobby: any) => typeof hobby === 'string')) {
    errors.push('Hobbies parameter is missing or its not a type of string array!');
  }

  return {
    isValid: errors.length <= 0,
    errors: errors.length > 0 ? errors : undefined
  };
}

export const handlePostRequest = async (req: IncomingMessage, res: ServerResponse<IncomingMessage> & {
  req: IncomingMessage;
}): Promise<void> => {
  const urlParts: string[] | undefined = req.url?.split('/').filter(part => part);
  const endpoint: string | null = urlParts && urlParts.length > 1 ? urlParts[1] : null;

  switch (endpoint) {
    case 'users': {

      const requestBody = await getRequestBody(req);
      if (!requestBody) {
        return sendRes(StatusCode.BadRequest, res, {message: 'Please provide valid request body!'});
      }

      const bodyValidation: InvalidParamsResponse = validateUserBody(requestBody);

      if (!bodyValidation.isValid) {
        return sendRes(StatusCode.BadRequest, res, {
          message: 'Invalid body params',
          errors: bodyValidation.errors
        });
      }

      try {
        const user: User = addUser(requestBody as BaseUser);
        return sendRes(StatusCode.Created, res, {user});
      } catch (e: any) {
        return CatchMemErrors(e?.name, res, e?.message);
      }
    }
    default:
      return sendNotFound(res);
  }
}
