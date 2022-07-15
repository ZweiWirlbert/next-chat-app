import Avatar from "@mui/material/Avatar";
import Tooltip from "@mui/material/Tooltip";
import styled from "styled-components";
import ChatIcon from "@mui/icons-material/Chat";
import MoreVerticalIcon from "@mui/icons-material/MoreVert";
import LogoutIcon from "@mui/icons-material/ExitToApp";
import SearchIcon from "@mui/icons-material/Search";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import { signOut } from "firebase/auth";
import { auth, db } from "../config/firebase";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import TextField from "@mui/material/TextField";
import DialogActions from "@mui/material/DialogActions";
import { useAuthState } from "react-firebase-hooks/auth";
import { useState } from "react";
import EmailValidator from "email-validator";
import { addDoc, collection, query, where } from "firebase/firestore";
import { useCollection } from "react-firebase-hooks/firestore";
import { Conversation } from "../types";
import { ConversationSelect } from "./ConversationSelect";

const StyledContainer = styled.div`
  height: 100vh;
  min-width: 300px;
  max-width: 350px;
  overflow-y: scroll;
  border-right: 1px solid whitesmoke;
  /* Hide scrollbar for Chrome, Safari and Opera */
  ::-webkit-scrollbar {
    display: none;
  }

  /* Hide scrollbar for IE, Edge and Firefox */
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
`;

const StyledHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 15px;
  height: 80px;
  border-bottom: 1px solid #e0e0e0;
  background-color: white;
  position: sticky;
  top: 0;
  z-index: 1;
`;

const StyledSearch = styled.div`
  display: flex;
  align-items: center;
  padding: 15px;
  border-radius: 2px;
  border-bottom: 1px solid whitesmoke;
`;

const StyledSearchInput = styled.input`
  outline: none;
  border: none;
  flex: 1;
`;

const StyledSidebarButton = styled(Button)`
  width: 100%;
  border-top: 1px solid whitesmoke;
  border-bottom: 1px solid whitesmoke;
`;

const StyledUserAvatar = styled(Avatar)`
  cursor: pointer;
  :hover {
    opacity: 0.8;
  }
`;

const Sidebar = () => {
  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.log("ERROR SIGN OUT", error);
    }
  };

  const [loggedInUser, _loading, _error] = useAuthState(auth);

  const [isOpenNewConversationDialog, setIsOpenNewConversationDialog] =
    useState(false);

  const [recipientEmail, setRecipientEmail] = useState("");

  const toggleNewConversationDialog = (isOpen: boolean) => {
    setIsOpenNewConversationDialog(isOpen);

    if (!isOpen) setRecipientEmail("");
  };

  const closeNewOpenConversationDialog = () => {
    toggleNewConversationDialog(false);
  };

  // check if conversation is already exists between the current user and recipient
  const queryGetConversationsForCurrentUser = query(
    collection(db, "conversations"),
    where("users", "array-contains", loggedInUser?.email)
  );
  const [conversationsSnapshot, __loading, __error] = useCollection(
    queryGetConversationsForCurrentUser
  );

  const isConversationAlreadyExists = (recipientEmail: string) => {
    return conversationsSnapshot?.docs.find((conversation) =>
      (conversation.data() as Conversation).users.includes(recipientEmail)
    );
  };

  const isInvitingSelf = recipientEmail === loggedInUser?.email;

  const createConversation = async () => {
    if (!recipientEmail) return;

    if (
      EmailValidator.validate(recipientEmail) &&
      !isInvitingSelf &&
      !isConversationAlreadyExists(recipientEmail)
    ) {
      //Add conversation user to db 'conversations' collections

      await addDoc(collection(db, "conversations"), {
        users: [loggedInUser?.email, recipientEmail],
      });
    }
    closeNewOpenConversationDialog();
  };
  return (
    <StyledContainer>
      <>
        <StyledHeader>
          <Tooltip title={loggedInUser?.email as string} placement="right">
            <StyledUserAvatar src={loggedInUser?.photoURL || ""} />
          </Tooltip>
          <div>
            <IconButton>
              <ChatIcon />
            </IconButton>
            <IconButton>
              <MoreVerticalIcon />
            </IconButton>
            <IconButton onClick={logout}>
              <LogoutIcon />
            </IconButton>
          </div>
        </StyledHeader>
        <StyledSearch>
          <SearchIcon />
          <StyledSearchInput placeholder="Search in conversations" />
        </StyledSearch>
        <StyledSidebarButton
          onClick={() => {
            toggleNewConversationDialog(true);
          }}
        >
          Start a new conversation
        </StyledSidebarButton>
        {/* Lists of conversations */}
        {conversationsSnapshot?.docs?.map((conversation) => (
          <ConversationSelect
            key={conversation.id}
            id={conversation.id}
            conversationUsers={(conversation?.data() as Conversation)?.users}
          />
        ))}

        <Dialog
          open={isOpenNewConversationDialog}
          onClose={closeNewOpenConversationDialog}
        >
          <DialogTitle>New Conversation</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Please enter a Google email address for the user you wish to chat
              with
            </DialogContentText>
            <TextField
              autoFocus
              label="Email Address"
              type="email"
              fullWidth
              variant="standard"
              value={recipientEmail}
              onChange={(e) => setRecipientEmail(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={closeNewOpenConversationDialog}>Cancel</Button>
            <Button disabled={!recipientEmail} onClick={createConversation}>
              Create
            </Button>
          </DialogActions>
        </Dialog>
      </>
    </StyledContainer>
  );
};

export default Sidebar;
