import { Elysia, t } from "elysia";
import { cors } from "@elysiajs/cors";
import { staticPlugin } from "@elysiajs/static";
import { Stream } from "@elysiajs/stream";
import { basicAuth } from "elysia-basic-auth";
import { $ } from "bun";
import { getUsers } from "./parse-users";

const app = new Elysia();
app.use(cors());

if (process.env.NODE_ENV === "production") {
  const users = getUsers();
  if (users.length > 0) {
    console.log(
      `Enable basic auth for: ${users.map((u) => u.username).join(", ")}`,
    );
    app.use(
      basicAuth({
        users: getUsers(),
        realm: process.env.AUTH_REALM,
        errorMessage: "Unauthorized",
        noErrorThrown: false,
      }),
    );
  }
}

app
  .use(staticPlugin({ prefix: "/" }))
  .onError(({ code, error, set }) => {
    if (code === "VALIDATION") {
      set.status = 400;
      return error.message;
    }
  })
  .post(
    "/console",
    async ({ body }) => {
      const command =
        await $`docker exec -it palworld-server rcon-cli ${body.command}`;
      return {
        response: command.stdout.toString() || command.stderr.toString(),
        isError: command.exitCode !== 0,
      };
    },
    {
      body: t.Object({
        command: t.String(),
      }),
    },
  )
  .post("/update", () => {
    return new Stream(async (stream) => {
      const pullCmd = $`docker-compose pull 2>&1`.cwd(process.env.COMPOSE_DIR);
      const upCmd = $`docker-compose up -d 2>&1`.cwd(process.env.COMPOSE_DIR);
      for await (const line of pullCmd.lines()) stream.send(line);
      for await (const line of upCmd.lines()) stream.send(line);
      stream.close();
    });
  })
  .listen(process.env.PORT);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
);
