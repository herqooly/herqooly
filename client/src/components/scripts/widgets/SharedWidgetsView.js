import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import { Responsive, WidthProvider } from "react-grid-layout";

import TextWidget from "./outputs/TextWidget";
import ErrorWidget from "./outputs/ErrorWidget";
import HTMLWidget from "./outputs/HTMLWidget";
import ImageWidget from "./outputs/ImageWidget";
import JSONWidget from "./outputs/JSONWidget";
import PlotlyWidget from "./outputs/PlotlyWidget";

const ResponsiveGridLayout = WidthProvider(Responsive);

class SharedWidgetsView extends Component {
  componentDidMount() {}

  componentDidUpdate(prevProps) {}

  render() {
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
            editable={false}
            layout={widget.layout}
          />
        );
      }

      return (
        <div
          key={widget.widgetUid}
          style={{ padding: "0px", overflowY: "auto", border: "0px" }}
        >
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
          rowHeight={10}
          breakpoints={{
            lg: 5000,
            md: 2000,
            sm: 768,
            xs: 480,
            xxs: 0
          }}
          cols={{ lg: 12, md: 12, sm: 12, xs: 12, xxs: 12 }}
          isResizable={false}
          isDraggable={false}
        >
          {widgetItems}
        </ResponsiveGridLayout>
      </div>
    );
  }
}

SharedWidgetsView.propTypes = {
  widgets: PropTypes.object.isRequired
};

const mapStateToProps = (state, ownProps) => ({
  widgets: state.widgets
});

export default connect(mapStateToProps, {})(withRouter(SharedWidgetsView));
