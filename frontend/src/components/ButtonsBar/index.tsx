import Button from './Button';
import { useAppSelector, useAppDispatch } from '../../store';
import { postControllerStart } from '../../store/controllerSlice';
import { ReactComponent as InputIcon } from '../../assets/icons/login.svg';
import { ReactComponent as OutputIcon } from '../../assets/icons/logout.svg';

const ButtonsBar = () => {
  const dispatch = useAppDispatch();
  const isStartBtnIsClicked = useAppSelector(
    (state) => state.controller.startBtnIsClicked,
  );

  const onStartBtnClick = (action: 'ON' | 'OFF') => {
    dispatch(postControllerStart(action));
  };

  return (
    <section className="flex h-max w-max flex-col gap-5 rounded-3xl bg-gray-200 py-6">
      <button className="my-2">
        <label htmlFor="start-btn" className="switch">
          <input
            id="start-btn"
            className="start-btn__checkbox"
            type="checkbox"
            defaultChecked={isStartBtnIsClicked}
            onClick={
              isStartBtnIsClicked
                ? () => onStartBtnClick('OFF')
                : () => onStartBtnClick('ON')
            }
          />
          <span className="slider round" />
        </label>
      </button>
      <Button tag="Feed-in" tagPosition="left-[-130%]" buttonRotate="rotate-90">
        <InputIcon fill="#fff" />
      </Button>
      <Button tag="Withdraw" tagPosition="left-[-153%]" buttonRotate="-rotate-90">
        <OutputIcon fill="#fff" />
      </Button>
    </section>
  );
};

export default ButtonsBar;
