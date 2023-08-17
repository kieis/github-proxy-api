import "dotenv/config";
import fastify from "fastify";
import cors from "@fastify/cors";
import proxy from "@fastify/http-proxy";
import { replyStreamData, rewriteHeaders } from "./utils";

const server = fastify();
server.register(cors, {
  origin: true, //accepting all
});

server.get("/", (request, reply) => {
  reply.send("Server Running");
});

server.register(proxy, {
  upstream: process.env.GITHUB_API + "/users",
  prefix: "/api/users",
  http2: false,
  replyOptions: {
    onResponse: (request, reply, res) => {
      const { since } = request.query as { since: string };
      const { url: endpoint } = request.routeConfig;
      const appUrl = request.raw.rawHeaders[1];
      const perPage = 30; // default amount from docs
      const nextSince = (isNaN(Number(since)) ? 0 : Number(since)) + perPage;
      const nextPage = `http://${appUrl}${endpoint}?since=${nextSince}`;

      replyStreamData(request, reply, res, { nextPage });
    },
    rewriteRequestHeaders: rewriteHeaders,
  },
});

server.register(proxy, {
  upstream: process.env.GITHUB_API + "/users",
  prefix: "/api/users/:username/details",
  rewritePrefix: "/users/:username",
  http2: false,
  replyOptions: {
    onResponse: (request, reply, res) => {
      replyStreamData(request, reply, res);
    },
    rewriteRequestHeaders: rewriteHeaders,
  },
});

server.register(proxy, {
  upstream: process.env.GITHUB_API + "/users",
  prefix: "/api/users/:username/repos",
  rewritePrefix: "/users/:username/repos",
  http2: false,
  replyOptions: {
    onResponse: (request, reply, res) => {
      replyStreamData(request, reply, res);
    },
    rewriteRequestHeaders: rewriteHeaders,
  },
});

server.listen({ port: Number(process.env.PORT || "3000"), host: "0.0.0.0"}, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server listening at ${address}`);
});
