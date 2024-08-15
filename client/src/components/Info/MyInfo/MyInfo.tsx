import { motion } from "framer-motion";
import { useMenu } from "../../../hooks/useMenu";
import { BsThreeDotsVertical } from "react-icons/bs";
import { MdEdit } from "react-icons/md";
import useMyInfo from "../../../hooks/useMyInfo";
import Emoji_Picker from "../../Emoji_Picker";
import { AiOutlineCheck } from "react-icons/ai";
import { Switches } from '../../../interface/Switches'

export default function MyInfo() {
  const {
    user,
    userName,
    setUserName,
    userDesc,
    setUserDesc,
    userAvatar,
    setUserAvatar,
    setUserAvatarFile,
    isActiveChecked,
    setIsActiveChecked,
    isLastSeenChecked,
    setisLastSeenChecked,
    handleEditUserNameClick,
    handleEditUserDescClick,
    updateUser,
    handleImageChange,
    updating,
    setUpdating,
    signout
  } = useMyInfo();

  const { showMenu, setShowMenu, menuRef } = useMenu();

  if (user === null) {
    return (
      <div className="w-full h-full flex flex-col gap-2 overflow-y-scroll no-scrollbar"></div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col gap-2 overflow-y-scroll no-scrollbar">
      <div className="bg-white rounded-2xl p-4">
        <div className="flex justify-end relative" ref={menuRef}>
          {showMenu && (
            <motion.div
              initial={{ opacity: 0, y: "-50%" }}
              animate={{ opacity: 1, y: "0%" }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-lg py-2 shadow absolute top-0 right-0"
            >
              <ul>
                {(
                  <>
                    <li onClick={signout} className="px-4 py-1 hover:bg-gray-100 cursor-pointer">
                      Logout
                    </li>
                  </>
                )}
              </ul>
            </motion.div>
          )}
          <BsThreeDotsVertical onClick={() => setShowMenu(!updating && true)} className="cursor-pointer" />
        </div>
        <div className="bg-white rounded-2xl p-4">
          <div className="relative rounded-full overflow-hidden mx-auto w-44 h-44 aspect-square group cursor-pointer bg-gray">
            <div
              onClick={() => document.getElementById("file-input")?.click()}
              className="flex justify-center items-center absolute top-0 left-0 bg-gray-200 w-full h-full opacity-0 group-hover:opacity-100 group-hover:bg-opacity-60"
            >
              <MdEdit size={40} className="cursor-pointer" />
            </div>
            <img
              src={userAvatar === null ? user.Avatar : userAvatar}
              alt="avatar"
              className={`w-full h-full object-cover ${updating ? "animate-pulse" : ""
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
                  setUserAvatarFile(null);
                }}
                className="bg-black disabled:bg-opacity-70 text-white text-lg- px-4 py-2 rounded-lg"
              >
                Cancel
              </button>
            </div>
          )}
          <div className="flex gap-2 items-center justify-center">
            {userName === null ? (
              <h1 className="text-2xl font-semibold ml-9 text-wrap text-center">
                {user.Name}
              </h1>
            ) : (
              <form
                onSubmit={updateUser}
                className="relative flex items-center gap-2 text-2xl border-b-2 p-2"
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
            <a
              href="mailto:mu8494759@gmail.com"
            >
              {user?.Email}
            </a>
          </div>
        </div>
      </div>
      <div className="bg-white pl-5 py-3 rounded-2xl">
        <h1 className="text-gray-300">Bio</h1>
        <div className=" flex gap-2 items-center w-fit max-w-full">
          {userDesc === null ? (
            <p className="w-full text-wrap text-center">{user?.Bio}</p>
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
      <div className="bg-white rounded-2xl p-4">
        <Switches title={"Active privacy"} isChecked={isActiveChecked} setIsChecked={setIsActiveChecked} />
        <Switches title={"Last seen and online"} isChecked={isLastSeenChecked} setIsChecked={setisLastSeenChecked} />
      </div>
    </div>
  );
}
