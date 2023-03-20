/* eslint-disable @typescript-eslint/no-unused-vars */
declare const window: {
  env: {
    REACT_APP_API_HOST: string;
    REACT_APP_API_SOCKET: string;
    REACT_APP_API_DEV: string;
  };
};

let HOSTIP = '';
let SOCKETURL = '';

if (process.env.NODE_ENV === 'development') {
  HOSTIP = window.env.REACT_APP_API_DEV || 'http://10.249.152.132:8080/api';
  SOCKETURL = 'ws://10.249.152.132:13254';
} else if (process.env.NODE_ENV === 'test') {
  HOSTIP = '';
  SOCKETURL = '';
} else {
  HOSTIP = window.env.REACT_APP_API_HOST;
  SOCKETURL = window.env.REACT_APP_API_SOCKET;
}

export const HOST_IP = HOSTIP;
export const ACTION_CONTROL = `${HOST_IP}/router_robotNest/actionControl`;
export const AUTH = `${HOST_IP}/router_robotNest/validate`;
export const POST_CONTROLLER_BUTTON = `${HOST_IP}/router_robotNest//dimmcontrol`;
export const DELETE_DEVICE_URL = `${HOST_IP}/router_robotNest/device?name=`;
export const DEVICE_SETTING_URL = `${HOST_IP}/router_robotNest/setting`;
export const FETCH_ALL_ALARM_URL = `${HOST_IP}/router_robotNest/event?activation=true`;
export const FETCH_ALARM_URL = `${HOST_IP}/router_robotNest/event?activation=true&not_errcode=1000`;
export const FETCH_CONVEYOR_SENSOR_URL = `${HOST_IP}/router_robotNest/sensor?device=device_kv8000_Conveyor`;
export const FETCH_CONTROLLER_TS5000_URL = `${HOST_IP}/router_robotNest/sensor?device=device_ts5000`;
export const FETCH_CONTROLLER_KV8000_A_URL = `${HOST_IP}/router_robotNest/sensor?device=device_kv8000_A`;
export const FETCH_CONTROLLER_KV8000_B_URL = `${HOST_IP}/router_robotNest/sensor?device=device_kv8000_B`;
export const FETCH_DEVICE_URL = `${HOST_IP}/router_robotNest/device`;
export const FETCH_DEVICE_STATUS_URL = `${HOST_IP}/router_robotNest/status`;
export const FETCH_EDGE = `${HOST_IP}/router_robotNest/edge`;
export const FETCH_ENTITY = `${HOST_IP}/router_robotNest/entity`;
export const FETCH_EVENT_URL = `${HOST_IP}/router_robotNest/event`;
export const FETCH_MAINTENANCE = `${HOST_IP}/router_robotNest/maintenance`;
export const FETCH_MAINTENANCE_ALARM_URL = `${HOST_IP}/router_robotNest/event?activation=true&errcode=1000`;
export const FETCH_NODE_LIST = `${HOST_IP}/router_robotNest/node`;
export const FETCH_SENSOR_URL = `${HOST_IP}/router_robotNest/resource`;
export const FIX_ALARM = `${HOST_IP}/router_robotNest/event?activation=false`;
export const PREFIX_MAINTENANCE = `${HOST_IP}/router_robotNest/maintenance?name=`;
export const GET_PRODUCTION_URL = `${HOST_IP}/router_robotNest/production`;
export const POST_CONTROLLER_START_BUTTON = `${HOST_IP}/router_kv8000/dimmcontrol`;
export const POST_CHECKED_CONTROLLER_ALERT = `${HOST_IP}/router_kv8000/device_kv8000_A/tray`;
export const SIGN_IN = `${HOST_IP}/router_robotNest/signin?mode=`;

export const SOCKET_URL = SOCKETURL;
