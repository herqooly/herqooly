import axios from "axios";

import { toast } from "react-toastify";
import { GET_WIDGETS } from "../scripts/widgets/WidgetsTypes";

export const getSharedWidgets = shareUid => dispatch => {
  axios
    .get(`/api/v1/${shareUid}/shared`)
    .then(res => {
      console.log(res.data);
      /*dispatch({
        type: GET_SCRIPTS,
        payload: res.data
      });*/
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
      toast.error("Get shared view problem problem. " + err, {
        autoClose: 8000,
        hideProgressBar: true,
        newsetOnTop: true
      });
    });
};
