import { BrowserRouter as Router } from 'react-router-dom';
import { renderWithProviders } from '../../test-utils/test-provider';
import Alarm from '.';

const setupRender = () => {
  renderWithProviders(
    <Router>
      <Alarm />
    </Router>,
  );
};

test('render alarm page correctly', () => {
  setupRender();
});
