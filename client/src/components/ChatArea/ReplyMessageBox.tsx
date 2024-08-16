import CircleX from "../../interface/CircleX";

const ReplyMessageBox = (props: any) => {
  const { reply, onSetReplyClick } = props;
  return (
    <div className="flex items-center border-l-4 border-orange bg-gray p-3 rounded-xl w-full break-words">
      <div className="flex flex-col flex-1 text-sm w-5/6">
        <div className="font-semibold text-orange">{reply.ReplySender}</div>
        <div className="max-w-full overflow-wrap break-words text-wrap">{reply.ReplyContent}</div>
      </div>
      <div
        className="cursor-pointer"
        onClick={() => {
          onSetReplyClick(null, null, null, null);
        }}
      >
        <CircleX size="20" className="text-orange" />
      </div>
    </div>

  );
};

export default ReplyMessageBox;
