import { useState } from 'react';

type ButtonProps = {
  children: React.ReactNode;
  tag: string;
  tagPosition: string;
  buttonRotate?: string;
};

const Button: React.FC<ButtonProps> = (props) => {
  const { children, tagPosition, tag, buttonRotate } = props;
  const [showTag, setShowTag] = useState(false);

  return (
    <section className="relative">
      <button
        className={`mx-2 h-12 w-12 ${buttonRotate} rounded-full p-2 transition hover:scale-125`}
        onMouseEnter={() => setShowTag(true)}
        onMouseLeave={() => setShowTag(false)}
      >
        {children}
      </button>
      {showTag && (
        <span
          className={` ${tagPosition} absolute top-1/2 -translate-y-1/2 rounded-md bg-yellow px-4 py-1 font-semibold text-gray-220`}
        >
          {tag}
        </span>
      )}
    </section>
  );
};

export default Button;
