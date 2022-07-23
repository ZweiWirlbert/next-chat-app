import { AppUser, IMessage } from '../types';
import styled from 'styled-components';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../config/firebase';
import Tooltip, { TooltipProps } from '@mui/material/Tooltip';

// moment js
import 'moment/locale/vi';
import moment from 'moment';
import { FORMAT_DATE_TIME, FORMAT_TIME } from '../constants/moment';
import { tooltipClasses } from '@mui/material';
import RecipientAvatar from './RecipientAvatar';
// setting locale for moment js
moment.locale('vi');

const StyledMessage = styled.div`
  width: fit-content;
  word-break: break-all;
  max-width: 80%;
  padding: 12px;
  border-radius: 18px;
  position: relative;
  cursor: pointer;
`;

const StyledSenderMessage = styled(StyledMessage)`
  margin-left: auto;
  background-color: #0084ff;
  color: #ffffff;
`;

const StyledReceiverMessage = styled(StyledMessage)`
  background-color: #e4e6eb;
`;

// custom message tooltip
const MessageTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(() => ({
  [`& .${tooltipClasses.tooltip}`]: {
    padding: '10px',
    boxShadow: '1px 2px 5px rgba(0, 0, 0, 0.4)',
    borderRadius: '10px',
    backgroundColor: 'black',
    fontSize: '12px',
    color: '#ccc',
    fontWeight: 'bold',
  },
}));

const StyledMessageContainer = styled.div`
  display: flex;
  align-items: center;
`;

const Message = ({
  message,
  recipient,
  recipientEmail,
}: {
  message: IMessage;
  recipient: AppUser | undefined;
  recipientEmail: string | undefined;
}) => {
  const [loggedInUser, _loading, _error] = useAuthState(auth);
  const today = new Date().toDateString();
  const isCurrentDate = today === new Date(message.sent_at).toDateString();

  const messageTimeStamp = isCurrentDate
    ? moment(message.sent_at).format(FORMAT_TIME)
    : moment(message.sent_at).format(FORMAT_DATE_TIME);

  const isSender = loggedInUser?.email === message.user;
  const MessageType = isSender ? StyledSenderMessage : StyledReceiverMessage;
  const tooltipType = isSender ? 'left' : 'right';
  return (
    <StyledMessageContainer style={{ display: 'flex' }}>
      {!isSender && recipientEmail && (
        <MessageTooltip title={recipient?.displayName ? recipient.displayName : recipientEmail} placement="left">
          <div>
            <RecipientAvatar recipient={recipient} recipientEmail={recipientEmail} />
          </div>
        </MessageTooltip>
      )}
      <MessageTooltip title={messageTimeStamp} placement={tooltipType}>
        <MessageType>{message.text}</MessageType>
      </MessageTooltip>
    </StyledMessageContainer>
  );
};
export default Message;
