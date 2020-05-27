import React, { useState } from "react";
import { connect } from "react-redux";
import { compose } from "redux";
import { Button, Dialog, Intent, Classes } from "@blueprintjs/core";
import { deleteUser, getUsers } from "store/actions/user";
import { showToast } from "store/actions/toast";
import withToast from "hoc/withToast";

const DeleteRow = props => {
  const { deleteUser, showToast, selectedRow } = props;
  const [isOpen, toggleDialog] = useState(false);

  const deleteRow = () => {
    deleteUser({
      id: selectedRow._id,
      success: () => {
        showToast({
          message: "Selected user removed!",
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
        title="Delete User"
        className={Classes.DARK}
      >
        <div className={Classes.DIALOG_BODY}>
          Would you like to remove the selected user?
        </div>
        <div className={Classes.DIALOG_FOOTER}>
          <div className={Classes.DIALOG_FOOTER_ACTIONS}>
            <Button text="Cancel" onClick={() => toggleDialog(false)} />
            <Button
              icon="trash"
              intent={Intent.DANGER}
              onClick={deleteRow}
              text="Remove"
              className={Classes.DARK}
            />
          </div>
        </div>
      </Dialog>
    </>
  );
};

const mapStateToProps = state => ({
  params: state.user.params
});

const mapDispatchToProps = {
  deleteUser: deleteUser,
  getUsers: getUsers,
  showToast: showToast
};

export default compose(connect(mapStateToProps, mapDispatchToProps))(
  withToast(DeleteRow)
);
