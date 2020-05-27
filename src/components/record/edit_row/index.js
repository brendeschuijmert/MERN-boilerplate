import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { compose } from "redux";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import _ from "lodash-es";
import {
  Button,
  Dialog,
  Intent,
  Classes,
  FormGroup,
  ProgressBar
} from "@blueprintjs/core";
import { map } from "lodash-es";
import moment from "moment";
import { updateRecord, getRecords } from "store/actions/record";
import { showToast } from "store/actions/toast";
import { DATE_FORMAT, RECORD_FIELDS } from "constants/index";
import SelectUser from "components/select_user";

const EditRow = props => {
  const {
    updateRecord,
    showToast,
    selectedRow,
    me,
    users,
    params,
    getRecords
  } = props;
  const [isOpen, toggleDialog] = useState(false);
  const [toDate, selectDate] = useState(new Date(selectedRow.date));

  const [userIndex, setUserIndex] = useState(0);

  useEffect(() => {
    setUserIndex(map(users, "_id").indexOf(selectedRow.user["_id"]));
  }, [selectedRow, users]);

  useEffect(() => {
    selectDate(new Date(selectedRow.date));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const fieldList = ["date", "note", "hour"];

  const validation = {};
  _.toPairs(_.pick(RECORD_FIELDS, fieldList)).map(
    a => (validation[a[0]] = _.get(a[1], "validate", null))
  );
  const validateSchema = Yup.object().shape(validation);

  const handleClick = item => {
    const index = map(users, "_id").indexOf(item._id);
    setUserIndex(index);
  };

  const handleSubmit = (values, actions) => {
    values["date"] = moment(toDate).format(DATE_FORMAT);
    if (me.role === 2) {
      values["user"] = users[userIndex]._id;
    }
    updateRecord({
      id: selectedRow._id,
      body: values,
      success: () => {
        actions.setSubmitting(false);
        getRecords({
          params
        });

        showToast({
          message: "Successfully updated the row to table!",
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
    a => (initialValue[a[0]] = _.get(selectedRow, a[0], ""))
  );

  return (
    <>
      <Button
        icon="edit"
        className={Classes.MINIMAL}
        intent={Intent.PRIMARY}
        onClick={() => toggleDialog(true)}
      >
        Edit
      </Button>
      <Dialog
        icon="edit"
        isOpen={isOpen}
        onClose={() => toggleDialog(false)}
        title="Edit Record"
        className={Classes.DARK}
      >
        <div className={Classes.DIALOG_BODY}>
          <Formik
            onSubmit={handleSubmit}
            initialValues={initialValue}
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
                      icon="edit"
                      intent={Intent.PRIMARY}
                      onClick={submitForm}
                      text="Save"
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
  updateRecord: updateRecord,
  getRecords: getRecords,
  showToast: showToast
};

export default compose(connect(mapStateToProps, mapDispatchToProps))(EditRow);
