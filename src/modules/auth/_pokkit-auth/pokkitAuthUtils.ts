import PocketBase, { UnsubscribeFunc } from "pocketbase";
import { z } from "zod";

export { PocketBase, type UnsubscribeFunc };

export const usersCollectionName = "users";
export const userSchema = z.object({
  collectionId: z.string(),
  collectionName: z.literal(usersCollectionName),
  id: z.string(),
  email: z.string(),
  name: z.string(),
  emailVisibility: z.boolean(),
  verified: z.boolean(),
  created: z.string(),
  updated: z.string(),
});
export type TUser = z.infer<typeof userSchema>;

export const pocketBaseAuthStoreSchema = z.object({
  token: z.string(),
  record: userSchema,
});
export type TPocketBaseAuthStore = z.infer<typeof pocketBaseAuthStoreSchema>;
