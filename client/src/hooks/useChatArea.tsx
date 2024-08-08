import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  getMessageByChatIdApi,
  sendMessageToChatApi,
} from "../api/message.api";
import { useDispatch, useSelector } from "react-redux";
import MessageResponse from "../types/MessageResponse.type";
import { setError } from "../redux/slices/error";
import { getSocket } from "../config/scoket.config";
import ChatHeaderResponse from "../types/chatHeaderReponse.type";
import { RootState } from "../redux/store";
import Reply from "../types/reply.type";
import { setPersonalChats } from "../redux/slices/personalChats";
import { setGroupChats } from "../redux/slices/groupChats";
import { setPinnedChats } from "../redux/slices/pinnedChats";
import { setArchiveChats } from "../redux/slices/archiveChats";

// Define the types for the message

export default function useChatArea() {
  const { personalChats } = useSelector((state: RootState) => state.personalChats);
  const { groupChats } = useSelector((state: RootState) => state.groupChats);
  const { pinnedChats } = useSelector((state: RootState) => state.pinnedChats);
  const { archiveChats } = useSelector((state: RootState) => state.archiveChats);

  const socket = getSocket();
  const [Content, setContent] = useState("");
  const { chatId } = useParams<{ chatId: string }>();
  const [messages, setMessages] = useState<MessageResponse[]>([]);
  const [chatHeaderData, setChatHeaderData] =
    useState<ChatHeaderResponse | null>(null);
  const { user } = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();
  const [reply, setReply] = useState<Reply>({ ReplyId: null, ReplyContent: null, ReplySenderId: null, ReplySender: null, });

  // update reply state on click
  const onSetReplyClick = (
    ReplyId: number,
    ReplyContent: string,
    ReplySenderId: number,
    ReplySender: string
  ) => {
    setReply({ ReplyId, ReplyContent, ReplySenderId, ReplySender });
  };

  const addDummyMessageObjectToMessageArray = async (
    Content: string,
    reply: Reply
  ) => {

    // Create a new message object
    const newMessage: MessageResponse = {
      Content,
      ChatId: parseInt(chatId ? chatId : 'This is not Possible.'),
      MessageId: -1,
      Timestamp: "",
      SenderId: user !== null ? user.UserId : -1,
      Sender: user !== null ? user.Name : 'Why not you stupid Bastard',
      UserStatus: [{ Status: "sending", UserId: -1, UserName: "" }],
      ReplyId: reply.ReplyId,
      ReplyContent: reply.ReplyContent,
      ReplySenderId: reply.ReplySenderId,
      ReplySender: reply.ReplySender
    };
    setMessages((prevMessages) => {
      const updatedMessages = [newMessage, ...prevMessages];
      return updatedMessages;
    });
  };

  // ** GET MESSAGE LOGIC STARTS HERE

  const fetchMessages = async (skip?: number): Promise<boolean> => {
    if (typeof skip === 'undefined') {
      skip = messages.length
    }
    const res = await getMessageByChatIdApi(chatId, skip);
    if (res.success) {
      setChatHeaderData(res.chatHeaderData);
      if (res.data.length === 0) {
        return true; // No more messages to load so indicate no more load
      }
      setMessages((prevMessages) => [...prevMessages, ...res.data]);
    } else {
      dispatch(setError(res.message));
    }
    return false;
  };
  // GET MESSAGE LOGIC ENDS HERE **

  // ** SEND MESSAGE LOGIC STARTS HERE

  // Handling change of content when message is typed
  const onContentChange = (value: string) => {
    if (socket) {
      socket.emit("startTyping", chatId, user?.Name);
    }
    setContent(value);
  };

  // handle send message button click
  const onSendMessageIconClick = async (chatId: any) => {
    // in order to clear the text field immediately, gives fast user experience
    const tempContent = Content;
    const tempReply: Reply = reply;
    setContent("");
    setReply({
      ReplyId: null,
      ReplyContent: null,
      ReplySenderId: null,
      ReplySender: null,
    });

    // Showing dummy message on the frontend
    await addDummyMessageObjectToMessageArray(tempContent, tempReply);
    const response = await sendMessageToChatApi(
      chatId,
      tempContent,
      tempReply.ReplyId
    );
    // socket trigger to push notification
    if (response.success) {
      // socket trigger to update seen status for each member of chat
      socket?.emit("messageSent", response.data.MessageId);
    }
    else {
      // Showing that message was not sent and error occurred
      setMessages((prevMessages) => {
        return prevMessages.map((message) =>
          message.MessageId === -1
            ? {
              ...message,
              UserStatus: [{ Status: "error", UserId: -1, UserName: "" }],
            }
            : message
        );
      });
      dispatch(setError(response.message));
    }

    // setting the reply state to null after message sent
    setReply({
      ReplyId: null,
      ReplyContent: null,
      ReplySenderId: null,
      ReplySender: null,
    });
  };

  // SEND MESSAGE LOGIN ENDS HERE **

  const messageReceived = (data?: any) => {
    const { ChatId, Content, Timestamp, UserStatus, Sender, SenderId } = data;

    // local function that actually return the passed state with updated status
    const updateChatArray = (chats: any) => {
      return chats.map((chat: any) => {
        if (chat.ChatId == ChatId) { // this is the chat i want to push notification to
          if (chat.ChatId == chatId) { // this chat is in view
            return {
              ...chat,
              SenderName: Sender,
              SenderId,
              Content,
              Timestamp,
              UserStatus,
              unSeenMessages: 0,
            };
          } else { // chat not in view
            return {
              ...chat,
              Content,
              Timestamp,
              UserStatus,
              unSeenMessages: (chat.unSeenMessages || 0) + 1,
            };
          }
        }
        return chat;
      });
    };

    dispatch(setPersonalChats(updateChatArray(personalChats)));
    dispatch(setGroupChats(updateChatArray(groupChats)));
    dispatch(setPinnedChats(updateChatArray(pinnedChats)));
    dispatch(setArchiveChats(updateChatArray(archiveChats)));
  };

  const allMessagesSeen = () => {
    // local function that actually return the passed state with updated status
    const updateChatArray = (chats: any) => {
      return chats.map((chat: any) => {
        // if (chat.ChatId == chatId) { // this is the chat i want to push notification to
        return {
          ...chat,
          unSeenMessages: 0,
        };

        // }
        // return chat;
      });
    };

    dispatch(setPersonalChats(updateChatArray(personalChats)));
    dispatch(setGroupChats(updateChatArray(groupChats)));
    dispatch(setPinnedChats(updateChatArray(pinnedChats)));
    dispatch(setArchiveChats(updateChatArray(archiveChats)));
  };

  useEffect(() => {
    if (socket) {
      // socket function that listen to the message that is newly received (wether i sent it or anyone else)
      socket.on("messageReceived", (data) => {
        messageReceived(data) // function to update chat list on left (main area)
        if (data.ChatId == chatId) { // do only if we have oppened the same chat
          setMessages((prevMessages) => {
            const updatedMessages = prevMessages.filter(
              (message) => message.MessageId !== -1
            );

            return [data, ...updatedMessages];
          });
          socket.emit('singleMessageSeen', data.MessageId);
        } else {
          document.getElementById("notification")?.click(); // if this chat is not view whose message is received than play audio
        }
      });

      // the user with userId opened chat and seen all the messages (this user is garaunteed not to be me)
      socket.on('seenAllMessage', ({ userId }) => {
        setMessages((prevMessages) => {
          const updatedMessages = prevMessages.map((message) => ({
            ...message,
            UserStatus: message.UserStatus.map((status) =>
              status.UserId == userId ? { ...status, Status: 'seen' } : status
            ),
          }));
          return updatedMessages;
        });
      });

      socket.on('singleMessageHasBeenSeen', (data: any) => {
        setMessages((prevMessages) => {
          const updateSeenMessage = prevMessages.map((message) => {
            if (message.MessageId == data.MessageId) {
              return { ...message, ...data };
            } else {
              return message
            }
          })
          return updateSeenMessage;
        })
      })

      // Clean up the socket listener when the component unmounts
      return () => {
        socket.off("messageReceived");
        socket.off("seenAllMessage");
        socket.off("singleMessageHasBeenSeen");
      };
    }
  }, [socket, chatId, personalChats, groupChats, archiveChats, pinnedChats]);

  useEffect(() => {
    setMessages([]);
    if (socket) {
      allMessagesSeen();
      socket.emit('chatOpened', chatId);
      return () => {
        socket.off("chatOpened");
      }
    }
  }, [socket, chatId]);


  return {
    onContentChange,
    Content,
    setContent,
    setMessages,
    messages,
    chatHeaderData,
    onSendMessageIconClick,
    fetchMessages,
    reply,
    onSetReplyClick,
  };
}
