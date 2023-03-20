import { ReactComponent as CheckIcon } from '../../assets/icons/circle-check-regular.svg';

type FineIconProps = {
  text: string;
};

const FineIcon: React.FC<FineIconProps> = (props) => {
  const { text } = props;
  return (
    <div className="m-auto flex w-32 flex-col items-center">
      <CheckIcon fill="#999999" />
      <h1 className="my-8 w-max text-4xl font-bold tracking-wider text-gray-120">
        {text}
      </h1>
    </div>
  );
};

export default FineIcon;
