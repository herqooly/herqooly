import axios from "axios";
import { toast } from "react-toastify";
import {
  SET_CELL_LIST,
  SET_FOCUS,
  ADD_CELL,
  UPDATE_CELL_CODE,
  DELETE_CELL,
  CLEAR_MSG_ID_TO_CELL_ID,
  UPDATE_CELL_STATE,
  ADD_CELL_WITH_CODE
} from "./CellsTypes";

import { webSocketSend } from "../wsContainer/WebSocketActions";
import {
  clearWidget,
  removeNotUpdatedWidgets
} from "../widgets/WidgetsActions";
import { isEmpty } from "../../../utils/Common";

import uuid from "uuid";

export const getCellList = (
  organizationSlug,
  projectId,
  scriptId
) => dispatch => {
  axios
    .get(`/api/v1/${organizationSlug}/${projectId}/script_cells/${scriptId}`)
    .then(res => {
      let cells = JSON.parse(res.data.code);
      if (isEmpty(cells)) {
        const cellUid = uuid.v4();
        cells = [
          {
            cellUid,
            code: "",
            state: "idle",
            focus: true
          }
        ];
      }
      dispatch({
        type: SET_CELL_LIST,
        payload: cells
      });
    })
    .catch(err => {
      toast.error("Get script code cells problem. " + err, {
        autoClose: 8000,
        hideProgressBar: true,
        newsetOnTop: true
      });
    });
};

export const setFocus = cell_with_focus => (dispatch, getState) => {
  const { cells } = getState().cells;
  if (cell_with_focus >= 0 && cell_with_focus < cells.length) {
    dispatch({
      type: SET_FOCUS,
      payload: cell_with_focus
    });
  }
};

export const setFocusOrAddNewCell = cell_with_focus => (dispatch, getState) => {
  const { cells } = getState().cells;
  if (cell_with_focus >= 0 && cell_with_focus < cells.length) {
    dispatch({
      type: SET_FOCUS,
      payload: cell_with_focus
    });
  } else if (cell_with_focus >= cells.length) {
    dispatch(addCell(cell_with_focus - 1)); // it has plus 1 already
  }
};

export const setFocusFromCellUid = cellUid => (dispatch, getState) => {
  const { cells } = getState().cells;
  let i = 0;
  cells.forEach(cell => {
    if (cell.cellUid === cellUid) {
      dispatch(setFocus(i));
      return;
    }
    i++;
  });
};

export const addCell = old_cell_id => dispatch => {
  dispatch({
    type: ADD_CELL,
    payload: old_cell_id
  });
};

export const addCellWithCodeAndRun = (scriptId, old_cell_id, code) => (
  dispatch,
  getState
) => {
  dispatch({
    type: ADD_CELL_WITH_CODE,
    payload: { arrayIndex: old_cell_id, code: code }
  });
  const { cells } = getState().cells;
  const lastCell = cells[cells.length - 1];
  dispatch(executeCell(scriptId, cells.length - 1, lastCell.cellUid));
};

export const updateCellCode = (cellArrayIndex, newCode) => dispatch => {
  dispatch({
    type: UPDATE_CELL_CODE,
    payload: { cellArrayIndex: cellArrayIndex, newCode: newCode }
  });
};

export const updateCellState = (parentMsgId, state) => (dispatch, getState) => {
  //console.log("updateCellState");
  //console.log(parentMsgId, state);
  // here we should have msg from the kernel with its state

  const { cells } = getState().cells;
  const { msgIdToCellUid } = getState().cells;

  const cellUid = msgIdToCellUid[parentMsgId];

  //console.log("cellUid->" + cellUid);
  let cellArrayIndex = -1;
  let i = 0;
  cells.forEach(cell => {
    if (cell.cellUid === cellUid) {
      cellArrayIndex = i;
    }
    i++;
  });
  if (cellArrayIndex !== -1) {
    dispatch({
      type: UPDATE_CELL_STATE,
      payload: { cellArrayIndex: cellArrayIndex, newState: state }
    });
  }

  if (state === "idle") {
    //console.log(" CLEAR_MSG_ID_MAP STATE IDLE->" + cellUid);
    dispatch({
      type: CLEAR_MSG_ID_TO_CELL_ID,
      payload: { payload: cellUid }
    });
    dispatch(removeNotUpdatedWidgets(cellUid));
  }
};

export const deleteCell = cellArrayIndex => (dispatch, getState) => {
  const { cells } = getState().cells;
  if (cells.length === 1) {
    toast.warning("Cannot remove last cell", {
      autoClose: 2000,
      hideProgressBar: true,
      newsetOnTop: true
    });
  } else {
    dispatch({
      type: DELETE_CELL,
      payload: cellArrayIndex
    });
  }
};

export const executeAllCells = scriptId => (dispatch, getState) => {
  const { cells } = getState().cells;
  let i = 0;
  cells.forEach(cell => {
    dispatch(executeCell(scriptId, i, cell.cellUid));
    i++;
  });
};

export const executeCell = (scriptId, cellArrayIndex, cellUid) => (
  dispatch,
  getState
) => {
  //console.log(
  //  "Execute Cell " + scriptId + " " + cellArrayIndex + " " + cellUid
  //);
  const { cells } = getState().cells;

  if (cells[cellArrayIndex].state !== "idle") {
    toast.info("Please wait till cell will be idle. ", {
      autoClose: 2000,
      hideProgressBar: true,
      newsetOnTop: true
    });
    return;
  }

  dispatch({
    type: UPDATE_CELL_STATE,
    payload: { cellArrayIndex, newState: "submitted" }
  });

  dispatch(clearWidget(cellUid));

  if (cells[cellArrayIndex].cellUid !== cellUid) {
    console.log("SODOMIA I GOMORIA");
    console.log(
      cellArrayIndex + " | " + cells[cellArrayIndex].cellUid + " | " + cellUid
    );
  }

  let msg = {
    cellUid: cells[cellArrayIndex].cellUid,
    code: cells[cellArrayIndex].code
  };

  dispatch(webSocketSend(scriptId, msg));
};

const getDataColumnsCode =
  "import pandas as pd\nimport numpy as np\nimport json\n" +
  "cols__ = {}\n" +
  'names__ = {"Array": np.ndarray, "Series": pd.core.frame.Series, "DataFrame": pd.core.frame.DataFrame}\n' +
  "for k__,v__ in names__.items():\n" +
  '    arrays__ = [var for var in dir() if isinstance(eval(var), v__) and not var.startswith("_")]\n' +
  '    if k__ != "DataFrame":\n' +
  "        for a__ in arrays__:\n" +
  '            cols__[a__] = "{0} ({1})".format(a__, k__)\n' +
  "    else:\n" +
  "        for a in arrays__:\n" +
  "            for c in eval(a).columns:\n" +
  "                cols__['{0}[\"{1}\"]'.format(a, c)] = '{0}[\"{1}\"] ({2} {0})'.format(a, c, k__)\n" +
  "print(json.dumps(cols__))\n" +
  "del a__, cols__, names__, k__, v__, arrays__\n";

export const getDataColumns = scriptId => (dispatch, getState) => {
  console.log(getDataColumnsCode);
  let msg = {
    cellUid: "special_get_data_columns",
    code: getDataColumnsCode
  };

  dispatch(webSocketSend(scriptId, msg));
};

export const executeCode = (scriptId, code) => (dispatch, getState) => {
  let msg = {
    cellUid: "special_arbitrary_code",
    code: code
  };

  dispatch(webSocketSend(scriptId, msg));
};

export const clearMsgIdToCellUid = cellUid => dispatch => {
  dispatch({
    type: CLEAR_MSG_ID_TO_CELL_ID,
    payload: cellUid
  });
};

export const addToScript = (scriptId, code, importCode) => (
  dispatch,
  getState
) => {
  console.log("cells addToScript <<<<<<<<<<<<<<<<<<<<<<");
  console.log(code);

  code = code.replace(importCode, "");

  console.log("After replace");
  console.log(code);

  const { cells } = getState().cells;

  if (!cells[0].code.includes(importCode)) {
    dispatch(updateCellCode(0, importCode + cells[0].code));
    dispatch(executeCell(scriptId, 0));
  }

  dispatch(addCellWithCodeAndRun(scriptId, cells.length - 1, code));
};
