import React from "react";
import ToastAlert from "components/toast";

const withToast = WrappedComponent => {
  return function Toast(props) {
    return (
      <>
        <ToastAlert />
        <WrappedComponent {...props} />
      </>
    );
  };
};

export default withToast;
