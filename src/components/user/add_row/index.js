import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { compose } from "redux";
import * as Yup from "yup";
import { Formik, Form, Field } from "formik";
import {
  Button,
  Dialog,
  Intent,
  Classes,
  FormGroup,
  ProgressBar
} from "@blueprintjs/core";
import { handleNumberChange } from "@blueprintjs/docs-theme";
import _ from "lodash-es";
import { createUser, getUsers } from "store/actions/user";
import { showToast } from "store/actions/toast";
import withToast from "hoc/withToast";
import { USER_FIELDS } from "constants/index";

const AddRow = props => {
  const { createUser, showToast } = props;
  const [isOpen, toggleDialog] = useState(false);
  const [value, setValue] = useState(0);
  const handleValueChange = handleNumberChange(value => setValue(value));

  useEffect(() => {
    setValue(0);
  }, [isOpen]);

  const fieldList = [
    "firstName",
    "lastName",
    "email",
    "password",
    "passwordConfirm",
    "role",
    "preferredWorkingHours"
  ];

  const validation = {};
  _.toPairs(_.pick(USER_FIELDS, fieldList)).map(
    a => (validation[a[0]] = _.get(a[1], "validate", null))
  );
  const validateSchema = Yup.object().shape(validation);

  const handleSubmit = (values, actions) => {
    values["role"] = value;
    createUser({
      body: values,
      success: () => {
        actions.setSubmitting(false);
        showToast({
          message: "Successfully added one user!",
          intent: Intent.SUCCESS,
          timeout: 3000
        });
        toggleDialog(false);
      },
      fail: err => {
        actions.setSubmitting(false);
        showToast({
          message: err.response.data.message,
          intent: Intent.DANGER,
          timeout: 3000
        });
      }
    });
  };

  const initialValue = {};
  _.toPairs(_.pick(USER_FIELDS, fieldList)).map(
    a => (initialValue[a[0]] = _.get(a[1], "initialValue", ""))
  );

  const passToProps = {
    onChange: handleValueChange,
    selectedValue: value
  };

  return (
    <>
      <Button icon="add" onClick={() => toggleDialog(true)}>
        Add User
      </Button>
      <Dialog
        icon="add"
        isOpen={isOpen}
        onClose={() => toggleDialog(false)}
        title="Add User"
        className={Classes.DARK}
      >
        <div className={Classes.DIALOG_BODY}>
          <Formik
            onSubmit={handleSubmit}
            initialValues={{ ...initialValue }}
            validationSchema={validateSchema}
          >
            {({ submitForm, isSubmitting, touched, errors }) => {
              return (
                <Form>
                  {fieldList.map(field => {
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
                      >
                        <Field
                          {...USER_FIELDS[field]}
                          {...(field === "role" ? passToProps : null)}
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
                  <div className={Classes.DIALOG_FOOTER_ACTIONS}>
                    <Button text="Cancel" onClick={() => toggleDialog(false)} />
                    <Button
                      icon="add"
                      intent={Intent.PRIMARY}
                      onClick={submitForm}
                      text="Add"
                      className={Classes.DARK}
                    />
                  </div>
                </Form>
              );
            }}
          </Formik>
        </div>
      </Dialog>
    </>
  );
};

const mapStateToProps = state => ({
  params: state.user.params
});

const mapDispatchToProps = {
  createUser: createUser,
  getUsers: getUsers,
  showToast: showToast
};

export default compose(connect(mapStateToProps, mapDispatchToProps))(
  withToast(AddRow)
);
