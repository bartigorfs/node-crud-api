import {createServer, IncomingMessage} from "node:http";
import {ServerResponse} from "http";
import {rootHandler} from "@/handlers";

export const server =
  createServer(async (req: IncomingMessage, res: ServerResponse) => rootHandler(req, res));

