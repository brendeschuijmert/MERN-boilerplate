import React, { useState } from "react";
import { connect } from "react-redux";
import { compose } from "redux";
import classNames from "classnames";
import { Link, useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import get from "lodash-es/get";
import { Navbar, Button, Alignment, Classes, Intent } from "@blueprintjs/core";
import { signout } from "store/actions/auth";
import { ROLES } from "constants/index";
import ManageProfile from "components/manage_profile";
import { showToast } from "store/actions/toast";
import withToast from "hoc/withToast";

const Header = props => {
  const { signout, showToast, media } = props;
  const [isOpen, toggleDialog] = useState(false);

  const role = useSelector(state => get(state, "auth.me.role", 0));
  const isManagable = role === ROLES.MANAGER || role === ROLES.ADMIN;
  const history = useHistory();

  return (
    <>
      <Navbar className={Classes.DARK}>
        {media !== "mobile" && (
          <Navbar.Group align={Alignment.LEFT}>
            <Navbar.Heading
              className="cursor-pointer"
              onClick={() => {
                history.push("/dashboard");
              }}
            >
              Time Management
            </Navbar.Heading>
            <Navbar.Divider />
          </Navbar.Group>
        )}
        {media === "mobile" && (
          <Navbar.Group align={Alignment.LEFT}>
            <Navbar.Heading className="cursor-pointer">
              <Button
                className={classNames(Classes.SMALL, Classes.MINIMAL)}
                icon="time"
                onClick={() => {
                  history.push("/dashboard");
                }}
              />
            </Navbar.Heading>
          </Navbar.Group>
        )}
        <Navbar.Group align={Alignment.RIGHT}>
          <Link
            className={classNames("mr-3", Classes.BUTTON, Classes.MINIMAL)}
            to="/dashboard"
          >
            Records
          </Link>
          {isManagable && (
            <Link
              className={classNames("mr-3", Classes.BUTTON, Classes.MINIMAL)}
              to="/users"
            >
              Users
            </Link>
          )}
          <Navbar.Divider />
          <ManageProfile isOpen={isOpen} toggleDialog={toggleDialog} />
          <Button
            className={classNames(Classes.SMALL, Classes.MINIMAL, "ml-2")}
            icon="log-out"
            onClick={() => {
              signout();
              showToast({
                message: "You are logged out!",
                intent: Intent.WARNING,
                timeout: 3000
              });
            }}
          />
        </Navbar.Group>
      </Navbar>
    </>
  );
};

const mapDispatchToProps = {
  signout: signout,
  showToast: showToast
};

const mapStateToProps = state => ({
  media: state.general.media
});

export default compose(connect(mapStateToProps, mapDispatchToProps))(
  withToast(Header)
);
