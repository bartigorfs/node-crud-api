import {createServer, IncomingMessage} from "node:http";

import {HTTPMethods} from "./models/server.models";
import {ServerResponse} from "http";
import {config} from "dotenv";
import {handleGetRequest} from "@/handlers/get/get.handler";
import {handlePutRequest} from "@/handlers/put/put.handler";
import {handleDeleteRequest} from "@/handlers/delete/delete.handler";
import {handlePostRequest} from "@/handlers/post/post.handler";
import {sendNotFound} from "@/services/base.service";

config();

const PORT = process.env.PORT;

const server = createServer(async (req: IncomingMessage, res: ServerResponse) => {
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
});


server.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
})
