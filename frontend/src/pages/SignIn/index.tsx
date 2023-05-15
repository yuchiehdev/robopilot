import { useEffect, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useNavigate, useLocation } from 'react-router-dom';
import { useForm, SubmitHandler } from 'react-hook-form';
import { ErrorMessage } from '@hookform/error-message';
import { userAction } from '../../store/userSlice';
import { signIn } from '../../api/signIn';
import { useAppSelector, useAppDispatch } from '../../store';
import wiwynnLogo from '../../assets/icons/wiwynn_logo_blue.svg';
import type { SignInInput, SignInResponse } from '../../api/signIn';
import './style.scss';
import AUTHORIZATION from '../../data/authorization';
import { useSessionExpiration } from '../../hooks/useSessionExpiration';

const authList: Record<string, Record<string, Set<string>>> = AUTHORIZATION;
type SignInInputs = {
  username: string;
  password: string;
};

const registerOption = {
  ldap: {
    account: {
      required: 'This input is required.',
    },
    password: {
      required: 'This input is required.',
    },
  },
  local: {
    account: {
      required: 'This input is required.',
    },
    password: {
      required: 'This input is required.',
    },
  },
};

const SignIn = () => {
  const location = useLocation();
  const [signInMode, setSignInMode] = useState<'ldap' | 'local'>('ldap');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const isSignIn = useAppSelector((state) => state.user.isSignIn);
  const permission = useAppSelector((state) => state.user.permission);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const signInMutation = useMutation<SignInResponse, Error, SignInInput>({
    mutationFn: signIn,
    onSuccess: (result) => {
      dispatch(
        userAction.setUserRole({
          permission: result.permission,
          name: result.username,
        }),
      );
      dispatch(userAction.setSignInStatus(true));
      resetField('password');
    },
    onError: () => {
      resetField('username');
      resetField('password');
      setErrorMsg('Invalid username or password');
    },
  });

  const {
    register,
    handleSubmit,
    resetField,
    formState: { errors },
    reset,
    setFocus,
  } = useForm<SignInInputs>({
    criteriaMode: 'all',
  });

  const onSubmit: SubmitHandler<SignInInputs> = (data) => {
    signInMutation.mutate({ data, mode: signInMode });
  };

  const handleTokenRemoved = () => {
    dispatch(userAction.setSignInStatus(false));
    dispatch(userAction.setUserRole({ permission: '', name: '' }));
    navigate('/signin', { state: { from: location.pathname } });
  };
  const resetTimer = useSessionExpiration(handleTokenRemoved, undefined, isSignIn);
  useEffect(() => {
    // reset form when switch between ldap and local
    setFocus('username');
    reset();
  }, [signInMode, reset]);
  useEffect(() => {
    const from = location.state?.from || '/assembly';
    if (from === '/signin') navigate('/assembly');
    const captalizedFrom = from.charAt(1).toUpperCase() + from.slice(2);
    if (isSignIn && authList[captalizedFrom]?.read.has(permission)) {
      resetField('username');
      navigate(from);
    }
    resetTimer();
  }, [isSignIn, errorMsg, navigate, resetField, location.state, permission, resetTimer]);
  return (
    <main className="flex flex-col items-center overflow-auto bg-white dark:bg-black">
      <section className="container mt-5 flex h-full w-full flex-col items-center justify-center p-5">
        <img src={wiwynnLogo} alt="Wiwynn Logo" className="mx-1/2 mb-14 w-48" />
        <section className="mb-8 flex h-12 w-full justify-between text-2xl font-semibold tracking-wide text-gray-180 md:w-1/2 lg:w-1/3">
          <label
            htmlFor="ldap"
            className="signin-method flex w-full cursor-pointer justify-center"
          >
            <input
              type="radio"
              id="ldap"
              name="method"
              className="hidden"
              onChange={() => setSignInMode('ldap')}
              defaultChecked
            />
            <p className="w-full text-center">LDAP</p>
          </label>
          <label
            htmlFor="local"
            className=" signin-method flex w-full cursor-pointer justify-center"
          >
            <input
              type="radio"
              id="local"
              name="method"
              className="hidden"
              onChange={() => setSignInMode('local')}
            />
            <p className="w-full text-center">Local</p>
          </label>
        </section>
        <form
          onSubmit={handleSubmit(onSubmit)}
          autoComplete="off"
          className="flex h-full w-full flex-col items-start justify-start gap-8 text-gray-200 md:h-1/2 md:w-1/2 lg:w-1/3"
        >
          <label
            htmlFor="username"
            className="flex w-full flex-col bg-light-120 text-lg font-semibold dark:bg-gray-220 dark:text-light-80"
          >
            Account
            <input
              placeholder={
                signInMode === 'ldap' ? 'enter your Wiwynn ID' : 'enter your username'
              }
              autoComplete="off"
              id="username"
              type="text"
              className={`w-full border-b-2 bg-light-120 px-1 text-base font-normal text-black focus:outline-none dark:bg-gray-220 dark:text-white ${
                errors.username || errorMsg ? 'border-red' : 'border-black'
              }`}
              {...register('username', registerOption[signInMode].account)}
            />
          </label>
          <ErrorMessage
            errors={errors}
            name="username"
            render={({ messages }) => {
              return messages
                ? Object.entries(messages).map(([type, message]) => (
                    <p className="errorMessage m-0 mt-[-2rem]" key={type}>
                      {message}
                    </p>
                  ))
                : null;
            }}
          />
          <label
            htmlFor="password"
            className="flex w-full flex-col bg-light-120 text-lg font-semibold dark:bg-gray-220 dark:text-white"
          >
            Password
            <input
              placeholder="enter your password"
              autoComplete="off"
              id="password"
              type="password"
              className={`w-full border-b-2 bg-light-120 px-1 text-base font-normal text-black focus:outline-none dark:bg-gray-220 dark:text-white ${
                errors.password || errorMsg ? 'border-red' : 'border-black'
              }`}
              {...register('password', registerOption[signInMode].password)}
            />
          </label>
          <ErrorMessage
            errors={errors}
            name="password"
            render={({ messages }) => {
              return messages
                ? Object.entries(messages).map(([type, message]) => (
                    <p className="errorMessage m-0 mt-[-2rem]" key={type}>
                      {message}
                    </p>
                  ))
                : null;
            }}
          />
          <p className={`errorMessage m-0 mt-[-2rem] ${errorMsg ? 'block' : 'hidden'}`}>
            {errorMsg}
          </p>
          <button
            type="submit"
            className="mt-4 w-full rounded-full bg-wiwynn-blue py-1 text-lg font-semibold text-white"
          >
            Submit
          </button>
        </form>
      </section>
    </main>
  );
};

export default SignIn;
