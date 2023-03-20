import './TagInput.scss';
import { tagObjType } from '../../pages/Event';

type tagProps = {
  tag: tagObjType;
  remove: (removedTag: tagObjType) => void;
};
const Tag = ({ remove, tag }: tagProps) => {
  // eslint-disable-next-line jsx-a11y/click-events-have-key-events
  return (
    <li className="m-[3px] inline-block w-fit rounded-[4px] bg-[#ddd] py-[3px] px-[5px] text-[11pt] text-[#444] hover:cursor-pointer">
      <span className="font-semibold text-gray-220">{tag.category}</span>
      <span className="ml-3 text-gray-200">{tag.input}</span>
      <button
        className="ml-[0.5rem] px-[2px] text-[#666] no-underline hover:text-[#dd3345]"
        onClick={() => remove(tag)}
      >
        x
      </button>
    </li>
  );
};

export default Tag;
