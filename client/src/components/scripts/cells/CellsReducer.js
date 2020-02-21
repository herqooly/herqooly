import {
  SET_CELL_LIST,
  SET_FOCUS,
  ADD_CELL,
  UPDATE_CELL_CODE,
  DELETE_CELL,
  SET_MSG_ID_TO_CELL_ID,
  CLEAR_MSG_ID_TO_CELL_ID,
  UPDATE_CELL_STATE,
  ADD_CELL_WITH_CODE,
  SET_DATA_COLUMNS
} from "./CellsTypes";
import uuid from "uuid";

const initialState = {
  cells: [],
  msgIdToCellUid: {},
  dataColumns: {}
};

export default function cellsReducer(state = initialState, action) {
  switch (action.type) {
    case SET_DATA_COLUMNS:
      return {
        ...state,
        dataColumns: action.payload
      };
    case SET_CELL_LIST:
      return {
        ...state,
        cells: action.payload
      };
    case SET_FOCUS:
      const updatedCells = state.cells.map((cell, index) => {
        cell.focus = index === action.payload;
        return cell;
      });
      return {
        ...state,
        cells: updatedCells
      };
    case ADD_CELL:
      state.cells[action.payload].focus = false;
      state.cells.splice(action.payload + 1, 0, {
        code: "",
        focus: true,
        cellUid: uuid.v4(),
        state: "idle"
      });
      return {
        ...state,
        cells: state.cells
      };
    case ADD_CELL_WITH_CODE:
      state.cells[action.payload.arrayIndex].focus = false;
      state.cells.splice(action.payload.arrayIndex + 1, 0, {
        code: action.payload.code,
        focus: true,
        cellUid: uuid.v4(),
        state: "idle"
      });
      return {
        ...state,
        cells: state.cells
      };
    case UPDATE_CELL_CODE:
      const { cellArrayIndex, newCode } = action.payload;
      state.cells[cellArrayIndex].code = newCode;
      return {
        ...state,
        cells: state.cells
      };
    case UPDATE_CELL_STATE:
      state.cells[action.payload.cellArrayIndex].state =
        action.payload.newState;
      return {
        ...state,
        cells: state.cells
      };

    case DELETE_CELL:
      if (action.payload > 0) {
        state.cells[action.payload - 1].focus = true;
      }
      state.cells.splice(action.payload, 1);
      return {
        ...state,
        cells: state.cells
      };
    case SET_MSG_ID_TO_CELL_ID:
      state.msgIdToCellUid[action.payload.msgId] = action.payload.cellUid;
      return {
        ...state,
        msgIdToCellUid: state.msgIdToCellUid
      };
    case CLEAR_MSG_ID_TO_CELL_ID:
      let newMap = {};
      for (let [k, v] of Object.entries(state.msgIdToCellUid)) {
        if (v !== action.payload) {
          newMap[k] = v;
        }
      }
      return {
        ...state,
        msgIdToCellUid: newMap
      };

    default:
      return state;
  }
}
