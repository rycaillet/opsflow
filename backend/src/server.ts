import app from "./app";
import { env } from "./config/env";

const server = app.listen(
  env.port,
  "0.0.0.0",
  () => {
    console.log(
      `OpsFlow API running on port ${env.port} in ${env.nodeEnv} mode`
    );
  }
);

server.on("error", (error) => {
  console.error("Unable to start OpsFlow API:", error);
  process.exit(1);
});