import './radioButton.scss';

type RadioButtonProps = {
  changed: (event: React.ChangeEvent<HTMLInputElement>) => void;
  id: string;
  isSelected: boolean;
  label: string;
  value: string;
};

const RadioButton = ({ changed, id, isSelected, label, value }: RadioButtonProps) => {
  return (
    <div className="RadioButton">
      <input id={id} onChange={changed} value={value} type="radio" checked={isSelected} />
      <label htmlFor={id}>{label}</label>
    </div>
  );
};

export default RadioButton;
