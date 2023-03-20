import { BrowserRouter as Router } from 'react-router-dom';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { renderWithProviders } from '../../test-utils/test-provider';
import SignIn from '.';

const setupRender = () =>
  renderWithProviders(
    <Router>
      <SignIn />
    </Router>,
  );

test('correctly sign-in', async () => {
  setupRender();
  const user = userEvent.setup();
  const nameInput = screen.getByLabelText(/account/i);
  const passwordInput = screen.getByLabelText(/password/i);
  const submitButton = screen.getByRole('button', { name: /submit/i });

  await user.clear(nameInput);
  await user.type(nameInput, 'test-admin');
  await user.clear(passwordInput);
  await user.type(passwordInput, 'test-admin');
  await user.click(submitButton);

  await waitFor(() => {
    expect(global.window.location.href).toContain('/dashboard');
  });
});

test('sign in with invalid account', async () => {
  setupRender();
  const user = userEvent.setup();
  const local = screen.getByText(/local/i);
  const nameInput = screen.getByLabelText(/account/i);
  const passwordInput = screen.getByLabelText(/password/i);
  const submitButton = screen.getByRole('button', { name: /submit/i });

  await user.click(local);
  await user.clear(nameInput);
  await user.type(nameInput, 'test');
  await user.clear(passwordInput);
  await user.type(passwordInput, 'test');
  await user.click(submitButton);

  await waitFor(() => {
    const errorMsg = screen.getByText(/Incorrect name or password/i);
    expect(errorMsg).toBeInTheDocument();
  });
});

test('invalid input with non-alphabetic or non-numeric characters', async () => {
  setupRender();
  const user = userEvent.setup();
  const local = screen.getByText(/local/i);
  const nameInput = screen.getByLabelText(/account/i);
  const passwordInput = screen.getByLabelText(/password/i);
  const submitButton = screen.getByRole('button', { name: /submit/i });

  await user.click(local);
  await user.clear(nameInput);
  await user.type(nameInput, 'qwe./12');
  await user.clear(passwordInput);
  await user.type(passwordInput, 'test_231');
  await user.click(submitButton);

  await waitFor(() => {
    const errorMsg = screen.getAllByText(/can contain only letters and numbers/i);
    expect(errorMsg).toHaveLength(2);
  });
});
