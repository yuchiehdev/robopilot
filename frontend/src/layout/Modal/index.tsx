/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */

type ModalProps = {
  children: React.ReactNode;
  isOpen: boolean;
  width: string;
  height: string;
  tailwindClass?: string;
  onClick?: () => void;
};

const Modal: React.FC<ModalProps> = (props) => {
  const { width, height, children, isOpen, tailwindClass, onClick } = props;
  return isOpen ? (
    <div
      className="custom-w-fit absolute top-0 z-[999] flex h-full cursor-default items-center justify-center bg-[rgba(0,0,0,0.7)]"
      onClick={onClick}
    >
      <section
        className={`rounded-sm bg-white ${width} ${height} ${tailwindClass}`}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </section>
    </div>
  ) : null;
};

export default Modal;
