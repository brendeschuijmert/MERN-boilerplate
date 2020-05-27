import React, { useState } from "react";
import { connect } from "react-redux";
import { compose } from "redux";
import { NumericInput } from "formik-blueprint";
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
import { updateProfile } from "store/actions/auth";
import { getRecords } from "store/actions/record";
import { showToast } from "store/actions/toast";

const validateSchema = Yup.object().shape({
  preferredWorkingHours: Yup.number()
    .notOneOf([0], "Hour must be over 0!")
    .min(0, "Hour must be over 0!")
    .max(24, "Hour must be less than 24!")
    .required("Required")
});

const PreferredWorkingHours = props => {
  const { updateProfile, me, showToast, getRecords, params, media } = props;
  const [isOpen, toggleDialog] = useState(false);

  const handleSubmit = (values, actions) => {
    updateProfile({
      body: values,
      success: () => {
        actions.setSubmitting(false);
        showToast({
          message: "Successfully updated preferred working hours!",
          intent: Intent.SUCCESS,
          timeout: 3000
        });
        getRecords({ params });
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

  return (
    <>
      <Button
        icon="time"
        className={Classes.DARK}
        onClick={() => toggleDialog(true)}
      >
        {media === "desktop"
          ? `Update Preferred Working Hours (${me.preferredWorkingHours} hours)`
          : ""}
      </Button>
      <Dialog
        icon="edit"
        isOpen={isOpen}
        onClose={() => toggleDialog(false)}
        title="Update Preferred Working Hours"
        className={Classes.DARK}
      >
        <div className={Classes.DIALOG_BODY}>
          <Formik
            onSubmit={handleSubmit}
            initialValues={{
              preferredWorkingHours: me.preferredWorkingHours
            }}
            validationSchema={validateSchema}
          >
            {({
              submitForm,
              isSubmitting,
              errors: { preferredWorkingHours: preferredWorkingHoursError }
            }) => {
              return (
                <Form>
                  <FormGroup
                    helperText={preferredWorkingHoursError}
                    intent={
                      preferredWorkingHoursError ? Intent.DANGER : Intent.NONE
                    }
                    label="Preferred Working Hours"
                    labelFor="preferredWorkingHours"
                  >
                    <Field
                      component={NumericInput}
                      intent={
                        preferredWorkingHoursError ? Intent.DANGER : Intent.NONE
                      }
                      placeholder="Preferred Working Hours (required)"
                      id="preferredWorkingHours"
                      name="preferredWorkingHours"
                      type="text"
                      large
                    />
                  </FormGroup>
                  {isSubmitting && <ProgressBar />}
                  <br />
                  <div className={Classes.DIALOG_FOOTER_ACTIONS}>
                    <Button text="Cancel" onClick={() => toggleDialog(false)} />
                    <Button
                      icon="edit"
                      intent={Intent.PRIMARY}
                      onClick={submitForm}
                      text="Update"
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
  me: state.auth.me,
  params: state.record.params
});

const mapDispatchToProps = {
  updateProfile: updateProfile,
  getRecords: getRecords,
  showToast: showToast
};

export default compose(connect(mapStateToProps, mapDispatchToProps))(
  PreferredWorkingHours
);
