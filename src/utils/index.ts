import {
  FastifyRequest,
  FastifyReply,
  RequestGenericInterface,
  RawServerBase,
  RawReplyDefaultExpression,
} from "fastify";

export const replyStreamData = (
  request: FastifyRequest<RequestGenericInterface, RawServerBase>,
  reply: FastifyReply<RawServerBase>,
  res: RawReplyDefaultExpression<RawServerBase>,
  includeData?: object
) => {
  const streamData: string[] = [];
  res.on("data", (chunk) => {
    streamData.push(chunk);
  });

  res.on("end", () => {
    const data = JSON.parse(streamData.join(""));

    reply.status(200).send({
      data,
      ...includeData,
    });
  });
};
