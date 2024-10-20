import {config} from "dotenv";
import {server} from "@/server";

const bootstrap = () => {
  config();

  const PORT = process.env.PORT;

  server.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
  })
}

bootstrap();
