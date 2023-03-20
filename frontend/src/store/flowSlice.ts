import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import { FETCH_ENTITY, FETCH_EDGE } from '../data/fetchUrl';
import type { EntityType, EdgeType } from '../types';

type InitialFlowSlice = {
  nodeList: EntityType[];
  edgeId: string;
  optionShow: string;
  entity: EntityType[];
  edge: EdgeType[];
};

export const initialFlowSlice: InitialFlowSlice = {
  nodeList: [],
  edgeId: '',
  optionShow: '',
  entity: [],
  edge: [],
};

export const fetchEntity = createAsyncThunk('flow/getEntity', async (_, thunkAPI) => {
  try {
    const response = await fetch(`${FETCH_ENTITY}`);
    const data = await response.json();
    return data;
  } catch (err: unknown) {
    return thunkAPI.rejectWithValue(err);
  }
});

export const fetchEdge = createAsyncThunk('flow/getEdge', async (_, thunkAPI) => {
  try {
    const response = await fetch(`${FETCH_EDGE}`);
    const data = await response.json();
    return data;
  } catch (err: unknown) {
    return thunkAPI.rejectWithValue(err);
  }
});

export const postEntity = createAsyncThunk(
  'flow/postEntity',
  async (input: any, thunkAPI) => {
    try {
      const response = await fetch(`${FETCH_ENTITY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(input),
      });
      const data = await response.json();
      return data;
    } catch (err: unknown) {
      return thunkAPI.rejectWithValue(err);
    }
  },
);

export const postEdge = createAsyncThunk(
  'flow/postEdge',
  async (input: any, thunkAPI) => {
    try {
      const response = await fetch(`${FETCH_EDGE}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(input),
      });
      const data = await response.json();
      return data;
    } catch (err: unknown) {
      return thunkAPI.rejectWithValue(err);
    }
  },
);

export const flowSlice = createSlice({
  name: 'flow',
  initialState: initialFlowSlice,
  reducers: {
    setEdgeId: (state, action: PayloadAction<string>) => {
      state.edgeId = action.payload;
    },
    setOptionShow: (state, action: PayloadAction<string>) => {
      state.optionShow = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEntity.fulfilled, (state, action) => {
        state.entity = action.payload.map((item: EntityType) => {
          let devicetype = '';
          switch (item.action) {
            case 'Ts5000_C2080':
              devicetype = 'Transfer';
              break;
            case 'Kv8000_TABLE_A':
              devicetype = 'Walker';
              break;
            case 'Kv8000_TABLE_B':
              devicetype = 'Walker';
              break;
            case 'Kv8000_CONVEYOR':
              devicetype = 'Walker';
              break;
            default:
              devicetype = 'Transfer';
          }
          return {
            // eslint-disable-next-line no-underscore-dangle
            // id: item._id?.$oid,
            id: item.entityName,
            type: 'customNode',
            data: {
              deviceType: devicetype,
              device: item.device,
              entityName: item.entityName,
              module: item.module,
              action: item.action,
              parameters: {
                links: { connector: 'ict', ip: '', port: '' },
                locationSrc: { X: 0, Y: 0 },
                locationDst: { X: 0, Y: 0 },
              },
              dialog: false,
            },
            position: { x: item.position.x, y: item.position.y },
            width: 199,
            height: 228,
            selected: false,
            positionAbsolute: { x: item.position.x, y: item.position.y },
            dragging: false,
          };
        });
      })
      .addCase(fetchEdge.fulfilled, (state, action) => {
        state.edge = action.payload.map((item: EdgeType) => {
          return {
            // eslint-disable-next-line no-underscore-dangle
            id: item._id?.$oid,
            // id: item.id,
            source: item.source,
            target: item.target,
            type: 'buttonedge',
            animated: true,
            style: { stroke: 'rgb(0,108,146)', strokeWidth: 2 },
          };
        });
      })
      .addCase(postEntity.fulfilled, (state, action: PayloadAction<any>) => {
        console.log(action.payload);
      })
      .addCase(postEntity.rejected, (state, action: PayloadAction<any>) => {
        console.log(action.payload);
      })
      .addCase(postEdge.fulfilled, (state, action: PayloadAction<any>) => {
        console.log(action.payload);
      })
      .addCase(postEdge.rejected, (state, action: PayloadAction<any>) => {
        console.log(action.payload);
      });
  },
});

export const flowActions = flowSlice.actions;
export default flowSlice.reducer;
