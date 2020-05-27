import React from "react";
import { connect } from "react-redux";
import { compose } from "redux";
import { Formik, Form, Field } from "formik";
import classNames from "classnames";
import PropTypes from "prop-types";
import _ from "lodash-es";
import { useHistory } from "react-router-dom";
import {
  Button,
  Card,
  Intent,
  Classes,
  ProgressBar,
  FormGroup,
  Elevation
} from "@blueprintjs/core";
import * as Yup from "yup";
import { signup } from "store/actions/auth";
import { showToast } from "store/actions/toast";
import withToast from "hoc/withToast";
import { USER_FIELDS } from "constants/index";

const SignUp = props => {
  const { signup, showToast, media } = props;
  const history = useHistory();

  const initialValue = {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    passwordConfirm: ""
  };

  const fieldList = [
    "firstName",
    "lastName",
    "email",
    "password",
    "passwordConfirm"
  ];

  const validation = {};
  _.toPairs(_.pick(USER_FIELDS, fieldList)).map(
    a => (validation[a[0]] = _.get(a[1], "validate", null))
  );
  const validateSchema = Yup.object().shape(validation);

  const handleSubmit = (values, actions) => {
    signup({
      body: values,
      success: () => {
        actions.setSubmitting(false);
        showToast({
          message: "You are successfully signed up!",
          intent: Intent.SUCCESS,
          timeout: 3000
        });
      },
      fail: err => {
        actions.setSubmitting(false);
        showToast({
          message: err.response.data.message,
          status: Intent.DANGER
        });
      }
    });
  };

  return (
    <>
      <Card
        className="bp3-dark transition"
        elevation={Elevation.TWO}
        style={{ width: media !== "mobile" ? "30rem" : "95%", margin: "auto" }}
      >
        <h2 className="text-center">
          Welcome to your productivity origin story
        </h2>
        <br />
        <Formik
          onSubmit={handleSubmit}
          initialValues={initialValue}
          validationSchema={validateSchema}
        >
          {({ submitForm, isSubmitting, touched, errors }) => {
            return (
              <Form>
                {fieldList.map((field, index) => {
                  return (
                    <FormGroup
                      helperText={touched[field] && errors[field]}
                      intent={
                        touched[field] && errors[field]
                          ? Intent.DANGER
                          : Intent.NONE
                      }
                      label={USER_FIELDS[field].form_label}
                      labelFor={USER_FIELDS[field].id}
                      key={index}
                    >
                      <Field
                        {...USER_FIELDS[field]}
                        intent={
                          touched[field] && errors[field]
                            ? Intent.DANGER
                            : Intent.NONE
                        }
                      />
                    </FormGroup>
                  );
                })}
                {isSubmitting && <ProgressBar />}
                <br />
                <Button
                  className={classNames(Classes.DARK, Classes.LARGE)}
                  disabled={isSubmitting}
                  onClick={submitForm}
                  icon="log-in"
                >
                  Sign Up
                </Button>
                <Button
                  className={classNames(
                    Classes.MINIMAL,
                    Classes.TEXT_SMALL,
                    Classes.NAVBAR_GROUP,
                    Classes.ALIGN_RIGHT
                  )}
                  onClick={() => history.push("/login")}
                >
                  Back to Log In
                </Button>
              </Form>
            );
          }}
        </Formik>
      </Card>
    </>
  );
};

SignUp.propTypes = {
  signup: PropTypes.func.isRequired,
  showToast: PropTypes.func.isRequired
};

const mapDispatchToProps = {
  signup: signup,
  showToast: showToast
};

const mapStateToProps = state => ({
  media: state.general.media
});

export default compose(connect(mapStateToProps, mapDispatchToProps))(
  withToast(SignUp)
);
