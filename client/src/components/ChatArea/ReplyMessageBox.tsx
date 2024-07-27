import CircleX from "../../interface/CircleX";

const ReplyMessageBox = (props: any) => {
  const { reply, onSetReplyClick } = props;
  return (
    <>
      <div className="ps-10">
        <div className="flex items-center border-l-4 border-orange bg-gray p-3 rounded-xl">
          <div className="flex flex-col flex-1 text-sm">
            <div className="font-semibold text-orange">{reply.ReplySender}</div>
            <div>{reply.ReplyContent}</div>
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
      </div>
    </>
  );
};

export default ReplyMessageBox;
