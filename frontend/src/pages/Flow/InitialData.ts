import type { EntityType, EdgeType } from '../../types';

export const initialNodes: EntityType[] = [
  {
    id: 'name',
    type: 'customNode',
    data: {
      deviceType: 'Walker',
      device: 'Kv8000_TABLE_A',
      entityName: 'name',
      module: 'Controller_Node',
      action: '',
      parameters: {
        links: { connector: 'ict', ip: '', port: '' },
        locationSrc: { X: 0, Y: 0 },
        locationDst: { X: 0, Y: 0 },
      },
      dialog: false,
    },
    position: { x: -500, y: 75 },
    width: 199,
    height: 228,
    selected: false,
    positionAbsolute: { x: -500, y: 75 },
    dragging: false,
  },
  {
    id: 'name1',
    type: 'customNode',
    data: {
      deviceType: 'Transfer',
      device: 'Kv8000_TABLE_A',
      entityName: 'name1',
      module: 'Controller_Node',
      action: '',
      parameters: {
        links: { connector: 'arm', ip: '', port: '' },
        locationSrc: { X: 0, Y: 0 },
        locationDst: { X: 0, Y: 0 },
      },
      dialog: false,
    },
    position: { x: -200, y: 100 },
    width: 208,
    height: 228,
    selected: false,
    positionAbsolute: { x: -200, y: 100 },
    dragging: false,
  },
  {
    id: 'name2',
    type: 'customNode',
    data: {
      deviceType: 'Transfer',
      device: 'Kv8000_TABLE_A',
      entityName: 'name1235',
      module: 'Controller_Node',
      action: '',
      parameters: {
        links: { connector: 'arm', ip: '', port: '' },
        locationSrc: { X: 0, Y: 0 },
        locationDst: { X: 0, Y: 0 },
      },
      dialog: false,
    },
    position: { x: 100, y: 70 },
    width: 236,
    height: 228,
    selected: true,
    positionAbsolute: { x: 100, y: 70 },
    dragging: false,
  },
];

export const initialEdges: EdgeType[] = [
  // {
  //   id: 'e1-1',
  //   source: 'name',
  //   target: 'name1',
  //   type: 'buttonedge',
  //   animated: true,
  //   style: { stroke: 'rgb(0,108,146)', strokeWidth: 2 },
  // },
  // {
  //   id: 'e1-2',
  //   source: 'name1',
  //   target: 'name2',
  //   type: 'buttonedge',
  //   animated: true,
  //   style: { stroke: 'rgb(0,108,146)', strokeWidth: 2 },
  // },
];
