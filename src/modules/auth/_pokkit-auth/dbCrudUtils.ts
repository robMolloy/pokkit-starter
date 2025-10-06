import { pb } from "@/config/pocketbaseConfig";
import PocketBase, { RecordModel } from "pocketbase";
import { z } from "zod";
import { userSchema, usersCollectionName } from "./pokkitAuthUtils";

export const getRecordById = async <T extends { id: string }>(p: {
  pb: PocketBase;
  id: string;
  collectionName: string;
  schema: z.ZodType<T>;
  successMessage: string;
  failMessage: string;
}) => {
  try {
    const resp = await p.pb.collection(p.collectionName).getOne(p.id);
    const data = p.schema.parse(resp);
    return { success: true, data } as const;
  } catch (e) {
    const error = e as { message: string };
    return { success: false, error } as const;
  }
};

export const listRecords = async <T extends { id: string }>(p: {
  pb: PocketBase;
  collectionName: string;
  schema: z.ZodType<T>;
  onRecordError?: (x: { error: unknown; record: RecordModel }) => void;
}) => {
  try {
    const initData = await p.pb.collection(p.collectionName).getFullList();

    const data = initData
      .map((x) => {
        const parseResp = p.schema.safeParse(x);
        if (!parseResp.success) p.onRecordError?.({ error: parseResp.error, record: x });
        return parseResp;
      })
      .filter((x) => x.success)
      .map((x) => x.data);
    return { success: true, data } as const;
  } catch (error) {
    return { success: false, error } as const;
  }
};

export const subscribeToRecords = async <T extends { id: string }>(p: {
  pb: PocketBase;
  collectionName: string;
  schema: z.ZodType<T>;
  initialRecords?: T[];
  onChange: (e: T[]) => void;
  onError?: (x: { action: string; error: unknown; record: RecordModel }) => void;
}) => {
  let allDocs = p.initialRecords ? [...p.initialRecords] : [];

  p.pb.collection(p.collectionName).subscribe("*", (e) => {
    if (e.action === "create") {
      const parseResp = p.schema.safeParse(e.record);
      if (!parseResp.success)
        return p.onError?.({ action: e.action, error: parseResp.error, record: e.record });

      allDocs.push(parseResp.data);
    } else if (e.action === "update") {
      const parseResp = p.schema.safeParse(e.record);
      if (!parseResp.success)
        return p.onError?.({ action: e.action, error: parseResp.error, record: e.record });

      allDocs = allDocs.filter((x) => parseResp.data?.id !== x.id);
      allDocs.push(parseResp.data);
    } else if (e.action === "delete") {
      const parseResp = p.schema.safeParse(e.record);
      if (!parseResp.success)
        return p.onError?.({ action: e.action, error: parseResp.error, record: e.record });

      allDocs = allDocs.filter((x) => parseResp.data?.id !== x.id);
    }
    p.onChange(allDocs);
  });
  return { success: true } as const;
};

export const subscribeToRecordById = async <T extends { id: string }>(p: {
  pb: PocketBase;
  id: string;
  collectionName: string;
  schema: z.ZodType<T>;
  onChange: (e: T | null) => void;
  onError?: (x: { action: string; error: unknown }) => void;
  onRecordAction?: (x: { action: string; record: T }) => void;
}) => {
  try {
    const unsub = await p.pb.collection(p.collectionName).subscribe(p.id, (e) => {
      const parseResp = p.schema.safeParse(e.record);
      p.onChange(parseResp.success ? parseResp.data : null);
      if (parseResp.success) p.onRecordAction?.({ action: e.action, record: parseResp.data });
    });
    return { success: true, data: { unsub } } as const;
  } catch (error) {
    return { success: false, error } as const;
  }
};

export const smartSubscribeToRecordById = async <T extends { id: string }>(p: {
  pb: PocketBase;
  id: string;
  collectionName: string;
  schema: z.ZodType<T>;
  onChange: (e: T | null) => void;
  successMessage: string;
  failMessage: string;
}) => {
  const unsubRespPromise = subscribeToRecordById({
    pb: p.pb,
    id: p.id,
    collectionName: p.collectionName,
    schema: p.schema,
    onChange: (e) => p.onChange(e),
  });

  const recordRespPromise = getRecordById({
    pb: p.pb,
    id: p.id,
    collectionName: p.collectionName,
    schema: p.schema,
    successMessage: p.successMessage,
    failMessage: p.failMessage,
  });

  const unsubResp = await unsubRespPromise;
  const recordResp = await recordRespPromise;

  if (unsubResp.success && recordResp.success)
    return { success: true, data: { unsub: unsubResp.data.unsub } } as const;

  return {
    success: false,
    error: { recordError: recordResp.error, unsubError: unsubResp.error },
  } as const;
};

(async () => {
  const getUserById = (p: { pb: PocketBase; id: string }) => {
    return getRecordById({
      pb: p.pb,
      id: p.id,
      collectionName: usersCollectionName,
      schema: userSchema,
      successMessage: "Successfully fetched user",
      failMessage: "Failed to fetch user",
    });
  };
  const userResp = await getUserById({ pb, id: "600d6c3c-c0c7-4b0a-a0f0-b1e8f9a9b9c9" });
  if (userResp.success) {
    console.log(userResp.data);
  } else {
    console.log(userResp.error);
  }
})();
