import type { Handler } from "@netlify/functions";
import { parse } from "querystring";
import { slackApi, verifySlackRequest } from "./util/slack";

const handleSlashCommand = async (payload: SlackSlashCommandPayload) => {
  switch (payload.command) {
    case "/foodfight":
      const response: any = await slackApi("chat.postMessage", {
        channel: payload.channel_id,
        text: "Things are happening!",
      });

      if (!response.ok) {
        console.log(response);
      }
      break;
    default:
      return {
        statusCode: 200,
        body: `Command ${payload.command} is not recognized`,
      };
  }

  return { statusCode: 200, body: "" };
};

export const handler: Handler = async (event) => {
  // validate the Slack request
  const valid = verifySlackRequest(event);

  if (!valid) {
    return { statusCode: 400, body: "Invalid Request!" };
  }
  // handle slash commands
  const body = parse(event.body ?? "") as SlackPayload;
  if (body.command) {
    return handleSlashCommand(body as SlackSlashCommandPayload);
  }
  // TODO handle interactivity (e.g. context commands, modals)

  return {
    statusCode: 200,
    body: "TODO: handle Slack commands and interactivity yo yo!!",
  };
};
