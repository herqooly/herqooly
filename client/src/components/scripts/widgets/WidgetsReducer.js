import {
  GET_WIDGETS,
  ADD_WIDGET,
  UPDATE_WIDGET,
  UPDATE_WIDGETS_LAYOUT,
  DELETE_WIDGET
} from "./WidgetsTypes";
//import { UPDATE_CELL } from "../cell/CellListTypes";

const initialState = {
  widgets: {}
};

export default function widgetsReducer(state = initialState, action) {
  switch (action.type) {
    case GET_WIDGETS:
      return {
        ...state,
        widgets: action.payload
      };
    case ADD_WIDGET:
      const w = action.payload;
      state.widgets[w.widgetUid] = w;
      return {
        ...state,
        widgets: state.widgets
      };
    case UPDATE_WIDGET:
      const w2 = action.payload;
      state.widgets[w2.widgetUid] = w2;
      return {
        ...state,
        widgets: state.widgets
      };
    case UPDATE_WIDGETS_LAYOUT:
      const newLayout = action.payload;
      newLayout.forEach(element => {
        state.widgets[element.i].layout = element;
      });
      return {
        ...state,
        widgets: state.widgets
      };

    case DELETE_WIDGET:
      delete state.widgets[action.payload];
      return {
        ...state,
        widgets: state.widgets
      };

    default:
      return state;
  }
}
