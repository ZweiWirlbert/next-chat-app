import { IconButton } from "@mui/material";
import styled from "styled-components";
import { useRecipient } from "../hooks/useRecipient";
import { Conversation, IMessage } from "../types";
import {
  convertFirestoreTimestampToDate,
  generateQueryGetMessages,
  transformMessage,
} from "../utils/getMessagesInConversation";
import RecipientAvatar from "./RecipientAvatar";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useRouter } from "next/router";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../config/firebase";
import { useCollection } from "react-firebase-hooks/firestore";
import Message from "./Message";

const StyledRecipientHeader = styled.div`
  position: sticky;
  background: white;
  z-index: 100;
  top: 0;
  display: flex;
  align-items: center;
  padding: 11px;
  height: 80px;
  border-bottom: 1px solid whitesmoke;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const StyledHeaderInfo = styled.div`
  flex-grow: 1;

  > h3 {
    margin-top: 0;
    margin-bottom: 3px;
  }

  > span {
    font-size: 14px;
    color: gray;
  }
`;

const StyledH3 = styled.h3`
  word-break: break-all;
`;

const StyledHeaderIcon = styled.div`
  display: flex;
`;

const StyledMessageContainer = styled.div`
  padding: 30px;
  background-color: #ffffff;
  min-height: 90vh;
`;

const ConversationScreen = ({
  conversation,
  messages,
}: {
  conversation: Conversation;
  messages: IMessage[];
}) => {
  const [loggedInUser, _loading, _error] = useAuthState(auth);

  const conversationUsers = conversation.users;

  const { recipientEmail, recipient } = useRecipient(conversationUsers);

  const router = useRouter();

  const conversationId = router.query.id; // localhost:3000/conversations/[id]

  const queryGetMessages = generateQueryGetMessages(conversationId as string);

  const [messagesSnapshot, messagesLoading, __error] =
    useCollection(queryGetMessages);

  const showMessages = () => {
    // If frontend is loading messages behind the scene, show messages from Next SSR (passed down from [id].tsx)
    if (messagesLoading) {
      return messages.map((message) => (
        <Message
          key={message.id}
          message={message}
          recipient={recipient}
          recipientEmail={recipientEmail}
        />
      ));
    }
    // if messagesSnapshot are loaded, show messagesSnapshot instead of messages from Next SSR
    if (messagesSnapshot) {
      return messagesSnapshot.docs.map((message) => (
        <Message
          key={message.id}
          message={transformMessage(message)}
          recipient={recipient}
          recipientEmail={recipientEmail}
        />
      ));
    }

    return null;
  };

  return (
    <>
      <StyledRecipientHeader>
        <RecipientAvatar
          recipient={recipient}
          recipientEmail={recipientEmail}
        />
        <StyledHeaderInfo>
          <StyledH3>{recipientEmail}</StyledH3>
          {recipient && (
            <span>
              Last active: {convertFirestoreTimestampToDate(recipient.lastSeen)}
            </span>
          )}
        </StyledHeaderInfo>
        <StyledHeaderIcon>
          <IconButton>
            <AttachFileIcon />
          </IconButton>
          <IconButton>
            <MoreVertIcon />
          </IconButton>
        </StyledHeaderIcon>
      </StyledRecipientHeader>
      <StyledMessageContainer>{showMessages()}</StyledMessageContainer>
    </>
  );
};

export default ConversationScreen;
