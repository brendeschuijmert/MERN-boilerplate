import React from "react";
import { omit } from "lodash-es";
import { DateInput } from "@blueprintjs/datetime";
import PropTypes from "prop-types";

const DatePicker = props => {
  const { field, ...passProps } = props;
  return <DateInput {...field} {...omit(passProps, "form")} />;
};

DatePicker.propTypes = {
  field: PropTypes.object
};

export default DatePicker;
