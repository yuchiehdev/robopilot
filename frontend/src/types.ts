// for Event page
export type EventType = {
  _id: {
    $oid: string;
  };
  activation: boolean | string;
  error_code: number;
  desc: string;
  function: any;
  msg: string[];
  name: string;
  parm: [
    {
      device: string;
    },
  ];
  severity: string;
  timestamp: {
    $date: number;
  };
  deactivate_timestamp: {
    $date: number;
  };
  id: string;
  time: number | string;
  showMsg: boolean;
  deactivatedTime: number | string;
  errorCode: number;
  method: string;
  permission: string;
  request: string;
  response: {
    message: string;
  };
  url: string;
  username: string;
};

// for Device page
export type Resource = {
  name: string;
  value: number;
};

export type DeviceType = {
  _id: {
    $oid: string;
  };
  name: string;
  type: string;
  locked: boolean;
  connector: string;
  receiver: {
    ip: string;
    port: number;
  };
  controller?: {
    ip: string;
    port: number;
  };
  subdevice?: string | null;
  ref?: {
    TS5000?: string;
    TABLE_A?: string;
    TABLE_B?: string;
    CONVEYOR?: string;
  };
  // for sort
  receiverIp?: string;
  receiverPort?: number;
  controllerIp?: string | null;
  controllerPort?: number | null;
  status?: string;
};

export type DeviceStatusType = {
  _id: {
    $oid: string;
  };
  device: string;
  status: string;
  timestamp: {
    $date: number;
  };
  entity_name: string;
  id?: string;
  time?: number | string;
};

// for Alarm page
export type AlarmType = {
  _id: {
    $oid: string;
  };
  id?: string;
  activation: true;
  device: string;
  error_code: number;
  errorCode?: number;
  desc: string;
  function: any;
  msg: any[];
  name: string;
  parm: any[];
  solution: string;
  severity: 'debug' | 'info' | 'warning' | 'error' | 'critical';
  timestamp: {
    $date: number;
  };
  time?: string;
  showMsg?: boolean;
};

// for Flow page
export type NodeType = {
  id: string;
  type: string;
  data: {
    entityName: string;
    module: string;
    action: string;
    parameters: {
      links: { connector: string; ip: string; port: string };
      locationSrc: { X: number; Y: number };
      locationDst: { X: number; Y: number };
    };
    dialog: boolean;
  };
  position: { x: number; y: number };
  width: number;
  height: number;
  selected: boolean;
  positionAbsolute: { x: number; y: number };
  dragging: boolean;
};

// for Today on the dashboard
export type ProductionType = {
  _id: {
    $oid: string;
  };
  date: string;
  data: {
    complete: number;
    warning: number;
    alert: number;
    yieldRate: number;
  };
};

// for Controller page
export type KV8000Type = {
  name: string;
  value: number | string;
  timestamp: {
    $date: number;
  };
};

export type TS5000Type = {
  code: string;
  name: string;
  value: number | string;
  tag: string;
  timestamp: {
    $date: number;
  };
};

export type EdgeType = {
  _id?: {
    $oid: string;
  };
  id: string;
  source: string;
  target: string;
  type: string;
  animated: boolean;
  style: {
    stroke: string;
    strokeWidth: number;
  };
};

export type EntityType = {
  _id?: {
    $oid: string;
  };
  id: string;
  type: string;
  data: {
    deviceType: string;
    entityName: string;
    device: string;
    module: string;
    action: string;
    parameters?: {
      links: { connector: string; ip: string; port: string };
      locationSrc: { X: number; Y: number };
      locationDst: { X: number; Y: number };
    };
    dialog: boolean;
  };
  entityName?: string;
  device?: string;
  action?: string;
  node?: string[];
  module?: string;
  position: { x: number; y: number };
  parameters?: {
    device: string;
    sensor: string[];
  };
  width: number;
  height: number;

  selected: boolean;
  positionAbsolute: { x: number; y: number };
  dragging: boolean;
};

// for maintenance page
export type MaintenanceType = {
  _id: {
    $oid: string;
  };
  Item: string;
  Duration: number;
  Description: string;
  LastCheck: { $date: number };
  active: boolean;
  id?: string;
  time?: string;
  timeStamp?: number;
  showDescription?: boolean;
  isActive: 1 | 0;
  desc?: string;
  function: string;
  solution?: string;
  msg: string[];
  showMsg?: boolean;
};

export type TagObjType = {
  category: string;
  input: string;
};

export type userGroupType = {
  _id: {
    $oid: string;
  };
  GroupName: string;
  AccessLevel: string;
  Description: string;
  teams_url: string;
};

export type allUserType = {
  _id: {
    $oid: string;
  };
  username: string;
  company: string;
  department: string;
  employeeID: string;
  group: string;
  local: boolean;
  mail: string;
  name: string;
  password: string;
  permission: string;
  title: string;
};

export type DimmFeederType = {
  code: string;
  status: boolean;
};

export type DIMMStatusType = {
  _id: {
    $oid: string;
  };
  mainboard_usn: string;
  dimmfeeder_A: DimmFeederType[] | null;
  dimmfeeder_B: DimmFeederType[] | null;
  end_time: {
    $date: string;
  };
  mainboard_csn: string;
  result_area_a1: number;
  result_area_a2: number;
  result_area_b1: number;
  result_area_b2: number;
  start_time: {
    $date: string;
  };
  status: string;
  time_area_a: number;
  time_area_b: number;
  time_calibration: number;
  time_press: number;
};

export type Sensor = {
  code?: string;
  name: string;
  value: number;
  tag?: string;
  timestamp: {
    $date: number;
  };
};
