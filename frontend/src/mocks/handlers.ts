import { rest } from 'msw';

type SignInPostBody = {
  username: string;
  password: string;
};

type SignInResponseBody = {
  name: string;
  title: string;
  access_token: string;
};

export const handlers = [
  rest.post<SignInPostBody, SignInResponseBody>(
    `http://localhost/router_robotNest/signin`,
    async (req, res, ctx) => {
      const { username, password } = await req.json();

      if (username === 'test-admin' && password === 'test-admin') {
        return res(
          ctx.status(200),
          ctx.json({
            name: 'admin',
            title: 'admin',
            access_token: 'fake-token',
          }),
        );
      }
      return res(
        ctx.status(403),
        ctx.json({
          message: 'Incorrect name or password',
        }),
      );
    },
  ),

  rest.get('http://localhost/router_robotNest/signin', (req, res, ctx) => {
    const isAuth = localStorage.getItem('isAuth');

    if (!isAuth) {
      return res(
        ctx.status(403),
        ctx.json({
          message: 'Incorrect name or password',
        }),
      );
    }

    return res(
      ctx.status(200),
      ctx.json({
        username: 'admin',
      }),
    );
  }),
];
