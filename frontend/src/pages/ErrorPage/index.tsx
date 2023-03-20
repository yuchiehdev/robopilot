import { useRouteError, NavLink } from 'react-router-dom';
import { useState } from 'react';
import './errorPage.scss';

const ErrorPage = () => {
  const [style, setStyle] = useState({ display: 'none' });
  const error: any = useRouteError();

  return (
    <div className="background m-auto flex h-screen w-full flex-col items-center justify-center gap-6 dark:bg-black">
      <div className="flex h-[80%] w-[80%] flex-col items-center justify-end gap-2 rounded-lg bg-light-60 p-[5rem] shadow-md">
        {error.status ? (
          <h1 className="error404" data-h1={`${error.status}`}>
            {error.status}
          </h1>
        ) : (
          <h1 className="error404" data-h1="404">
            404
          </h1>
        )}
        <span className="text-2xl dark:text-white">
          Sorry, an unexpected error has occurred.
        </span>
        <span
          className="text-xl dark:text-white"
          onMouseEnter={(e) => {
            setStyle({ display: 'block' });
          }}
          onMouseLeave={(e) => {
            setStyle({ display: 'none' });
          }}
        >
          {error.status} {error.statusText}
        </span>
        <NavLink to="/">
          <button className="m-2 h-9 w-36 rounded-full bg-[#68A6CE] text-white hover:bg-[#72b5e2]">
            Back to Home
          </button>
        </NavLink>
        <div className="h-1/6 text-gray-160">
          <span style={style}>{error.data}</span>
        </div>
      </div>
    </div>
  );
};
export default ErrorPage;
