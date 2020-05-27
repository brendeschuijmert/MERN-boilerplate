import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import _debounce from "lodash/debounce";
import { setMediaFlag } from "store/actions/general";

const mapDispatchToProps = {
  setMediaFlag
};

class DomUtility extends React.Component {
  constructor(props) {
    super(props);

    this.debouncedUpdate = _debounce(this.updateDimensions, 300);
  }

  updateDimensions = () => {
    if (window.innerWidth >= 992) {
      this.props.setMediaFlag({ media: "desktop" });
    } else if (window.innerWidth >= 768 && window.innerWidth < 992) {
      this.props.setMediaFlag({ media: "tablet" });
    } else {
      this.props.setMediaFlag({ media: "mobile" });
    }
  };

  componentDidMount() {
    this.updateDimensions();
    window.addEventListener("resize", this.debouncedUpdate);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.debouncedUpdate);
  }

  render() {
    return null;
  }
}

DomUtility.propTypes = {
  setMediaFlag: PropTypes.func
};

export default connect(null, mapDispatchToProps)(DomUtility);
