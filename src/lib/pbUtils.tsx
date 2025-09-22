import { z } from "zod";

const outerSchema = z.record(z.string(), z.unknown());
const innerSchema = outerSchema;
const messageObjSchema = z.object({ message: z.string() });
const errorSchema = z.object({
  message: z.string().optional(),
  response: z.object({
    data: outerSchema.transform((outerObj) => {
      const messages: string[] = [];

      const addMessagesIfValuesOfKeysHaveMessageKey = (obj: Record<string, unknown>) => {
        Object.values(obj)
          .map((innerObj) => {
            const messageObjParsed = messageObjSchema.safeParse(innerObj);
            return messageObjParsed.success ? messageObjParsed.data : null;
          })
          .filter((val) => !!val)
          .forEach((messageObj) => messages.push(messageObj.message));
      };

      // shallow objects
      addMessagesIfValuesOfKeysHaveMessageKey(outerObj);

      // deep objects
      Object.values(outerObj)
        .map((innerObj) => {
          const innerParsed = innerSchema.safeParse(innerObj);
          return innerParsed.success ? innerParsed.data : null;
        })
        .filter((val) => !!val)
        .forEach((innerObj) => addMessagesIfValuesOfKeysHaveMessageKey(innerObj));

      return { messages };
    }),
  }),
});

export const extractMessageFromPbError = (p: { error: unknown }) => {
  const parsed = errorSchema.safeParse(p.error);

  if (!parsed.success) return;

  const initMessages = parsed.data.response.data.messages;
  const messageAsArray = parsed.data.message ? [parsed.data.message] : [];
  const messages = [...messageAsArray, ...initMessages];

  if (messages.length === 0) return;
  return messages;
};
