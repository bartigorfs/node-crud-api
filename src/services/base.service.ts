import {ServerResponse} from "http";
import {IncomingMessage} from "node:http";
import {ContentTypes, SetHeaderOptions, StatusCode} from "@/models/server.models";

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

export const sendRes = (statusCode: number | StatusCode, res: ServerResponse, data?: any, contentType?: SetHeaderOptions): void => {
  res.statusCode = statusCode;

  if (contentType) {
    res.setHeader(contentType.name, contentType.type);
  } else {
    res.setHeader('Content-Type', ContentTypes.JSON)
  }

  if (data) {
    res.write(
      JSON.stringify(data)
    )
  }

  res.end();
}

export const getRequestBody = (req: IncomingMessage) => {
  return new Promise((resolve, reject) => {
    let body: string = '';

    req.on('data', (chunk) => {
      body += chunk.toString();
    });

    req.on('end', () => {
      try {
        const parsedBody = body ? JSON.parse(body) : undefined;
        resolve(parsedBody);
      } catch (error) {
        resolve(undefined);
      }
    });

    req.on('error', (err) => {
      reject(err);
    });
  });
}

