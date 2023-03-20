import { ReactComponent as CheckIcon } from '../../assets/icons/circle-check-regular.svg';

type IconTextProps = {
  width: string;
  text: string;
  color?: string;
  gap?: string;
  textSize?: string;
  children?: React.ReactNode;
  description?: {
    firstLine: string;
    secondLine: string;
  };
  showIcon?: boolean;
};

const IconText: React.FC<IconTextProps> = (props) => {
  const { text, children, width, description, color, gap, textSize, showIcon } = props;
  return (
    <div className={`m-auto flex flex-col items-center ${width}`}>
      {showIcon && (children || <CheckIcon fill="#999999" />)}
      <h1
        className={`w-max font-bold tracking-wider ${color || 'text-gray-120'} ${
          gap || 'mt-8 mb-4'
        } ${textSize || 'text-4xl'}`}
      >
        {text}
      </h1>
      <h2 className="w-max text-lg text-[#676668]">{description?.firstLine}</h2>
      <h2 className="w-max text-lg text-[#676668]">{description?.secondLine}</h2>
    </div>
  );
};

export default IconText;
