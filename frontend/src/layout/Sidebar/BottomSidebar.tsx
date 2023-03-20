import { memo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store';
import { ReactComponent as LoginIcon } from '../../assets/icons/login.svg';
import { ReactComponent as LogoutIcon } from '../../assets/icons/logout.svg';
import { ReactComponent as ToggleIcon } from '../../assets/icons/toggle.svg';
import { ReactComponent as UserIcon } from '../../assets/icons/user.svg';
import { userAction } from '../../store/userSlice';

type BottomSidebarProps = { showIconText: boolean };

const BottomSidebar: React.FC<BottomSidebarProps> = ({ showIconText }) => {
  const [toggle, setToggle] = useState(true);
  const isSignIn = useAppSelector((state) => state.user.isSignIn);
  const name = useAppSelector((state) => state.user.name);
  const role = useAppSelector((state) => state.user.role);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleSignOut = () => {
    dispatch(userAction.signOut());
    navigate('/signin');
  };

  return (
    <div className="bottom-sidebar mb-8 flex h-10 w-10/12 grow-0 items-end justify-center hover:cursor-pointer">
      <ul
        className={`w-full rounded-xl transition-all ${
          toggle ? null : 'bg-gray-60-transparent'
        }`}
      >
        {!isSignIn ? (
          <li className="m-4 my-3 cursor-pointer text-white-transparent  hover:text-white">
            <Link to="/signin" className="flex items-center justify-center">
              <span className={`${showIconText ? 'mr-4' : 'mx-4 my-1'} inline-block w-6`}>
                <LoginIcon fill="currentColor" />
              </span>
              {showIconText ? (
                <span className=" font-semibold tracking-wide">Sign in</span>
              ) : null}
            </Link>
          </li>
        ) : (
          <>
            {!toggle && (
              <li
                className={`m-4 my-3 cursor-pointer  text-white-transparent  hover:text-white ${
                  toggle ? 'opacity-0' : 'opacity-100'
                }`}
              >
                <button
                  className="flex w-full items-center justify-center"
                  onClick={handleSignOut}
                >
                  <span className={`${showIconText ? 'mr-4' : null} inline-block w-6 `}>
                    <LogoutIcon fill="currentColor" />
                  </span>
                  {showIconText ? (
                    <span className=" font-semibold tracking-wide">Sign out</span>
                  ) : null}
                </button>
              </li>
            )}
            <li className="m-4 cursor-pointer text-white-transparent  hover:text-white">
              <button
                className={`flex w-full items-center ${
                  showIconText ? 'justify-between' : 'justify-center'
                }`}
                onClick={() => setToggle(!toggle)}
              >
                <span className="inline-block w-8">
                  <UserIcon fill="currentColor" className="h-6 w-6" />
                </span>
                {showIconText ? (
                  <>
                    <span className="text-center text-sm font-semibold tracking-wide">
                      <p>{name.toUpperCase()}</p>
                      <p className="text-xs">{role}</p>
                    </span>
                    <span
                      className={`mx-0 inline-block w-5 ${
                        toggle ? null : 'origin-center rotate-180'
                      }`}
                    >
                      <ToggleIcon fill="currentColor" />
                    </span>
                  </>
                ) : null}
              </button>
            </li>
          </>
        )}
      </ul>
    </div>
  );
};

export default memo(BottomSidebar);
