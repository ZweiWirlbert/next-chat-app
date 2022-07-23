import { IconButton } from '@mui/material';
import styled from 'styled-components';
import { useRecipient } from '../hooks/useRecipient';
import { Conversation, IMessage } from '../types';
import {
  convertFirestoreTimestampToDate,
  generateQueryGetMessages,
  transformMessage,
} from '../utils/getMessagesInConversation';
import RecipientAvatar from './RecipientAvatar';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useRouter } from 'next/router';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '../config/firebase';
import { useCollection } from 'react-firebase-hooks/firestore';
import Message from './Message';
import AddCircleOutlinedIcon from '@mui/icons-material/AddCircleOutlined';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import InsertPhotoIcon from '@mui/icons-material/InsertPhoto';
import SpokeIcon from '@mui/icons-material/Spoke';
import GifBoxIcon from '@mui/icons-material/GifBox';
import SendIcon from '@mui/icons-material/Send';
import { ChangeEventHandler, KeyboardEventHandler, MouseEventHandler, useLayoutEffect, useRef, useState } from 'react';
import { addDoc, collection, doc, serverTimestamp, setDoc } from 'firebase/firestore';

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
  display: flex;
  flex-direction: column;
  gap: 5px;
  justify-content: flex-end;
  padding: 10px 20px 10px 10px;
  background-color: #ffffff;
  min-height: 90vh;
`;

const StyledInputContainer = styled.form`
  display: flex;
  align-items: center;
  padding: 10px;
  position: sticky;
  bottom: 0;
  background-color: white;
  z-index: 100;
  gap: 5px;
  border-top: 1px solid #e0e0e0;
  box-shadow: 0 -1px 3px rgba(0, 0, 0, 0.1);
`;

const StyledInput = styled.input`
  flex-grow: 1;
  background-color: #f3f3f5;
  border-radius: 18px;
  padding: 10px 15px;
  outline: none;
  border: none;
`;

const EndOfMessagesForAutoScroll = styled.div`
  margin-bottom: 10px;
`;

const ConversationScreen = ({ conversation, messages }: { conversation: Conversation; messages: IMessage[] }) => {
  const [inputValue, setInputValue] = useState('');

  const [loggedInUser, _loading, _error] = useAuthState(auth);

  const conversationUsers = conversation.users;

  const { recipientEmail, recipient } = useRecipient(conversationUsers);

  const router = useRouter();

  const conversationId = router.query.id; // localhost:3000/conversations/[id]

  const queryGetMessages = generateQueryGetMessages(conversationId as string);

  const [messagesSnapshot, messagesLoading, __error] = useCollection(queryGetMessages);

  const showMessages = () => {
    // If frontend is loading messages behind the scene, show messages from Next SSR (passed down from [id].tsx)
    if (messagesLoading) {
      return messages.map((message) => (
        <Message key={message.id} message={message} recipient={recipient} recipientEmail={recipientEmail} />
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

  const handleOnSubmit: ChangeEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
  };

  const handleInputOnChange: ChangeEventHandler<HTMLInputElement> = ({ target }) => {
    setInputValue(target.value);
  };

  const handleInputOnKeyPress: KeyboardEventHandler<HTMLInputElement> = async ({ key }) => {
    if (key === 'Enter') {
      if (!inputValue) return;
      await addMessageToDbAndUpdateLastSeen();
    }
  };

  const addMessageToDbAndUpdateLastSeen = async () => {
    // update your last seen when you send a message
    await setDoc(
      doc(db, 'users', loggedInUser?.email as string),
      {
        lastSeen: serverTimestamp(),
      },
      {
        merge: true,
      }
    );

    // add message to db
    await addDoc(collection(db, 'messages'), {
      conversation_id: conversationId,
      sent_at: serverTimestamp(),
      text: inputValue,
      user: loggedInUser?.email,
    });

    // reset input fields
    setInputValue('');
  };

  const handleMessageOnClick: MouseEventHandler<HTMLButtonElement> = async (e) => {
    e.preventDefault();
    if (!inputValue) return;
    await addMessageToDbAndUpdateLastSeen();
  };

  const endOfMessagesRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (endOfMessagesRef.current) {
      endOfMessagesRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useLayoutEffect(() => {
    scrollToBottom();
  }, [messagesSnapshot]);
  return (
    <>
      <StyledRecipientHeader>
        <RecipientAvatar recipient={recipient} recipientEmail={recipientEmail} />
        <StyledHeaderInfo>
          <StyledH3>{recipient?.displayName ? recipient.displayName : recipientEmail}</StyledH3>
          {recipient && <span>Last active: {convertFirestoreTimestampToDate(recipient.lastSeen)}</span>}
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
      <StyledMessageContainer>
        {showMessages()}
        {/* for auto scroll to bottom when new message is added*/}
        <EndOfMessagesForAutoScroll ref={endOfMessagesRef} />
      </StyledMessageContainer>

      <StyledInputContainer onSubmit={handleOnSubmit}>
        <IconButton>
          <AddCircleOutlinedIcon sx={{ color: '#0084ff' }} />
        </IconButton>
        <IconButton sx={{ color: '#0084ff' }}>
          <InsertPhotoIcon />
        </IconButton>
        <IconButton sx={{ color: '#0084ff' }}>
          <SpokeIcon />
        </IconButton>
        <IconButton sx={{ color: '#0084ff' }}>
          <GifBoxIcon />
        </IconButton>
        <StyledInput
          placeholder="Aa"
          value={inputValue}
          onChange={handleInputOnChange}
          onKeyDown={handleInputOnKeyPress}
        />
        <IconButton sx={{ color: '#0084ff' }}>
          <EmojiEmotionsIcon />
        </IconButton>
        <IconButton onClick={handleMessageOnClick} disabled={!inputValue} sx={{ color: '#0084ff' }}>
          <SendIcon />
        </IconButton>
      </StyledInputContainer>
    </>
  );
};

export default ConversationScreen;
