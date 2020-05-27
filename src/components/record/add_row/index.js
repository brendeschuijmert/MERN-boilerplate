import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { compose } from "redux";
import * as Yup from "yup";
import { Formik, Form, Field } from "formik";
import { map } from "lodash-es";
import {
  Button,
  Dialog,
  Intent,
  Classes,
  FormGroup,
  ProgressBar
} from "@blueprintjs/core";
import moment from "moment";
import _ from "lodash-es";
import { createRecord, getRecords } from "store/actions/record";
import { showToast } from "store/actions/toast";
import withToast from "hoc/withToast";
import { DATE_FORMAT, RECORD_FIELDS, ROLES } from "constants/index";
import { getUsers, setParams } from "store/actions/user";
import SelectUser from "components/select_user";

const AddRow = props => {
  const {
    createRecord,
    showToast,
    me,
    users,
    count,
    userParams,
    getUsers,
    setParams
  } = props;
  const [isOpen, toggleDialog] = useState(false);
  const [toDate, selectDate] = useState(new Date());
  const [userIndex, setUserIndex] = useState(0);

  const fieldList = ["date", "note", "hour"];

  const validation = {};
  _.toPairs(_.pick(RECORD_FIELDS, fieldList)).map(
    a => (validation[a[0]] = _.get(a[1], "validate", null))
  );
  const validateSchema = Yup.object().shape(validation);

  useEffect(() => {
    if (userParams.limit !== count && me.role === ROLES.ADMIN) {
      setParams({ page: 1, limit: count });
      getUsers({ params: userParams });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [users, count]);

  useEffect(() => {
    selectDate(new Date());
  }, [isOpen]);

  const handleClick = item => {
    const index = map(users, "_id").indexOf(item._id);
    setUserIndex(index);
  };

  const handleSubmit = (values, actions) => {
    values["date"] = moment(toDate).format(DATE_FORMAT);
    if (me.role === 2) {
      values["user"] = users[userIndex]._id;
    }
    createRecord({
      body: values,
      success: () => {
        actions.setSubmitting(false);
        showToast({
          message: "Successfully added one row to table!",
          intent: Intent.SUCCESS,
          timeout: 3000
        });
        toggleDialog(false);
      },
      fail: err => {
        actions.setSubmitting(false);
        showToast({
          message: err.response.data.message,
          intent: Intent.DANGER
        });
      }
    });
  };

  const passProps = {
    onChange: date => {
      selectDate(date);
    },
    value: toDate
  };

  const initialValue = {};
  _.toPairs(_.pick(RECORD_FIELDS, fieldList)).map(
    a => (initialValue[a[0]] = _.get(a[1], "initialValue", ""))
  );

  return (
    <>
      <Button icon="add" onClick={() => toggleDialog(true)}>
        Add
      </Button>
      <Dialog
        icon="add"
        isOpen={isOpen}
        onClose={() => toggleDialog(false)}
        title="Add Record"
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
                        label={RECORD_FIELDS[field].form_label}
                        labelFor={RECORD_FIELDS[field].id}
                      >
                        <Field
                          {...RECORD_FIELDS[field]}
                          {...(field === "date" ? passProps : null)}
                          intent={
                            touched[field] && errors[field]
                              ? Intent.DANGER
                              : Intent.NONE
                          }
                        />
                      </FormGroup>
                    );
                  })}
                  {me.role === 2 && (
                    <SelectUser
                      handleClick={handleClick}
                      userIndex={userIndex}
                      users={users}
                    />
                  )}
                  <br />
                  {isSubmitting && <ProgressBar />}
                  <br />
                  <div className={Classes.DIALOG_FOOTER_ACTIONS}>
                    <Button text="Cancel" onClick={() => toggleDialog(false)} />
                    <Button
                      icon="add"
                      intent={Intent.PRIMARY}
                      onClick={submitForm}
                      text="Add"
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
  params: state.record.params,
  me: state.auth.me,
  users: state.user.users,
  userParams: state.user.params,
  count: state.user.count
});

const mapDispatchToProps = {
  createRecord: createRecord,
  getRecords: getRecords,
  showToast: showToast,
  getUsers: getUsers,
  setParams: setParams
};

export default compose(connect(mapStateToProps, mapDispatchToProps))(
  withToast(AddRow)
);
