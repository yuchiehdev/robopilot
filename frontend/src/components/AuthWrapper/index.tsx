import { ReactNode, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import RouterErrorBoundary from '../RouterErrorBoundary';
import AUTHORIZATION from '../../data/authorization';
import { userAction } from '../../store/userSlice';
import { useAppSelector, useAppDispatch } from '../../store';
import { useAuth } from '../../api/useAuth';
import { useRefreshToken } from '../../api/useRefreshToken';

const authList: Record<string, Record<string, Set<string>>> = AUTHORIZATION;

type AuthWrapperProps = {
  children: ReactNode;
  page: string;
  guestOnly?: boolean;
};

const AuthWrapper = ({ children, page, guestOnly }: AuthWrapperProps) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const isSignIn = useAppSelector((state) => state.user.isSignIn);
  const isSignInRef = useRef(isSignIn);
  const permission = useAppSelector((state) => state.user.permission);
  const username = useAppSelector((state) => state.user.name);
  const authQuery = useAuth();

  const refreshToken = localStorage.getItem('RefreshToken');

  const { refetch: refetchRefreshToken, isError } = useRefreshToken({
    username: username || '',
    refresh_token: localStorage.getItem('RefreshToken') || '',
  });

  useEffect(() => {
    if (isSignIn && isError) {
      // refresh access token if signin status is true, and log out if refresh failed
      console.warn('Failed to refresh token, please sign in again');
      dispatch(userAction.signOut());
      navigate('/signin', { state: { from: location.pathname } });
    }
  }, [dispatch, isError, isSignIn, location.pathname, navigate]);

  useEffect(() => {
    // redirect assembly page is user try to access signin page but already signed in
    if (isSignIn && guestOnly) {
      navigate('/assembly', { state: { from: location.pathname } });
    }
  }, [isSignIn, guestOnly, navigate, location.pathname]);

  useEffect(() => {
    // redirect to signin page if user does not have refresh token
    if (isSignIn && location.pathname !== '/signin' && !refreshToken && !guestOnly) {
      navigate('/signin', { state: { from: location.pathname } });
    }
  }, [refreshToken, navigate, location.pathname, isSignIn, guestOnly]);

  useEffect(() => {
    // Call refetch to refresh the token when authQuery fails
    if (authQuery.isError) {
      refetchRefreshToken();
    }
  }, [authQuery.isError, refetchRefreshToken]);

  useEffect(() => {
    // set signin status if user successfully signed in
    if (!authQuery.isLoading && localStorage.getItem('JWToken')) {
      dispatch(userAction.setSignInStatus(true));
      dispatch(userAction.setPermission(authQuery?.data?.permission));
      dispatch(userAction.setUserName(authQuery?.data?.username));
    }
  }, [authQuery.isLoading, authQuery.data, dispatch]);

  useEffect(() => {
    if (!authQuery.isLoading) {
      if (authQuery.data && isSignInRef.current) {
        isSignInRef.current = true;
        dispatch(
          userAction.setUserRole({
            permission: authQuery.data.permission,
            name: authQuery.data.username,
          }),
        );
      } else {
        isSignInRef.current = false;
      }

      if (
        isSignInRef &&
        (authList[page].read.has(permission) ||
          authList[page].read.has(authQuery?.data?.permission))
      ) {
        const from = location.state?.from;
        navigate(from, { state: location.state });
      } else {
        navigate('/unauthorized', { state: { from: location.pathname } });
      }
    }
  }, [
    authQuery.data,
    authQuery.isLoading,
    dispatch,
    isSignIn,
    location.pathname,
    location.state,
    navigate,
    page,
    permission,
  ]);

  return (
    <main className="relative">
      <RouterErrorBoundary>{children}</RouterErrorBoundary>
    </main>
  );
};

export default AuthWrapper;
