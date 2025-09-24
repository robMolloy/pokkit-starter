import PocketBase from "pocketbase";
import { z } from "zod";
import { userSchema } from "../users/dbUsersUtils";
import { extractMessageFromPbError } from "@/lib/pbUtils";

export const pocketbaseAuthStoreSchema = z.object({
  token: z.string(),
  record: userSchema,
});
export type TAuth = z.infer<typeof pocketbaseAuthStoreSchema>;
export type TUser = z.infer<typeof userSchema>;
type TUserSignInSeed = Pick<TUser, "email"> & { password: string };
type TUserSignUpSeed = Pick<TUser, "email" | "name" | "emailVisibility" | "role" | "status"> & {
  password: string;
  passwordConfirm: string;
};

export const checkAuth = (p: { pb: PocketBase }) => {
  const authStore = p.pb.authStore;
  if (!authStore?.token) return { success: false, error: "authStore is null" } as const;
  return { success: true, data: authStore } as const;
};

export const loginWithPassword = async (p: { pb: PocketBase; data: TUserSignInSeed }) => {
  try {
    const resp = await p.pb.collection("users").authWithPassword(p.data.email, p.data.password);

    pocketbaseAuthStoreSchema.parse(resp);

    return { success: true, messages: ["Successfully logged in user"] as string[] } as const;
  } catch (error) {
    const messagesResp = extractMessageFromPbError({ error });

    const messages = ["Failed to sign in user", ...(messagesResp ? messagesResp : [])];

    return { success: false, error, messages } as const;
  }
};
export const requestSigninWithOtp = async (p: { pb: PocketBase; email: string }) => {
  try {
    const resp = await p.pb.collection("users").requestOTP(p.email);
    const schema = z.object({ otpId: z.string() });

    const data = schema.parse(resp);
    return {
      success: true,
      data,
      messages: ["Successfully requested OTP"] as string[],
    } as const;
  } catch (error) {
    const messagesResp = extractMessageFromPbError({ error });

    const messages = ["Failed to request OTP for user", ...(messagesResp ? messagesResp : [])];

    return { success: false, error, messages } as const;
  }
};

export const signinWithOtp = async (p: {
  pb: PocketBase;
  data: { otpId: string; otp: string };
}) => {
  try {
    const authData = await p.pb.collection("users").authWithOTP(p.data.otpId, p.data.otp);
    console.log(`AuthForm.tsx:${/*LL*/ 184}`, { authData });

    return {
      success: true,
      messages: ["Successfully signed in with OTP"] as string[],
    } as const;
  } catch (error) {
    const messagesResp = extractMessageFromPbError({ error });

    const messages = ["Failed to sign in with OTP", ...(messagesResp ? messagesResp : [])];

    return { success: false, error, messages } as const;
  }
};
export const signupWithOAuth2Google = async (p: { pb: PocketBase }) => {
  try {
    const resp = await p.pb.collection("users").authWithOAuth2({
      provider: "google",
      createData: {
        status: "pending",
        role: "standard",
      },
    });

    console.log(`dbAuthUtils.ts:${/*LL*/ 49}`, { resp });

    return {
      success: true,
      messages: ["Successfully signup user with google oauth2"] as string[],
    } as const;
  } catch (error) {
    const messagesResp = extractMessageFromPbError({ error });

    const messages = [
      "Failed to sign up user with google oauth2",
      ...(messagesResp ? messagesResp : []),
    ];

    return { success: false, error, messages } as const;
  }
};
export const signinWithOAuth2Google = async (p: { pb: PocketBase }) => {
  try {
    const resp = await p.pb.collection("users").authWithOAuth2({
      provider: "google",
    });

    console.log(`dbAuthUtils.ts:${/*LL*/ 49}`, { resp });

    return {
      success: true,
      messages: ["Successfully signin user with google oauth2"] as string[],
    } as const;
  } catch (error) {
    const messagesResp = extractMessageFromPbError({ error });

    const messages = [
      "Failed to sign in user with google oauth2",
      ...(messagesResp ? messagesResp : []),
    ];

    return { success: false, error, messages } as const;
  }
};

export const signUpWithPassword = async (p: { pb: PocketBase; data: TUserSignUpSeed }) => {
  try {
    const createResp = await p.pb.collection("users").create(p.data);

    userSchema.parse(createResp);

    const messages = ["Successfully signed up user"];
    return { success: true, messages } as const;
  } catch (error) {
    const messagesResp = extractMessageFromPbError({ error });

    const title = "Failed to sign up user";
    const messages = [title, ...(messagesResp ? messagesResp : [])];

    return { success: false, error, messages } as const;
  }
};

export const logout = (p: { pb: PocketBase }) => {
  p.pb.realtime.unsubscribe();
  p.pb.authStore.clear();
  return { success: true } as const;
};

export const createUser = async (p: {
  pb: PocketBase;
  data: { email: string; password: string };
}) => {
  try {
    const resp = await p.pb
      .collection("users")
      .create({ ...p.data, passwordConfirm: p.data.password });
    return { success: true, data: resp } as const;
  } catch (error) {
    return { success: false, error } as const;
  }
};
