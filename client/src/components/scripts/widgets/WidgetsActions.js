import axios from "axios";
import { toast } from "react-toastify";
import {
  GET_WIDGETS,
  ADD_WIDGET,
  UPDATE_WIDGET,
  UPDATE_WIDGETS_LAYOUT,
  DELETE_WIDGET
} from "./WidgetsTypes";

import { SET_DATA_COLUMNS } from "../cells/CellsTypes";
//import uuid from "uuid";

export const getWidgets = (
  organizationSlug,
  projectId,
  scriptId
) => dispatch => {
  axios
    .get(`/api/v1/${organizationSlug}/${projectId}/${scriptId}/widgets`)
    .then(res => {
      let widget_map = res.data.reduce((accumulator, item) => {
        item.data = JSON.parse(item.data);
        item.layout = JSON.parse(item.layout);
        item.style = JSON.parse(item.style);

        accumulator[item.widgetUid] = item;
        return accumulator;
      }, {});

      dispatch({
        type: GET_WIDGETS,
        payload: widget_map
      });
    })
    .catch(err => {
      toast.error("Get widgets problem. " + err, {
        autoClose: 8000,
        hideProgressBar: true,
        newsetOnTop: true
      });
    });
};

/*
export const addWidget = (
  organizationSlug,
  projectId,
  scriptId,
  widget
) => dispatch => {
  dispatch({
    type: ADD_WIDGET,
    payload: widget
  });
};*/

export const deleteWidget = (
  organizationSlug,
  projectId,
  scriptId,
  widgetUid,
  widgetId
) => dispatch => {
  dispatch({
    type: DELETE_WIDGET,
    payload: widgetUid
  });
  axios
    .delete(
      `/api/v1/${organizationSlug}/${projectId}/${scriptId}/widgets/${widgetId}`
    )
    .then(res => {})
    .catch(err => {
      // toast.error("Delete widget problem. " + err, {
      //   autoClose: 8000,
      //   hideProgressBar: true,
      //   newsetOnTop: true
      // });
    });
};

const createTextWidget = (text, cellUid, widgetsCount) => {
  const wUid = cellUid;
  return {
    widgetUid: wUid,
    widget_type: "text_widget",
    data: { text: text },
    style: {},
    layout: { i: wUid, x: 0, y: widgetsCount * 6, w: 6, h: 6 },
    visible: true,
    cellUid: cellUid
  };
};

const createErrorWidget = (reason, text, cellUid, widgetsCount) => {
  const wUid = cellUid;
  return {
    widgetUid: wUid,
    widget_type: "error_widget",
    data: { text, reason },
    style: {},
    layout: { i: wUid, x: 0, y: widgetsCount * 8, w: 6, h: 8 },
    visible: true,
    cellUid: cellUid
  };
};

const createHTMLWidget = (text, cellUid, widgetsCount) => {
  const wUid = cellUid;
  return {
    widgetUid: wUid,
    widget_type: "html_widget",
    data: { text: text },
    style: {},
    layout: { i: wUid, x: 0, y: widgetsCount * 8, w: 6, h: 8 },
    visible: true,
    cellUid: cellUid
  };
};

const createImageWidget = (data, mediaType, cellUid, widgetsCount) => {
  const wUid = cellUid;
  return {
    widgetUid: wUid,
    widget_type: "image_widget",
    data: { data, mediaType },
    style: {},
    layout: { i: wUid, x: 0, y: widgetsCount * 8, w: 6, h: 8 },
    visible: true,
    cellUid: cellUid
  };
};

const createJSONWidget = (json, cellUid, widgetsCount) => {
  const wUid = cellUid;
  return {
    widgetUid: wUid,
    widget_type: "json_widget",
    data: { json },
    style: {},
    layout: { i: wUid, x: 0, y: widgetsCount * 8, w: 6, h: 8 },
    visible: true,
    cellUid: cellUid
  };
};

const createPlotlyWidget = (data, cellUid, widgetsCount) => {
  const wUid = cellUid;
  return {
    widgetUid: wUid,
    widget_type: "plotly_widget",
    data: data,
    style: {},
    layout: { i: wUid, x: 0, y: widgetsCount * 18, w: 12, h: 18 },
    visible: true,
    cellUid: cellUid
  };
};

const createWidget = (payload, cellUid, widgetsCount) => {
  if (payload.msg_type === "stream") {
    return createTextWidget(payload.content.text, cellUid, widgetsCount);
  } else if (
    payload.msg_type === "execute_result" ||
    payload.msg_type === "display_data"
  ) {
    if (payload.content.data.hasOwnProperty("application/vnd.plotly.v1+json")) {
      return createPlotlyWidget(
        payload.content.data["application/vnd.plotly.v1+json"],
        cellUid,
        widgetsCount
      );
    } else if (payload.content.data.hasOwnProperty("application/json")) {
      return createJSONWidget(
        payload.content.data["application/json"],
        cellUid,
        widgetsCount
      );
    } else if (payload.content.data.hasOwnProperty("image/png")) {
      return createImageWidget(
        payload.content.data["image/png"],
        "image/png",
        cellUid,
        widgetsCount
      );
    } else if (payload.content.data.hasOwnProperty("text/html")) {
      return createHTMLWidget(
        payload.content.data["text/html"],
        cellUid,
        widgetsCount
      );
    } else if (payload.content.data.hasOwnProperty("text/plain")) {
      return createTextWidget(
        payload.content.data["text/plain"],
        cellUid,
        widgetsCount
      );
    }
  } else if (payload.msg_type === "error") {
    return createErrorWidget(
      payload.content.ename,
      payload.content.evalue,
      cellUid,
      widgetsCount
    );
  }
};

const makeUpdate = (foundWidget, payload) => {
  foundWidget.wasUpdated = true;
  if (payload.msg_type === "stream") {
    return {
      ...foundWidget,
      widget_type: "text_widget",
      data: { text: foundWidget.data.text + payload.content.text }
    };
  } else if (
    payload.msg_type === "execute_result" ||
    payload.msg_type === "display_data"
  ) {
    if (payload.content.data.hasOwnProperty("application/vnd.plotly.v1+json")) {
      return {
        ...foundWidget,
        widget_type: "plotly_widget",
        data: payload.content.data["application/vnd.plotly.v1+json"]
      };
    } else if (payload.content.data.hasOwnProperty("application/json")) {
      return {
        ...foundWidget,
        widget_type: "json_widget",
        data: { text: payload.content.data["application/json"] }
      };
    } else if (payload.content.data.hasOwnProperty("image/png")) {
      return {
        ...foundWidget,
        widget_type: "image_widget",
        data: {
          data: payload.content.data["image/png"],
          mediaType: "image/png"
        }
      };
    } else if (payload.content.data.hasOwnProperty("text/html")) {
      return {
        ...foundWidget,
        widget_type: "html_widget",
        data: { text: payload.content.data["text/html"] }
      };
    } else if (payload.content.data.hasOwnProperty("text/plain")) {
      return {
        ...foundWidget,
        widget_type: "text_widget",
        data: { text: payload.content.data["text/plain"] }
      };
    }
  } else if (payload.msg_type === "error") {
    return {
      ...foundWidget,
      widget_type: "error_widget",
      data: { text: payload.content.evalue, reason: payload.content.ename }
    };
  }
  return foundWidget;
};

export const updateWidget = payload => (dispatch, getState) => {
  //console.log("UPDATE WIDGET");
  const { msgIdToCellUid } = getState().cells;
  const { widgets } = getState().widgets;
  const cellUid = msgIdToCellUid[payload.parent_header.msg_id];

  if (cellUid === "special_get_data_columns") {
    dispatch({
      type: SET_DATA_COLUMNS,
      payload: JSON.parse(payload.content.text)
    });
    return;
  }

  let found = false;
  let foundWidget = { data: { text: "" } };

  for (let [, w] of Object.entries(widgets)) {
    if (w.cellUid === cellUid) {
      found = true;
      foundWidget = w;
      break;
    }
  }
  //console.log(
  //  "Found " + found + " existing widget->",
  //  foundWidget.widgetUid + " " + foundWidget.cellUid
  //);
  //console.log(foundWidget);
  //console.log(payload.msg_type);

  if (!found) {
    dispatch({
      type: ADD_WIDGET,
      payload: createWidget(payload, cellUid, Object.keys(widgets).length)
    });
  } else {
    dispatch({
      type: UPDATE_WIDGET,
      payload: makeUpdate(foundWidget, payload)
    });
  }
};

export const clearWidget = cellUid => (dispatch, getState) => {
  console.log("clear the widget");
  const { widgets } = getState().widgets;
  let found = false;
  let foundWidget = { data: { text: "" } };

  const widgetUid = cellUid; // they are 1:1

  if (widgetUid in widgets) {
    found = true;
    foundWidget = widgets[widgetUid];
  }

  console.log(found, cellUid);
  console.log(foundWidget);
  /*for (let [, w] of Object.entries(widgets)) {
    if (w.cellUid === cellUid) {
      found = true;
      foundWidget = w;
      break;
    }
  }*/

  if (found) {
    const widget = {
      ...foundWidget,
      wasUpdated: false
    };

    if (widget.widget_type === "text_widget") {
      widget.data = { text: "" };
    }
    console.log(widget);

    dispatch({
      type: UPDATE_WIDGET,
      payload: widget
    });
  }
};

export const removeNotUpdatedWidgets = cellUid => (dispatch, getState) => {
  const { widgets } = getState().widgets;
  if (cellUid in widgets) {
    if (
      "wasUpdated" in widgets[cellUid] &&
      widgets[cellUid].wasUpdated === false
    ) {
      dispatch({ type: DELETE_WIDGET, payload: cellUid });
    }
  }
};

export const updateWidgetsLayout = newLayout => dispatch => {
  dispatch({
    type: UPDATE_WIDGETS_LAYOUT,
    payload: newLayout
  });
};
