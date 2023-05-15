import { CSSProperties } from 'react';

export const SESSION_EXPIRATION = 1000 * 30 * 60;
export const FETCH_INTERVAL = 1000;

type PageTabName = {
  [key: string]: {
    page: string;
    tabs: string[];
  };
};

export const PAGE_TAB_NAME: PageTabName = {
  EVENT: {
    page: 'event',
    tabs: ['System', 'User'],
  },
  CONTROLLER: {
    page: 'controller',
    tabs: ['Scara', 'Vision'],
  },
};

export const bulbPositions = ['2', '9.3', '37.6', '45', '51.1', '58.4', '86.7', '94'];

export const builbBPositions = [
  '3.8',
  '11',
  '35.9',
  '43.4',
  '52.7',
  '60.2',
  '84.9',
  '92.2',
];

export const linePositions = [
  '2.2',
  '9.5',
  '37.8',
  '45.1',
  '51.2',
  '58.5',
  '86.9',
  '94.1',
];

export const lineBPositions = ['4', '11.2', '36', '43.5', '52.9', '60.3', '85', '92.3'];

// Loading Spinner
export const override: CSSProperties = {
  display: 'block',
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  margin: '0 auto',
};
