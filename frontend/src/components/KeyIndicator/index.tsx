// key indicator for dashboard
type keyIndicatorType = {
  icon: React.ReactNode;
  color: {
    bg: string;
    text: string;
  };
  title: string;
  value?: number;
};
const KeyIndicator = ({ icon, color, title, value = 0 }: keyIndicatorType) => {
  return (
    <section className="flex h-[90%] w-[40%] flex-col items-center rounded-lg bg-[#ececec] shadow-md">
      {/* <div className={`mt-3 h-fit w-fit ${color.bg} px-1 py-[0.15rem]`}>
        <span className={`font-semibold ${color.text}`}> */}
      <div className="mt-3 h-fit w-fit px-1 py-[0.15rem]">
        <span className="font-semibold">
          {icon}
          {title}
        </span>
      </div>
      <div className="flex h-full w-full items-center justify-center">
        <div className={`${color.bg} flex h-[60%] w-[65%] items-center justify-center`}>
          <span className={`text-[3rem] font-semibold ${color.text}`}>{value}</span>
        </div>
      </div>
    </section>
  );
};

export default KeyIndicator;
