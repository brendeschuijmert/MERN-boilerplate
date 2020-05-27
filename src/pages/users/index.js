import React, { useEffect } from "react";
import { connect } from "react-redux";
import { compose } from "redux";
import classNames from "classnames";
import {
  Classes,
  ButtonGroup,
  Card,
  Elevation,
  Breadcrumb
} from "@blueprintjs/core";
import {
  Table,
  Column,
  Cell,
  RenderMode,
  ColumnLoadingOption,
  SelectionModes
} from "@blueprintjs/table";
import { upperFirst, toLower } from "lodash-es";
import Header from "components/header";
import { getUsers, setParams } from "store/actions/user";
import { ROLES } from "constants/index";
import withToast from "hoc/withToast";
import Pagination from "components/pagination";
import { AddRow, EditRow, DeleteRow } from "components/user";

const Users = props => {
  const { users, getUsers, params, setParams, count, media, loading } = props;

  const style = {
    card: {
      width: media !== "mobile" ? "70%" : "95%",
      maxWidth: "100rem",
      margin: "auto",
      marginTop: "3rem"
    }
  };

  useEffect(() => {
    setParams({ page: 1, limit: 5 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    getUsers({ params });
  }, [params, getUsers]);

  useEffect(() => {
    getUsers({ params });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [count]);

  const onPageChange = page => {
    setParams({ page });
  };

  return (
    <div>
      <Header />
      <Card
        elevation={Elevation.FOUR}
        style={style.card}
        className={Classes.DARK}
      >
        <Breadcrumb icon="chevron-right" text="Users" disabled={true} />
        <br />
        <br />
        <AddRow />
        {params.limit >= users.length && (
          <>
            <Table
              className="my-3"
              numRows={users.length}
              defaultRowHeight={38}
              columnWidths={[50, 208, 300, 200, 274, 272]}
              renderMode={RenderMode.NONE}
              enableRowHeader={false}
              selectionModes={SelectionModes.NONE}
            >
              <Column
                className={Classes.LARGE}
                name="No"
                cellRenderer={row => (
                  <Cell>{row + (params.page - 1) * params.limit + 1}</Cell>
                )}
                loadingOptions={loading ? ColumnLoadingOption.CELLS : null}
              />
              <Column
                className={classNames(Classes.LARGE, "pt-1", "pl-2")}
                name="Name"
                cellRenderer={row => (
                  <Cell>
                    {users[row]
                      ? users[row].firstName + " " + users[row].lastName
                      : ""}
                  </Cell>
                )}
                loadingOptions={loading ? ColumnLoadingOption.CELLS : null}
              />
              <Column
                className={Classes.LARGE}
                name="Email"
                cellRenderer={row => (
                  <Cell>{users[row] ? users[row].email : ""}</Cell>
                )}
                loadingOptions={loading ? ColumnLoadingOption.CELLS : null}
              />
              <Column
                className={Classes.LARGE}
                name="Role"
                cellRenderer={row => (
                  <Cell>
                    {users[row]
                      ? upperFirst(toLower(Object.keys(ROLES)[users[row].role]))
                      : ""}
                  </Cell>
                )}
                loadingOptions={loading ? ColumnLoadingOption.CELLS : null}
              />
              <Column
                className={Classes.LARGE}
                name="Preferred Working Hours"
                cellRenderer={row => (
                  <Cell>
                    {users[row] ? users[row].preferredWorkingHours : ""}
                  </Cell>
                )}
              />
              <Column
                name="Actions"
                cellRenderer={row => (
                  <Cell>
                    {users[row] && (
                      <ButtonGroup>
                        <EditRow selectedRow={users[row]} />
                        <DeleteRow selectedRow={users[row]} />
                      </ButtonGroup>
                    )}
                  </Cell>
                )}
                loadingOptions={loading ? ColumnLoadingOption.CELLS : null}
              />
            </Table>
            <Pagination
              initialPage={params.page}
              onPageChange={onPageChange}
              setParams={setParams}
              params={params}
              count={count}
            />
          </>
        )}
      </Card>
    </div>
  );
};

const mapStateToProps = state => ({
  users: state.user.users,
  params: state.user.params,
  count: state.user.count,
  user: state.user.user,
  media: state.general.media,
  loading: state.user.loading
});

const mapDispatchToProps = {
  getUsers: getUsers,
  setParams: setParams
};

export default compose(connect(mapStateToProps, mapDispatchToProps))(
  withToast(Users)
);
