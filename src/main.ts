import {config} from "dotenv";
import {server} from "@/server";
import {Memory} from "@/services/memory.service";

declare global {
  namespace globalThis {
    var memory: Memory;
  }
}

const bootstrap = () => {
  config();

  const PORT = process.env.PORT;

  global.memory = Memory.instance;

  server.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
  })
}

bootstrap();
