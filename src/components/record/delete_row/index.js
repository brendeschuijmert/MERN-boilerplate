import React, { useState } from "react";
import { connect } from "react-redux";
import { compose } from "redux";
import { Button, Dialog, Intent, Classes } from "@blueprintjs/core";
import { delRecord, getRecords } from "store/actions/record";
import { showToast } from "store/actions/toast";

const DeleteRow = props => {
  const { delRecord, showToast, selectedRow } = props;
  const [isOpen, toggleDialog] = useState(false);

  const deleteRow = () => {
    delRecord({
      id: selectedRow._id,
      success: () => {
        showToast({
          message: "Selected Record removed.",
          intent: Intent.SUCCESS
        });
        toggleDialog(false);
      },
      fail: err => {
        showToast({
          message: err.response.data.message,
          status: Intent.DANGER
        });
        toggleDialog(false);
      }
    });
  };

  return (
    <>
      <Button
        icon="trash"
        className={Classes.MINIMAL}
        intent={Intent.DANGER}
        onClick={() => {
          toggleDialog(true);
        }}
      >
        Remove
      </Button>
      <Dialog
        icon="trash"
        isOpen={isOpen}
        onClose={() => toggleDialog(false)}
        title="Delete Record"
        className={Classes.DARK}
      >
        <div className={Classes.DIALOG_BODY}>
          Would you like to remove the selected record?
        </div>
        <div className={Classes.DIALOG_FOOTER}>
          <div className={Classes.DIALOG_FOOTER_ACTIONS}>
            <Button text="Cancel" onClick={() => toggleDialog(false)} />
            <Button
              icon="trash"
              intent={Intent.DANGER}
              onClick={deleteRow}
              text="Remove"
            />
          </div>
        </div>
      </Dialog>
    </>
  );
};

const mapStateToProps = state => ({
  params: state.record.params
});

const mapDispatchToProps = {
  delRecord: delRecord,
  getRecords: getRecords,
  showToast: showToast
};

export default compose(connect(mapStateToProps, mapDispatchToProps))(DeleteRow);
