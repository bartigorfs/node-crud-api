import {ServerResponse} from "http";
import {IncomingMessage} from "node:http";
import {ContentTypes, StatusCode} from "@/models/server.models";

export const sendNotFound = (res: ServerResponse<IncomingMessage> & {
  req: IncomingMessage;
}): void => {
  res.statusCode = StatusCode.NotFound;
  res.setHeader('Content-Type', ContentTypes.JSON)
  res.write(
    JSON.stringify({message: 'Not found'})
  )
  res.end();
}
