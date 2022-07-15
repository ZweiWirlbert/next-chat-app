import { getRecipientEmail } from "./../utils/getRecipientEmail";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../config/firebase";
import { AppUser, Conversation } from "../types";
import { collection, query, where } from "firebase/firestore";
import { useCollection } from "react-firebase-hooks/firestore";

export const useRecipient = (conversationUsers: Conversation["users"]) => {
  const [loggedInUser, _loading, _error] = useAuthState(auth);

  // get recipient email
  const recipientEmail = getRecipientEmail(conversationUsers, loggedInUser);

  //get recipient avatar
  const queryGetRecipient = query(
    collection(db, "users"),
    where("email", "==", recipientEmail)
  );

  const [recipientsSnapshot, __loading, __error] =
    useCollection(queryGetRecipient);

  // recipientsSnapshot?.doc could be an empty array, leading to doc[0] being undefined
  // so we have to force '?' after doc[0] because the is no data() on 'undefined'
  const recipient = recipientsSnapshot?.docs[0]?.data() as AppUser | undefined;

  return {
    recipientEmail,
    recipient,
  };
};
