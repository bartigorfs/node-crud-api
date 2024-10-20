import {IncomingMessage, ServerResponse} from "http";
import {InvalidParamsResponse, StatusCode, UUIDV4_REGEXP} from "@/models/server.models";
import {getRequestBody, sendNotFound, sendRes} from "@/services/base/base.service";
import {UpdateBaseUser, User} from "@/models/user.model";
import {CatchMemErrors} from "@/models/memory.model";
import {userMemoryInstance} from "@/services/memory/memory.service";

const validateUserBody = (body: any): InvalidParamsResponse => {
  const errors: string[] = [];

  if (body.username !== undefined && typeof body.username !== 'string') {
    errors.push('Username parameter is not a string!');
  }

  if (body.age !== undefined && typeof body.age !== 'number') {
    errors.push('Age parameter is not a number!');
  }

  if (body.hobbies !== undefined && !Array.isArray(body.hobbies)) {
    errors.push('Hobbies parameter is not an array!');
  } else if (Array.isArray(body.hobbies) && !body.hobbies.every((hobby: any) => typeof hobby === 'string')) {
    errors.push('Hobbies parameter contains non-string elements!');
  }

  return {
    isValid: errors.length <= 0,
    errors: errors.length > 0 ? errors : undefined
  };
}

export const handlePutRequest = async (req: IncomingMessage, res: ServerResponse<IncomingMessage> & {
  req: IncomingMessage;
}): Promise<void> => {
  const urlParts: string[] | undefined = req.url?.split('/').filter(part => part);
  const endpoint: string | null = urlParts && urlParts.length > 1 ? urlParts[1] : null;

  switch (endpoint) {
    case 'users': {
      if (urlParts?.length === 3) {
        const param: string | null = urlParts && urlParts.length >= 2 ? urlParts[2] : null;

        if (!param || !UUIDV4_REGEXP.test(param)) {
          return sendRes(StatusCode.BadRequest, res, {message: 'Bad id string'});
        }

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
          const user: User | undefined = userMemoryInstance.updateUser(requestBody as UpdateBaseUser, param);
          if (user) {
            return sendRes(StatusCode.Created, res, {user});
          } else {
            return sendRes(StatusCode.ServerError, res);
          }
        } catch (e: any) {
          return CatchMemErrors(e?.name, res, e?.message);
        }
      } else {
        return sendNotFound(res);
      }
    }
    default:
      sendNotFound(res);
  }
}
