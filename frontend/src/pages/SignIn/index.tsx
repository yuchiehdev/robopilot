import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, SubmitHandler } from 'react-hook-form';
import { ToastContainer, toast } from 'react-toastify';

import { signIn } from '../../store/userSlice';
import { useAppSelector, useAppDispatch } from '../../store';
import wiwynnLogo from '../../assets/icons/wiwynn_logo_blue.svg';
import './style.scss';

type SignInInputs = {
  username: string;
  password: string;
};

const validPattern = /^[a-zA-Z0-9]+$/;

const registerOption = {
  ldap: {
    required: true,
  },
  local: {
    required: true,
    pattern: {
      value: validPattern,
      message: 'password can contain only letters and numbers',
    },
  },
};

const SignIn = () => {
  const [signInMode, setSignInMode] = useState<'ldap' | 'local'>('ldap');
  const isSignIn = useAppSelector((state) => state.user.isSignIn);
  const errorMsg = useAppSelector((state) => state.user.errorMsg);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    resetField,
    formState: { errors },
  } = useForm<SignInInputs>();

  const onSubmit: SubmitHandler<SignInInputs> = (data) => {
    dispatch(signIn({ data, mode: signInMode }));
    resetField('password');
  };

  useEffect(() => {
    if (isSignIn) {
      resetField('username');
      navigate('/dashboard');
    } else if (!isSignIn && errorMsg.length) {
      toast.error(errorMsg, { autoClose: 2500 });
    }
  }, [isSignIn, errorMsg, navigate, resetField]);

  return (
    <main className="flex flex-col overflow-scroll bg-white dark:bg-black">
      <ToastContainer />
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
                errors.username ? 'border-red' : 'border-black'
              }`}
              {...register('username', registerOption.ldap)}
            />
          </label>
          {errors.username && (
            <span className="m-0 mt-[-2rem] text-red">{errors.username.message}</span>
          )}
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
                errors.password ? 'border-red' : 'border-black'
              }`}
              {...register('password', registerOption.ldap)}
            />
          </label>
          {errors.password && (
            <span className="m-0 mt-[-2rem] text-red">{errors.password.message}</span>
          )}
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
