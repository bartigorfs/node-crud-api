import {createServer, IncomingMessage} from "node:http";

import {ServerResponse} from "http";
import {config} from "dotenv";

config();

const PORT = process.env.PORT;

const server = createServer(async (req: IncomingMessage, res: ServerResponse) => {

});


server.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
})
