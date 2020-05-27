import React from "react";
import { connect } from "react-redux";
import { compose } from "redux";
import { RadioGroup, Radio } from "@blueprintjs/core";
import { upperFirst, toLower, omit } from "lodash-es";
import PropTypes from "prop-types";
import { ROLES } from "constants/index";

const RadioInput = props => {
  const { field, me, ...passProps } = props;

  return (
    <RadioGroup {...field} {...omit(passProps, "form")}>
      {Object.keys(ROLES).map(role => {
        if (me.role !== ROLES.MANAGER || role !== "ADMIN") {
          return (
            <Radio label={upperFirst(toLower(role))} value={ROLES[role]} />
          );
        } else {
          return null;
        }
      })}
    </RadioGroup>
  );
};

RadioInput.propTypes = {
  field: PropTypes.object
};

const mapStateToProps = state => ({
  me: state.auth.me
});

export default compose(connect(mapStateToProps, {}))(RadioInput);
