import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import {
  getWidgets,
  updateWidgetsLayout,
  deleteWidget
} from "./WidgetsActions";

import { setFocusFromCellUid } from "../cells/CellsActions";

import { Button } from "reactstrap";
import { Responsive, WidthProvider } from "react-grid-layout";

import TextWidget from "./outputs/TextWidget";
import ErrorWidget from "./outputs/ErrorWidget";
import HTMLWidget from "./outputs/HTMLWidget";
import ImageWidget from "./outputs/ImageWidget";
import JSONWidget from "./outputs/JSONWidget";
import PlotlyWidget from "./outputs/PlotlyWidget";
import { ROW_GRID_HEIGHT } from "./Settings";
import { isEmpty } from "../../../utils/Common";

const ResponsiveGridLayout = WidthProvider(Responsive);

class WidgetsView extends Component {
  componentDidMount() {
    this.props.getWidgets(
      this.props.urlParams.organizationSlug,
      this.props.urlParams.projectId,
      this.props.urlParams.scriptId
    );
  }

  componentDidUpdate(prevProps) {}

  onLayoutChange = layout => {
    this.props.updateWidgetsLayout(layout);
  };

  onDeleteWidget = (widgetUid, widgetId) => {
    console.log("delete widget " + widgetUid);
    this.props.deleteWidget(
      this.props.urlParams.organizationSlug,
      this.props.urlParams.projectId,
      this.props.urlParams.scriptId,
      widgetUid,
      widgetId
    );
  };

  render() {
    const { cells } = this.props.cells;
    let focusMap = {};
    cells.forEach(cell => {
      focusMap[cell.cellUid] = { focus: cell.focus, state: cell.state };
    });

    const { widgets } = this.props.widgets;

    let widgetItems = Object.values(widgets).map((widget, index) => {
      let w = "";
      if (widget.widget_type === "text_widget") {
        w = <TextWidget data={widget.data} style={widget.style} />;
      } else if (widget.widget_type === "error_widget") {
        w = <ErrorWidget data={widget.data} style={widget.style} />;
      } else if (widget.widget_type === "html_widget") {
        w = <HTMLWidget data={widget.data} style={widget.style} />;
      } else if (widget.widget_type === "image_widget") {
        w = (
          <ImageWidget
            data={widget.data}
            style={widget.style}
            layout={widget.layout}
          />
        );
      } else if (widget.widget_type === "json_widget") {
        w = <JSONWidget data={widget.data} style={widget.style} />;
      } else if (widget.widget_type === "plotly_widget") {
        w = (
          <PlotlyWidget
            data={widget.data}
            style={widget.style}
            layout={widget.layout}
            editable={false} // need to write a logic to save that info
          />
        );
      }
      let widgetStyle = "";
      if (widget.cellUid in focusMap) {
        const { focus, state } = focusMap[widget.cellUid];
        if (focus) {
          widgetStyle =
            state === "busy" ? "widget-focus-busy" : "widget-focus-idle";
        } else {
          widgetStyle = state === "busy" ? "widget-focus-busy" : "";
        }
        if (state === "submitted") {
          widgetStyle = "widget-submitted";
        }
      }

      return (
        <div
          key={widget.widgetUid}
          style={{ padding: "0px", overflowY: "auto" }}
          className={widgetStyle}
          onClick={e => {
            this.props.setFocusFromCellUid(widget.widgetUid);
          }}
        >
          <div className="react-grid-drag-handle">
            <Button
              onClick={() => this.onDeleteWidget(widget.widgetUid, widget.id)}
              color="danger"
              size="sm"
            >
              <i className="fa fa-trash-o" aria-hidden="true" />
            </Button>
          </div>
          {w}
        </div>
      );
    });

    let layout = Object.values(widgets).map(widget => {
      return widget.layout;
    });

    return (
      <div>
        <ResponsiveGridLayout
          className="layout"
          layouts={{ sm: layout }}
          rowHeight={ROW_GRID_HEIGHT}
          breakpoints={{
            lg: 5000,
            md: 2000,
            sm: 768,
            xs: 480,
            xxs: 0
          }}
          cols={{ lg: 12, md: 12, sm: 12, xs: 12, xxs: 12 }}
          isResizable={true}
          isDraggable={true}
          onLayoutChange={this.onLayoutChange}
          draggableHandle=".react-grid-drag-handle"
        >
          {widgetItems}
        </ResponsiveGridLayout>
        <div style={{ height: "80px" }}></div>
      </div>
    );
  }
}

WidgetsView.propTypes = {
  auth: PropTypes.object.isRequired,
  urlParams: PropTypes.object.isRequired,
  getWidgets: PropTypes.func.isRequired,
  widgets: PropTypes.object.isRequired,
  updateWidgetsLayout: PropTypes.func.isRequired,
  deleteWidget: PropTypes.func.isRequired
};

const mapStateToProps = (state, ownProps) => ({
  widgets: state.widgets,
  auth: state.auth,
  urlParams: ownProps.match.params,
  cells: state.cells
});

export default connect(mapStateToProps, {
  getWidgets,
  updateWidgetsLayout,
  deleteWidget,
  setFocusFromCellUid
})(withRouter(WidgetsView));
