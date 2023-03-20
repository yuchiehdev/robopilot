import { createElement } from 'react';

const withProps = (WrappedComponent: any, additionalProps = {}) => {
  return function (props: any) {
    return createElement(WrappedComponent, {
      ...props,
      ...additionalProps,
    });
  };
};

export default withProps;
