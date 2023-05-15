type Params = {
  [key: string]: string | number | boolean;
};

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

const HOST_IP = HOSTIP;
const ROUTER_ROBOTNEST = `${HOST_IP}/router_robotNest`;

export const ACTION_CONTROL = `${ROUTER_ROBOTNEST}/actionControl`;
export const POST_CONTROLLER_BUTTON = `${ROUTER_ROBOTNEST}/dimmcontrol`;
export const DELETE_DEVICE_URL = `${ROUTER_ROBOTNEST}/device?name=`;
export const DEVICE_SETTING_URL = `${ROUTER_ROBOTNEST}/setting`;
export const FETCH_ALARM_URL = `${ROUTER_ROBOTNEST}/event?activation=true&not_errcode=1000`;
export const FETCH_CONVEYOR_SENSOR_URL = `${ROUTER_ROBOTNEST}/sensor?device=device_kv8000_Conveyor`;
export const FETCH_CONTROLLER_TS5000_URL = `${ROUTER_ROBOTNEST}/sensor?device=device_ts5000`;
export const FETCH_CONTROLLER_KV8000_A_URL = `${ROUTER_ROBOTNEST}/sensor?device=device_kv8000_A`;
export const FETCH_CONTROLLER_KV8000_B_URL = `${ROUTER_ROBOTNEST}/sensor?device=device_kv8000_B`;
export const FETCH_DEVICE_URL = `${ROUTER_ROBOTNEST}/device`;
export const FETCH_DEVICE_STATUS_URL = `${ROUTER_ROBOTNEST}/status`;
export const FETCH_EDGE = `${ROUTER_ROBOTNEST}/edge`;
export const FETCH_ENTITY = `${ROUTER_ROBOTNEST}/entity`;
export const FETCH_EVENT_URL = `${ROUTER_ROBOTNEST}/event`;
export const USER_EVENT = `${ROUTER_ROBOTNEST}/userevent`;
export const FETCH_MAINTENANCE = `${ROUTER_ROBOTNEST}/maintenance`;
export const FETCH_ACTIVE_MAINTENANCE_URL = `${ROUTER_ROBOTNEST}/event?activation=true&errcode=1000`;
export const FETCH_NODE_LIST = `${ROUTER_ROBOTNEST}/node`;
export const RESOURCE = `${ROUTER_ROBOTNEST}/resource`;
export const FETCH_PRODUCTION = `${ROUTER_ROBOTNEST}/production`;
export const FIX_ALARM = `${ROUTER_ROBOTNEST}/event?activation=false`; // PUT active maintenance
export const PREFIX_MAINTENANCE = `${ROUTER_ROBOTNEST}/maintenance?name=`;
export const POST_CONTROLLER_START_BUTTON = `${HOST_IP}/router_kv8000/dimmcontrol`;
export const POST_CHECKED_CONTROLLER_ALERT = `${HOST_IP}/router_kv8000/device_kv8000_A/tray`;
export const SIGN_IN = `${ROUTER_ROBOTNEST}/signin?mode=`;
export const VALIDATE = `${ROUTER_ROBOTNEST}/validate`;
export const USER_GROUP = `${ROUTER_ROBOTNEST}/usergroup`;
export const ALL_USER = `${ROUTER_ROBOTNEST}/alluser`;
export const USER = `${ROUTER_ROBOTNEST}/user`;
export const REFRESH_TOKEN = `${ROUTER_ROBOTNEST}/refreshtoken`;
export const SIGN_OUT = `${ROUTER_ROBOTNEST}/signout`;
export const WEBHOOK_TEST = `${ROUTER_ROBOTNEST}/webhooktest`;
export const DIMMCONTROL = `${ROUTER_ROBOTNEST}/dimmcontrol`;
export const STATUSCONTROL = `${ROUTER_ROBOTNEST}/controlstatus`;
export const RESETERROR = `${HOST_IP}/router_ts5000/device_ts5000/reseterror`;

export const SOCKET_URL = SOCKETURL;

const apiEndpoints = {
  sensor: `${ROUTER_ROBOTNEST}/sensor`,
};

const withParams = (url: string, params: Params) => {
  const urlObj = new URL(url);
  Object.keys(params).forEach((key) => {
    urlObj.searchParams.append(key, params[key].toString());
  });
  return urlObj.toString();
};

export { apiEndpoints, withParams };
