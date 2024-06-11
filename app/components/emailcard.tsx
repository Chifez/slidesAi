const Emailcard = (props: {
  item: { title: any; body: any; classification: any };
}) => {
  const { title, body, classification } = props.item;

  const LABEL_CLASS = {
    Important: 'text-blue-800',
    Promotional: 'text-green-800',
    Social: 'text-yellow-800',
    Spam: 'text-red-800',
  };
  return (
    <div className="w-full h-[10rem] bg-black text-white justify-around p-4 border border-gray-200 rounded-md">
      <span className=" flex items-center justify-between mb-2 overflow-hidden">
        <h1 className="font-semibold line-clamp-1">{title}</h1>

        {classification && (
          <p
            className={` font-bold text-xl capitalize ${LABEL_CLASS[classification]} "
      `}
          >
            {classification}
          </p>
        )}
      </span>
      <div className="overflow-scroll h-[80%] no-scrollbar">
        <p className=" line-clamp-5 text-wrap break-all ">{body}</p>
      </div>
    </div>
  );
};

export default Emailcard;
