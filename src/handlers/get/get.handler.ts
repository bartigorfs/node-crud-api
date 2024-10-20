import {IncomingMessage, ServerResponse} from "http";
import {User} from "@/models/user.model";
import {CatchMemErrors} from "@/models/memory.model";
import {sendNotFound, sendRes} from "@/services/base.service";
import {StatusCode, UUIDV4_REGEXP} from "@/models/server.models";


export const getAllUsersFromMem = (res: ServerResponse) => {
  let result: User[] | null = null;

  try {
    result = global.memory.getAllUsers();
  } catch (e: any) {
    return CatchMemErrors(e?.name, res, e?.message);
  }

  return sendRes(StatusCode.OK, res, result);
}

export const getUserFromMem = (userId: string, res: ServerResponse) => {
  let user: User | null = null;

  try {
    if (!userId || !UUIDV4_REGEXP.test(userId)) {
      return sendRes(StatusCode.BadRequest, res, {message: 'Bad id string'});
    }

    user = global.memory.getUserById(userId);

    if (!user) {
      return sendRes(StatusCode.NotFound, res);
    }

    return sendRes(StatusCode.OK, res, {user});
  } catch (e: any) {
    return CatchMemErrors(e?.name, res, e?.message);
  }
}

export const handleGetRequest = (req: IncomingMessage, res: ServerResponse): void => {

  const urlParts: string[] | undefined = req.url?.split('/').filter(part => part);
  const endpoint: string | null = urlParts && urlParts.length > 1 ? urlParts[1] : null;

  switch (endpoint) {
    case 'users': {
      if (urlParts?.length === 2) {
        getAllUsersFromMem(res);
      } else if (urlParts?.length === 3) {
        const param: string | null = urlParts && urlParts.length >= 2 ? urlParts[2] : null;
        getUserFromMem(param as string, res);
      }
      break;
    }
    default:
      return sendNotFound(res);
  }
}
