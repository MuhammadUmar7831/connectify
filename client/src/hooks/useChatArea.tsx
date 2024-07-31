import { ChangeEvent, useEffect, useState } from "react";
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

// Define the types for the message

export default function useChatArea() {
  const socket = getSocket();
  const [Content, setContent] = useState("");
  const { chatId } = useParams<{ chatId: string }>();
  const [messages, setMessages] = useState<MessageResponse[]>([]);
  const [chatHeaderData, setChatHeaderData] =
    useState<ChatHeaderResponse | null>(null);
  const { user } = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();
  const [seenMessages, setSeenMessages] = useState<boolean>(false);
  const [reply, setReply] = useState<Reply>({
    ReplyId: null,
    ReplyContent: null,
    ReplySenderId: null,
    ReplySender: null,
  });

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
    // Getting any message object of sender
    const messageFromSender = messages.find(
      (message) => message.SenderId === user?.UserId
    );

    if (messageFromSender) {
      // Create a new message object
      const newMessage: MessageResponse = {
        ...messageFromSender,
        Content,
        MessageId: -1,
        Timestamp: "",
        UserStatus: [{ Status: "sending", UserId: -1, UserName: "" }],
        ReplyId: reply.ReplyId,
        ReplyContent: reply.ReplyContent,
        ReplySenderId: reply.ReplySenderId,
        ReplySender: reply.ReplySender,
        // Add any other properties as needed
      };

      // Add the new message to the messages array
      setMessages((prevMessages) => {
        const updatedMessages = [...prevMessages, newMessage];
        return updatedMessages;
      });
    }
  };

  // ** GET MESSAGE LOGIC STARTS HERE

  const fetchMessages = async () => {
    const res = await getMessageByChatIdApi(chatId);
    if (res.success) {
      setChatHeaderData(res.chatHeaderData);
      setMessages(res.data);
    } else {
      dispatch(setError(res.message));
    }
  };
  // GET MESSAGE LOGIC ENDS HERE **

  // ** SEND MESSAGE LOGIC STARTS HERE

  // Handling change of content when message is typed
  const onContentChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (socket) {
      socket.emit("startTyping", chatId, user?.Name);
    }
    setContent(e.target.value);
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
    socket?.emit("messageSent", response.data.MessageId);
    // socket trigger to update seen status for each member of chat except me
    if (!response.success) {
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

  useEffect(() => {
    if (socket) {
      // socket function that listen to the message that is newly received (wether i sent it or anyone else)
      socket.on("messageReceived", (data) => {
        console.log(data.ChatId)
        console.log(chatId)
        console.log(data.ChatId == chatId)
        if (data.ChatId == chatId) { // do only if we have oppened the same chat
          setSeenMessages(false);
          setMessages((prevMessages) => {
            const updatedMessages = prevMessages.filter(
              (message) => message.MessageId !== -1
            );

            updatedMessages.push({
              ...data,
              UserStatus: data.UserStatus,
            });

            return updatedMessages;
          });
          socket.emit('singleMessageSeen', data.MessageId);
        } else {
          document.getElementById("notification")?.click(); // if this chat is not view whose message is received than play audio
        }
      });

      // the user with userId opened chat and seen all the messages (this user is garaunteed not to be me)
      socket.on('seenAllMessage', (userId) => {
        console.log('seenAllMessage', userId)
        setMessages((prevMessages) => {
          const updatedMessages = prevMessages.map((message) => ({
            ...message,
            UserStatus: message.UserStatus.map((status) =>
              status.UserId == userId ? { ...status, Status: 'seen' } : status
            ),
          }));
          console.log("updatedMessages", updatedMessages);
          setSeenMessages(true);
          return updatedMessages;
        });
      });

      socket.on('singleMessageHasBeenSeen', (data: any) => {
        console.log("data", data)
        setMessages((prevMessages) => {
          const updateSeenMessage = prevMessages.map((message) => {
            if (message.MessageId == data.MessageId) {
              console.log('first', { ...message, ...data })
              return { ...message, ...data };
            } else {
              return message
            }
          })
          console.log("updateSeenMessage", updateSeenMessage)
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
  }, [socket, chatId]);

  useEffect(() => {
    if (socket) {
      console.log('first')
      socket.emit('chatOpened', chatId);
      return () => {
        socket.off("chatOpened");
      }
    }
  }, [chatId])

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
