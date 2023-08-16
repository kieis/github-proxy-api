import {
  FastifyRequest,
  FastifyReply,
  RequestGenericInterface,
  RawServerBase,
  RawReplyDefaultExpression,
} from "fastify";

import {
  IncomingHttpHeaders as Http2IncomingHttpHeaders,
  IncomingHttpHeaders,
} from "http2";

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
    try {
      const data = JSON.parse(streamData.join(""));

      reply.status(200).send({
        data,
        ...includeData,
      });
    } catch (err) {
      reply
        .status(500)
        .send({ statusCode: 500, message: "Internal Server Error" });
    }
  });
};

export const rewriteHeaders = (
  request: FastifyRequest<RequestGenericInterface, RawServerBase>,
  headers: Http2IncomingHttpHeaders | IncomingHttpHeaders
): Http2IncomingHttpHeaders | IncomingHttpHeaders => {
  return {
    host: headers["host"],
    accept: headers["accept"],
    "content-type": headers["content-type"],
    "user-agent": headers["user-agent"],
  };
};
