import { getFriendInfoApi } from "../../../api/user.api";
import { signoutApi } from "../../../api/auth.api";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { setError } from "../../../redux/slices/error";
import { useMenu } from "../../../hooks/useMenu";
import { usePiningChat } from "../../../hooks/usePiningChat";
import { useChatArchiving } from "../../../hooks/useArchivingChat";
import { ClipLoader } from "react-spinners";
import themeColor from "../../../config/theme.config";
import { BsThreeDotsVertical } from "react-icons/bs";
import { RootState } from "../../../redux/store";
import { MdEdit } from "react-icons/md";
import usePersonalInfo from "../../../hooks/usePersonalInfo";
import Emoji_Picker from "../../Emoji_Picker";
import { AiOutlineCheck } from "react-icons/ai";
// import { Link } from "react-router-dom";
import {Switches} from '../../../elements/Switches'

export default function MyInfo() {
  const {
    userInfo,
    setUserInfo,
    userName,
    setUserName,
    userDesc,
    setUserDesc,
    userAvatar,
    setUserAvatar,
    handleEditUserNameClick,
    handleEditUserDescClick,
    updateUser,
    handleImageChange,
    updating,
    setUpdating,
  } = usePersonalInfo();
  const [isActiveChecked, setIsActiveChecked] = useState(false);
  const [isLastSeenChecked, setisLastSeenChecked] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);
  const { user } = useSelector((state: RootState) => state.user);
  const { showMenu, setShowMenu, menuRef } = useMenu();
  const dispatch = useDispatch();
  
  const getFriendInfo = async () => {
    if (user) {
      const res = await getFriendInfoApi(user.UserId, user.UserId);
      if (res.success) {
        setUserInfo(res.data);
      } else {
        dispatch(setError(res.message));
      }
    }
  };

  const { isArchived, archiveChat, unArchiveChat } = useChatArchiving({
    chatId:
      userInfo !== null && userInfo.ChatId !== null ? userInfo.ChatId : -1,
    chatType: "personal",
    setLoading,
  });
  const { isPinned, pinChat, unPinChat } = usePiningChat({
    chatId:
    userInfo !== null && userInfo.ChatId !== null ? userInfo.ChatId : -1,
    chatType: "personal",
    setLoading,
  });
  
  useEffect(() => {
    getFriendInfo();
  }, []);

  if (userInfo === null) {
    return (
      <div className="w-2/3 min-w-[820px] h-full flex flex-col gap-2 overflow-y-scroll no-scrollbar"></div>
    );
  }

  return (
    <div className="w-2/3 min-w-[820px] h-full flex flex-col gap-2 overflow-y-scroll no-scrollbar">
      <div className="bg-white rounded-2xl p-4">
        {userInfo.ChatId && (
          <div className="flex justify-end relative" ref={menuRef}>
            {showMenu && (
              <motion.div
                initial={{ opacity: 0, y: "-50%" }}
                animate={{ opacity: 1, y: "0%" }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-lg py-2 shadow absolute top-0 right-0"
              >
                <ul>
                  {isArchived ? ( // first check if chat is archive if yes than user can unarchive it
                    // only if no than check uf chat is pinned if yes than user can only unpin
                    // it or archive it if no user can pin it or archive it
                    <li
                      onClick={() => {
                        setShowMenu(false);
                        unArchiveChat();
                      }}
                      className="px-4 py-1 hover:bg-gray-100 cursor-pointer"
                    >
                      UnArchive Chat
                    </li>
                  ) : (
                    <>
                      <li
                        onClick={() => {
                          setShowMenu(false);
                          archiveChat();
                        }}
                        className="px-4 py-1 hover:bg-gray-100 cursor-pointer"
                      >
                        Archive Chat
                      </li>
                      {isPinned ? (
                        <li
                          onClick={() => {
                            setShowMenu(false);
                            unPinChat();
                          }}
                          className="px-4 py-1 hover:bg-gray-100 cursor-pointer"
                        >
                          UnPin Chat
                        </li>
                      ) : (
                        <li
                          onClick={() => {
                            setShowMenu(false);
                            pinChat();
                          }}
                          className="px-4 py-1 hover:bg-gray-100 cursor-pointer"
                        >
                          Pin Chat
                        </li>
                      )}
                      <li
                        onClick={() => {
                          signoutApi();
                        }}
                        className="px-4 py-1 hover:bg-gray-100 cursor-pointer"
                      >
                        Logout
                      </li>
                    </>
                  )}
                  {/* <li onClick={leaveGroup} className="px-4 py-1 hover:bg-gray-100 cursor-pointer">Leave Group</li> */}
                </ul>
                className="text-gray-300 hover:text-blue-400"
              </motion.div>
            )}
            {loading ? (
              <ClipLoader size={20} color={themeColor} />
            ) : (
              <BsThreeDotsVertical
                onClick={() => setShowMenu(true)}
                className="cursor-pointer"
              />
            )}
          </div>
        )}
        <div className="w-2/3 min-w-[820px] h-full flex flex-col gap-2 overflow-y-scroll no-scrollbar">
          <div className="bg-white rounded-2xl p-4">
            <div className="relative rounded-full overflow-hidden mx-auto w-44 h-44 group cursor-pointer bg-gray">
              <div
                onClick={() => document.getElementById("file-input")?.click()}
                className="flex justify-center items-center absolute top-0 left-0 bg-gray-200 w-full h-full opacity-0 group-hover:opacity-100 group-hover:bg-opacity-60"
              >
                <MdEdit size={40} className="cursor-pointer" />
              </div>
              <img
                src={userAvatar === null ? userInfo.Avatar : userAvatar}
                alt="avatar"
                className={`w-full h-full object-cover ${
                  updating ? "animate-pulse" : ""
                }`}
              />
              <input
                type="file"
                id="file-input"
                accept="image/*"
                onChange={handleImageChange}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
            </div>
            {userAvatar !== null && (
              <div className="flex justify-center mt-2 gap-2">
                <button
                  disabled={updating}
                  onClick={updateUser}
                  className="bg-orange disabled:bg-opacity-70 text-white text-lg- px-4 py-2 rounded-lg"
                >
                  Upload
                </button>
                <button
                  disabled={updating}
                  onClick={() => {
                    setUserAvatar(null);
                    setUpdating(false);
                  }}
                  className="bg-black disabled:bg-opacity-70 text-white text-lg- px-4 py-2 rounded-lg"
                >
                  Cancel
                </button>
              </div>
            )}
            <div className="flex  gap-2 items-center justify-center">
              {userName === null ? (
                <h1 className="text-2xl font-semibold ml-9">
                  {userInfo.Name}
                  <span className="ml-3">(You)</span>
                </h1>
              ) : (
                <form
                  onSubmit={updateUser}
                  className="relative flex gap-2 text-2xl border-b-2 p-2"
                >
                  <input
                    required
                    className="font-semibold focus:outline-none"
                    type="text"
                    placeholder="Group Name"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                  />
                  <Emoji_Picker
                    emojiPicketClassName="top-[60px] right-0"
                    onPickup={(emoji: string) => {
                      setUserName(`${userName}${emoji}`);
                    }}
                  />
                  <button type="submit">
                    <AiOutlineCheck className="cursor-pointer" size={26} />
                  </button>
                </form>
              )}
              <MdEdit
                onClick={handleEditUserNameClick}
                size={25}
                className="cursor-pointer"
              />
            </div>
            <div className="w-fit mx-auto">
              {" "}
              <a
                href="mailto:mu8494759@gmail.com"
              >
                {userInfo?.Email}
              </a>
            </div>
            {/* {userInfo?.ChatId && (
              <div className="flex justify-center mt-5 gap-2">
                <Link
                  to={`/chat/${userInfo?.ChatId}`}
                  className="border border-black p-4 flex items-center justify-center rounded-md group hover:bg-black cursor-pointer"
                >
                  <MdOutlineMessage
                    size={30}
                    className="text-black group-hover:text-white"
                  />
                </Link>
              </div>
            )} */}
          </div>
          <div className="bg-white pl-5 py-3 rounded-md">
            <h1 className="text-gray-300">Bio</h1>
            <div className=" flex gap-2 items-center">
              {userDesc === null ? (
                <p>{userInfo?.Bio}</p>
              ) : (
                <form
                  onSubmit={updateUser}
                  className="flex gap-2 border-b-2 p-2 w-full"
                >
                  <input
                    required
                    className="focus:outline-none w-full"
                    type="text"
                    placeholder="Group Name"
                    value={userDesc}
                    onChange={(e) => setUserDesc(e.target.value)}
                  />
                  <Emoji_Picker
                    emojiPicketClassName="top-[60px] right-[20px] "
                    onPickup={(emoji: string) => {
                      setUserDesc(`${userDesc}${emoji}`);
                    }}
                  />
                  <button type="submit">
                    <AiOutlineCheck className=" cursor-pointer" size={25} />
                  </button>
                </form>
              )}
              <MdEdit
                onClick={handleEditUserDescClick}
                size={25}
                className="cursor-pointer"
              />
            </div>
          </div>
          <div className="bg-white rounded-2xl py-4">
          <Switches title={"Active privacy"} isChecked={isActiveChecked} setIsChecked={setIsActiveChecked}/>
          <Switches title={"Last seen and online"} isChecked={isLastSeenChecked} setIsChecked={setisLastSeenChecked}/>
          </div>
        </div>
      </div>
    </div>
  );
}
