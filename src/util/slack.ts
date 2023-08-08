import type { HandlerEvent } from "@netlify/functions";
import fetch from "node-fetch";
import { createHmac } from "crypto";

export const slackApi = (
  endpoint: SlackApiEndpoint,
  body: SlackApiRequestBody
) => {
  return fetch(`https://slack.com/api/${endpoint}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.SLACK_BOT_OAUTH_TOKEN}`,
      "CONTENT-TYPE": "application/json; charset=utf-8",
    },
    body: JSON.stringify(body),
  }).then((res) => res.json());
};

export const verifySlackRequest = (request: HandlerEvent) => {
  const secret = process.env.SLACK_SIGNING_SECRET!;
  const signature = request.headers["x-slack-signature"];
  const timestamp = Number(request.headers["x-slack-request-timestamp"]);
  const now = Math.floor(Date.now() / 1000);

  if (Math.abs(now - timestamp) > 300) {
    return false;
  }

  const hash = createHmac("sha256", secret)
    .update(`v0:${timestamp}:${request.body}`)
    .digest("hex");

  return `v0=${hash}` === signature;
};
