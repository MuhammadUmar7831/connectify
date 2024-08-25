import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  editMessageApi,
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
import { getChatHeaderDataApi } from "../api/chat.api";
import { getUserApi } from "../api/user.api";
import { setSuccess } from "../redux/slices/success";

// Define the types for the message

export default function useChatArea() {
  const { personalChats } = useSelector((state: RootState) => state.personalChats);
  const { groupChats } = useSelector((state: RootState) => state.groupChats);
  const { pinnedChats } = useSelector((state: RootState) => state.pinnedChats);
  const { archiveChats } = useSelector((state: RootState) => state.archiveChats);

  const socket = getSocket();
  const [Content, setContent] = useState("");
  let { chatId } = useParams<{ chatId: string }>();
  const [messages, setMessages] = useState<MessageResponse[]>([]);
  const [chatHeaderData, setChatHeaderData] =
    useState<ChatHeaderResponse | null>(null);
  const { user } = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();
  const [reply, setReply] = useState<Reply>({ ReplyId: null, ReplyContent: null, ReplySenderId: null, ReplySender: null, });
  const navigate = useNavigate();

  // update reply state on click
  const onSetReplyClick = (
    ReplyId: number,
    ReplyContent: string,
    ReplySenderId: number,
    ReplySender: string
  ) => {
    setReply({ ReplyId, ReplyContent, ReplySenderId, ReplySender });
  };
  const sendInput: HTMLElement | null = document.getElementById('sendMessageInput')
  if (sendInput !== null)
    sendInput.focus();

  const addDummyMessageObjectToMessageArray = async (
    Content: string,
    reply: Reply
  ) => {

    // Create a new message object
    const newMessage: MessageResponse = {
      Content,
      ChatId: parseInt(chatId ? chatId : 'This is not Possible.'),
      MessageId: -1,
      Timestamp: new Date().toISOString(),
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
      if (res.data.length === 0) {
        return true; // No more messages to load so indicate no more load
      }
      setMessages((prevMessages) => [...prevMessages, ...res.data]);
    } else {
      dispatch(setError(res.message));
      navigate("/")
    }
    return false;
  };
  // GET MESSAGE LOGIC ENDS HERE **

  const getChatHeaderData = async () => {
    if (!chatId) {
      return;
    }

    if (chatId.startsWith('new')) { // the chat is not created so we have fetch the data of user with id 'new:userId'
      if (isNaN(parseInt(chatId.slice(3)))) { return } // invalid userId
      const res = await getUserApi(parseInt(chatId.slice(3)));
      if (!res.success) {
        dispatch(setError(res.message));
        navigate("/")
      } else {
        const headerData: ChatHeaderResponse = { // transform user data into chat header data
          ChatName: res.user.Name,
          ChatAvatar: res.user.Avatar,
          InfoId: res.user.UserId,
          Type: 'Personal',
          Members: [{
            Avatar: res.user.Avatar,
            Name: res.user.Name,
            UserId: res.user.UserId,
            IsActivePrivacy: res.user.IsActivePrivacy,
            IsLastSeenPrivacy: res.user.IsLastSeenPrivacy,
            LastSeen: res.user.LastSeen,
          }, {
            Avatar: user?.Avatar,
            Name: user?.Name,
            UserId: user?.UserId,
            IsActivePrivacy: user?.IsActivePrivacy,
            IsLastSeenPrivacy: user?.IsLastSeenPrivacy,
            LastSeen: user?.LastSeen,
          }
          ]
        }
        setChatHeaderData(headerData);
      }
    } else { // user is not new
      if (isNaN(parseInt(chatId))) { return } // invalid chat id
      const res = await getChatHeaderDataApi(parseInt(chatId));
      if (res.success) {
        setChatHeaderData(res.data)
      }
      else {
        dispatch(setError(res.message));
        navigate("/")
      }
    }

  }

  // ** SEND MESSAGE LOGIC STARTS HERE

  // Handling change of content when message is typed
  const onContentChange = (value: string) => {
    if (socket) {
      socket.emit("startTyping", chatId, user?.Name);
    }
    setContent(value);
  };

  // handle send message button click
  const onSendMessageIconClick = async () => {
    if (!chatId) return;
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
    let receiverId: number | null = null
    let _chatId: number | boolean = parseInt(chatId);

    //case if the chat is not created so send will create new
    if (chatId.startsWith('new')) {
      receiverId = parseInt(chatId.slice(3));
      _chatId = false;
    }

    // Showing dummy message on the frontend
    await addDummyMessageObjectToMessageArray(tempContent, tempReply);
    const response = await sendMessageToChatApi(
      _chatId,
      tempContent,
      tempReply.ReplyId,
      receiverId
    );
    // socket trigger to push notification
    if (response.success) {
      if (chatId.startsWith('new')) {
        // TODO: create a new room and join user in that room
        const data = {
          chatId: response.data.ChatId,
          type: 'personal',
          members: [user?.UserId, receiverId]
        }
        socket?.emit("chatCreated", data);
        navigate(`/chat/${response.data.ChatId}`)
      }
      if (!chatId.startsWith('new')) { // emit function only if the chat is not new
        // socket trigger to update seen status for each member of chat
        socket?.emit("messageSent", response.data.MessageId);
      }
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

  // Edit MESSAGE LOGIN STARTS HERE **
  const editMessage = async ({ MessageId, Content }: { MessageId: number, Content: string }) => {
    if (!chatId) return false;
    const res = await editMessageApi(parseInt(chatId), MessageId, Content);
    if (res.success) {
      socket?.emit('editMessage', MessageId, Content, chatId);
      dispatch(setSuccess(res.message));
      return true;
    } else {
      dispatch(setError(res.message));
      return false;
    }
  }
  // Edit MESSAGE LOGIN ENDS HERE **

  useEffect(() => {
    if (socket && chatId) {
      // socket function that listen to the message that is newly received (wether i sent it or anyone else)
      socket.on("messageReceived", (data) => {
        if (data.ChatId == chatId) { // do only if we have oppened the same chat

          setMessages((prevMessages) => {
            const updatedMessages = prevMessages.filter(
              (message) => message.MessageId !== -1
            );

            console.log("new", [data, ...updatedMessages])
            return [data, ...updatedMessages];
          });
          // singleMessageSeen emitted
          socket.emit('singleMessageSeen', data.MessageId);
        }
      });

      // the user with userId opened chat and seen all the messages (this user is garaunteed not to be me)
      socket.on('seenAllMessage', (userId: string, _chatId: string) => {
        if (chatId === _chatId) {
          setMessages((prevMessages) => {
            const updatedMessages = prevMessages.map((message) => ({
              ...message,
              UserStatus: message.UserStatus.map((status) =>
                status.UserId === parseInt(userId) ? { ...status, Status: 'seen' } : status
              ),
            }));
            return updatedMessages;
          });
        }
      });

      socket.on('singleMessageHasBeenSeen', (userId: string, _chatId: number, messageId: number) => {
        // singleMessageHasBeenSeen is being listened
        if (chatId && parseInt(chatId) === _chatId) {
          setMessages((prevMessages) => {
            const updateSeenMessage = prevMessages.map((message) => {
              if (message.MessageId === messageId) {
                return {
                  ...message,
                  UserStatus: message.UserStatus.map((status) =>
                    status.UserId === parseInt(userId) ? { ...status, Status: 'seen' } : status
                  )
                };
              } else {
                return message
              }
            })
            return updateSeenMessage;
          })
        }
      })

      socket.on("userOnline", (userId: string) =>
        setMessages((prevMessages) => {
          const updatedMessages = prevMessages.map((message) => ({
            ...message,
            UserStatus: message.UserStatus.map((status) =>
              status.UserId === parseInt(userId) && status.Status === 'sent' ?
                { ...status, Status: 'received' }
                : status
            ),
          }));
          return updatedMessages;
        }));

      socket.on("messageEdited", (messageId: number, content: string, _chatId: string) => {
        if (_chatId != chatId) return;
        console.log(messageId, content, chatId);
        setMessages((prevMessages) => {
          const updatedMessages = prevMessages.map((message) => {
            if (message.MessageId === messageId) {
              return { ...message, Content: content, isEdited: true }
            } else {
              return message
            }
          })
          console.log(updatedMessages)
          return [...updatedMessages];
        })
      })

      // Clean up the socket listener when the component unmounts
      return () => {
        socket.off("messageReceived");
        socket.off("seenAllMessage");
        socket.off("singleMessageHasBeenSeen");
        socket.off("userOnline");
        socket.off("messageEdited");
      };
    }
  }, [socket, chatId, personalChats, groupChats, archiveChats, pinnedChats]);

  useEffect(() => {
    setMessages([]);
  }, [socket, chatId]);

  useEffect(() => {
    if (typeof chatId === 'string') {
      setChatHeaderData(null);
      // setMessages([]);
      if (chatId.startsWith('new')) {
        const userId = chatId.slice(3);
        if (isNaN(parseInt(userId))) {
          dispatch(setError('Invalid URL: User ID is not valid'));
          navigate("/")
        } else if (parseInt(userId) === user?.UserId) {
          dispatch(setError('Invalid URL You Really want to Chat with Yourself'));
          navigate("/")
        }
      } else {
        if (isNaN(parseInt(chatId))) {
          dispatch(setError('Invalid URL: Chat ID should be a number'));
          navigate("/")
        }
        fetchMessages(0);
      }
      getChatHeaderData();
    } else {
      dispatch(setError('Invalid URL: Chat ID should be a valid number'));
      navigate("/")
    }

  }, [chatId]);

  useEffect(() => {
    if (chatId && personalChats && chatId.startsWith('new')) {
      const userId = parseInt(chatId.slice(3)); // Extract the userId from the chatId
      const existingChat = personalChats.find((pChat) => pChat.UserId === userId);

      if (existingChat) {
        navigate(`/chat/${existingChat.ChatId}`);
      }
    }
  }, [chatId, personalChats]);



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
    editMessage
  };
}
