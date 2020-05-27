import React from "react";
import { Toast, Position, Toaster } from "@blueprintjs/core";
import { compose } from "redux";
import { connect } from "react-redux";
import { hideToast } from "store/actions/toast";
import { PropTypes } from "prop-types";

function ToastAlert(props) {
  const { toast, hideToast } = props;
  return (
    <>
      {toast.show && (
        <Toaster position={Position.TOP_RIGHT}>
          <Toast onDismiss={() => hideToast()} {...toast}></Toast>
        </Toaster>
      )}
    </>
  );
}

ToastAlert.propTypes = {
  hideToast: PropTypes.func.isRequired,
  toast: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  toast: state.toast
});

const mapDispatchToProps = {
  hideToast: hideToast
};

export default compose(connect(mapStateToProps, mapDispatchToProps))(
  ToastAlert
);
