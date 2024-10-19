import {IncomingMessage} from "node:http";
import {ServerResponse} from "http";

export const handleDeleteRequest = (req: IncomingMessage, res: ServerResponse<IncomingMessage> & {
  req: IncomingMessage;
}) => {

}
