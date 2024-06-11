const Emailcard = (props: {
  item: { title: any; body: any; classification: any };
}) => {
  const { title, body, classification } = props.item;

  const LABEL_CLASS = {
    important: 'text-blue-800',
    promotional: 'text-green-800',
    social: 'text-yellow-800',
    spam: 'text-red-800',
  };
  return (
    <div className="w-full h-[10rem] flex items-center bg-black text-white justify-around p-4 border border-gray-200 rounded-md">
      <span>
        <h1 className="font-semibold">{title}</h1>
        <p className=" line-clamp-5 text-wrap break-all ">{body}</p>
      </span>
      {classification && (
        <p
          className={` ${LABEL_CLASS[classification]} font-bold"
      `}
        >
          {classification}
        </p>
      )}
    </div>
  );
};

export default Emailcard;
