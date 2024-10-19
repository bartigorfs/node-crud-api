import {IncomingMessage} from "node:http";
import {ServerResponse} from "http";

export const handlePutRequest = async (req: IncomingMessage, res: ServerResponse<IncomingMessage> & {
  req: IncomingMessage;
}): Promise<void> => {

}
