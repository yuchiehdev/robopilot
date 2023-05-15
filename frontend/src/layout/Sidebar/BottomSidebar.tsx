import { memo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store';
import { ReactComponent as LoginIcon } from '../../assets/icons/login.svg';
import { ReactComponent as LogoutIcon } from '../../assets/icons/logout.svg';
import { ReactComponent as ToggleIcon } from '../../assets/icons/toggle.svg';
import { ReactComponent as UserIcon } from '../../assets/icons/user.svg';
import { userAction } from '../../store/userSlice';
import { SIGN_OUT } from '../../data/fetchUrl';
import { useAuthenticatedMutation } from '../../hooks/useAuthenticatedMutation';
import Tooltip from '../../pages/Assembly/Tooltip';
import useTooltip from '../../hooks/useTooltip';

type BottomSidebarProps = { showIconText: boolean };

const BottomSidebar: React.FC<BottomSidebarProps> = ({ showIconText }) => {
  const [toggle, setToggle] = useState(true);
  const isSignIn = useAppSelector((state) => state.user.isSignIn);
  const name = useAppSelector((state) => state.user.name);
  const role = useAppSelector((state) => state.user.role);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const bottomButtonData = ['Login', 'Logout', name];
  // const { tooltipVisible, mouseEnter, mouseLeave } = useTooltip(bottomButtonData.length);

  const signOutMutation = useAuthenticatedMutation(SIGN_OUT, 'POST', {
    onSuccess: () => {
      dispatch(userAction.signOut());
      navigate('/signin');
    },
    onError: (error: Error) => {
      console.error('Error Signing out:', error);
      dispatch(userAction.signOut());
      navigate('/signin');
    },
  });

  const handleSignOut = () => {
    signOutMutation.mutate({
      queryParams: {},
      body: {},
    });
  };

  return (
    <div className="bottom-sidebar mb-8 flex h-10 grow-0 items-end justify-center hover:cursor-pointer">
      <ul
        className={`w-full rounded-xl transition-all ${
          toggle ? null : 'bg-gray-60-transparent'
        }`}
      >
        {!isSignIn ? (
          <li className="m-4 my-3 cursor-pointer text-white-transparent  hover:text-white">
            <Link to="/signin" className="relative flex items-center justify-center">
              <Tooltip
                label={bottomButtonData[0]}
                position="right"
                marginLeft="-5px"
                backgroundColor="black"
              >
                <span
                  className={`${showIconText ? 'mr-4' : 'mx-4 my-1'} inline-block w-6`}
                >
                  <LoginIcon fill="currentColor" />
                </span>
                {showIconText ? (
                  <span className="font-semibold tracking-wide">Sign in</span>
                ) : null}
              </Tooltip>
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
                  className="relative flex w-full items-center justify-center"
                  onClick={handleSignOut}
                >
                  <Tooltip
                    label={bottomButtonData[1]}
                    position="right"
                    backgroundColor="black"
                  >
                    <span className={`${showIconText ? 'mr-4' : null} inline-block w-6 `}>
                      <LogoutIcon fill="currentColor" />
                    </span>
                    {showIconText ? (
                      <span className=" font-semibold tracking-wide">Sign out</span>
                    ) : null}
                  </Tooltip>
                </button>
              </li>
            )}
            <li className="m-4 cursor-pointer text-white-transparent  hover:text-white">
              <button
                className={`relative flex w-full items-center ${
                  showIconText ? 'justify-between' : 'justify-center'
                }`}
                onClick={() => setToggle(!toggle)}
              >
                <Tooltip
                  label={bottomButtonData[2]}
                  position="right"
                  backgroundColor="black"
                >
                  <span className="flex w-8 justify-center">
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
                </Tooltip>
              </button>
            </li>
          </>
        )}
      </ul>
    </div>
  );
};

export default memo(BottomSidebar);
