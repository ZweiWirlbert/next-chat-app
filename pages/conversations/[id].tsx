import { doc, getDoc, getDocs } from 'firebase/firestore';
import { GetServerSideProps, NextPage } from 'next';
import Head from 'next/head';
import { useAuthState } from 'react-firebase-hooks/auth';
import styled from 'styled-components';
import ConversationScreen from '../../components/ConversationScreen';
import Sidebar from '../../components/Sidebar';
import { auth, db } from '../../config/firebase';
import { Conversation, IMessage } from '../../types';
import { generateQueryGetMessages, transformMessage } from '../../utils/getMessagesInConversation';
import { getRecipientEmail } from '../../utils/getRecipientEmail';

const StyledContainer = styled.div`
  display: flex;
`;

const StyledConversationContainer = styled.div`
  flex-grow: 1;
  overflow: scroll;
  height: 100vh;

  /* Hide scrollbar for Chrome, Safari and Opera */

  ::-webkit-scrollbar {
    display: none;
  }

  /* Hide scrollbar for IE, Edge and Firefox */
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
`;

interface Props {
  conversation: Conversation;
  messages: IMessage[];
}

const Conversations: NextPage<Props> = ({ conversation, messages }) => {
  const [loggedInUser, _loading, _err] = useAuthState(auth);
  const currentRecipientEmail = getRecipientEmail(conversation?.users, loggedInUser);

  return (
    <StyledContainer>
      <Head>
        <title>Conversation with {currentRecipientEmail}</title>
      </Head>

      <Sidebar />
      {/* <div>
        {messages.map((message) => {
          return <p key={message.id}>{JSON.stringify(message)}</p>;
        })}
      </div> */}
      <StyledConversationContainer>
        <ConversationScreen conversation={conversation} messages={messages} />
      </StyledConversationContainer>
    </StyledContainer>
  );
};

export default Conversations;

export const getServerSideProps: GetServerSideProps<Props, { id: string }> = async (context) => {
  const conversationId = context.params?.id;

  // get conversation, to know who we are chatting with
  const conversationRef = doc(db, 'conversations', conversationId as string);
  const conversationSnapshot = await getDoc(conversationRef);

  // get all messages for this conversation
  const queryMessages = generateQueryGetMessages(conversationId);
  const messagesSnapshot = await getDocs(queryMessages);

  const messages = messagesSnapshot.docs.map((doc) => transformMessage(doc));

  return {
    props: {
      conversation: conversationSnapshot.data() as Conversation,
      messages,
    },
  };
};
