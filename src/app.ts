import "dotenv/config";
import fastify from "fastify";
import cors from '@fastify/cors'

const server = fastify();
server.register(cors, {
  origin: true //accepting all
})

server.get("/", (request, reply) => {
  reply.send("Server Running");
});

server.listen({ port: Number(process.env.PORT || "3000") }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server listening at ${address}`);
});