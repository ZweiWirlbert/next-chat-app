import {
  collection,
  orderBy,
  query,
  QueryDocumentSnapshot,
  Timestamp,
  where,
} from "firebase/firestore";
import { db } from "../config/firebase";
import { IMessage } from "../types";

export const generateQueryGetMessages = (conversationId?: string) => {
  return query(
    collection(db, "messages"),
    where("conversation_id", "==", conversationId),
    orderBy("sent_at", "asc")
  );
};

export const transformMessage = (message: QueryDocumentSnapshot) =>
  ({
    id: message.id,
    ...message.data(),
    sent_at: message.data().sent_at
      ? convertFirestoreTimestampToDate(message.data().sent_at)
      : null,
  } as IMessage);

export const convertFirestoreTimestampToDate = (timestamp: Timestamp) => {
  return new Date(timestamp.toDate().getTime()).toLocaleString();
};
