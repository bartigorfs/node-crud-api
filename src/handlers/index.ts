import {IncomingMessage} from "node:http";
import {ServerResponse} from "http";
import {HTTPMethods} from "@/models/server.models";
import {handleGetRequest} from "@/handlers/get/get.handler";
import {handlePutRequest} from "@/handlers/put/put.handler";
import {handleDeleteRequest} from "@/handlers/delete/delete.handler";
import {handlePostRequest} from "@/handlers/post/post.handler";
import {sendNotFound} from "@/services/base.service";

export const rootHandler = async (req: IncomingMessage, res: ServerResponse) => {
  switch (req.method) {
    case HTTPMethods.GET: {
      return handleGetRequest(req, res);
    }
    case HTTPMethods.PUT: {
      return handlePutRequest(req, res);
    }
    case HTTPMethods.DELETE: {
      return handleDeleteRequest(req, res);
    }
    case HTTPMethods.POST: {
      return await handlePostRequest(req, res);
    }
    default: {
      return sendNotFound(res);
    }
  }
}
