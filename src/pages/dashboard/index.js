import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { compose } from "redux";
import PropTypes from "prop-types";
import classNames from "classnames";
import _ from "lodash-es";
import Blob from "blob";
import download from "downloadjs";
import {
  Card,
  Elevation,
  ButtonGroup,
  Classes,
  Intent,
  Button,
  Tooltip,
  Breadcrumb
} from "@blueprintjs/core";
import {
  Table,
  Column,
  Cell,
  RenderMode,
  SelectionModes
} from "@blueprintjs/table";
import { DateRangeInput } from "@blueprintjs/datetime";
import moment from "moment";
import Header from "components/header";
import Pagination from "components/pagination";
import { AddRow, EditRow, DeleteRow } from "components/record";
import PreferredWorkingHours from "components/preferred_working_hours";
import { getUsers } from "store/actions/user";
import { EnhancedMomentDate } from "components/moment_daterange";
import MultiSelectUser from "components/multi_select_user";
import { setParams, getRecords, generateRecords } from "store/actions/record";
import withToast from "hoc/withToast";
import { DATE_FORMAT, ROLES } from "constants/index";

const Dashboard = props => {
  const {
    setParams,
    params,
    getRecords,
    records,
    count,
    me,
    userParams,
    getUsers,
    users,
    userCount,
    generateRecords,
    media
  } = props;
  const [startDate, updateStartDate] = useState(null);
  const [endDate, updateEndDate] = useState(null);
  const [selectedUsers, setSelectedUsers] = useState([]);

  const preferredWorkingHours = _.get(me, "preferredWorkingHours", 0);

  const style = {
    card: {
      width: media !== "mobile" ? "90%" : "95%",
      maxWidth: "100rem",
      margin: "auto",
      marginTop: "3rem"
    },
    cardChild: {
      justifyContent: "space-between"
    },
    cell: {
      padding: "0.3rem"
    }
  };

  const getColor = row => {
    if (row >= 0) {
      const recordWorkingHours = _.get(
        records,
        `${row}.user.preferredWorkingHours`,
        0
      );
      const totalHours = _.get(records, `${row}.totalHours`);
      return recordWorkingHours > totalHours ? Intent.DANGER : Intent.SUCCESS;
    } else {
      return Intent.NONE;
    }
  };

  const jsDateFormatter = {
    formatDate: date => {
      return moment(date).format(DATE_FORMAT);
    },
    parseDate: str => {
      return new Date(str);
    },
    placeholder: DATE_FORMAT
  };

  const onPageChange = page => {
    setParams({ page });
  };

  useEffect(() => {
    getRecords({ params });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params]);

  useEffect(() => {
    getRecords({ params });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [count]);

  useEffect(() => {
    if (userParams.limit !== userCount && me.role === ROLES.ADMIN) {
      getUsers({
        params: {
          limit: userCount,
          page: 1
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [users, userCount]);

  const handleChangeDateRange = dateRange => {
    const [fromDate, toDate] = dateRange;
    const from = moment(fromDate);
    const to = moment(toDate);
    setParams({
      page: 1,
      from: from.isValid() ? from.format(DATE_FORMAT) : null,
      to: to.isValid() ? to.format(DATE_FORMAT) : null
    });
    updateStartDate(fromDate);
    updateEndDate(toDate);
  };

  const removeRange = () => {
    if (startDate || endDate) {
      setParams({
        page: 1,
        from: null,
        to: null
      });
    }
    updateStartDate(null);
    updateEndDate(null);
  };

  const handleExportRecords = () => {
    generateRecords({
      params,
      success: res => {
        const { records } = res.data;
        const from = `from <b>${moment(params.from).format(DATE_FORMAT)}</b>`;
        const to = `to <b>${moment(params.to).format(DATE_FORMAT)}</b>`;
        const title = `Exported Records ${params.from ? from : ""} ${
          params.to ? to : ""
        } `;

        const additionalTitle =
          me.role < ROLES.ADMIN
            ? ` (Preferred Working Hours: <b>${preferredWorkingHours}</b> hours)`
            : "";

        let content = `
          <head>
            <title>Exported Results</title>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/css/bootstrap.min.css">
            <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
            <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/js/bootstrap.min.js"></script>
          </head>
          <body>

            <div class="container">
              <h3 class="text-center">${title}${additionalTitle}</h3>
              <table class="table table-condensed table-bordered">
                <thead>
                  <tr>
                    <th>No</th>
                    ${me.role === ROLES.ADMIN ? "<th>User</th>" : ""}
                    <th>Date</th>
                    <th>Total time</th>
                    <th>Notes</th>
                  </tr>
                </thead>
                <tbody>
            `;
        const bodyContents = records
          .map((record, index) => {
            const note = record.note.map(note => `<p>${note}</p>`).join("");
            const renderUserCol =
              me.role === ROLES.ADMIN
                ? `<td>${_.get(record, "user.0.firstName", "") +
                    " " +
                    _.get(record, "user.0.lastName", "")}</td>`
                : "";

            return `<tr class="${
              record.hour >= _.get(record, "user.0.preferredWorkingHours", 0)
                ? "success"
                : "danger"
            }">
                    <td>${index + 1}</td>
                    ${renderUserCol}
                    <td>${moment(record._id.date).format(DATE_FORMAT)}</td>
                    <td>${record.hour} hours</td>
                    <td>${note}</td>
                  </tr>`;
          })
          .join("");

        content = content.concat(bodyContents, [
          ` </tbody>
            </table>
          </div>
        </body>`
        ]);

        const blob = new Blob([content], { type: "text/html" });
        download(blob, "Records_export.html", "text/html");
      }
    });
  };

  const handleClick = item => {
    const enhancedUsers = _.map(selectedUsers, "_id").includes(item["_id"])
      ? _.filter(selectedUsers, user => user["_id"] !== item["_id"])
      : [...selectedUsers, item];
    setSelectedUsers(enhancedUsers);
    setParams({
      page: 1,
      user: _.map(enhancedUsers, "_id")
    });
  };

  const handleTagRemove = (item, index) => {
    const clonedUsers = Object.assign([], selectedUsers);
    clonedUsers.splice(index, 1);
    setSelectedUsers(clonedUsers);
    setParams({
      page: 1,
      user: _.map(clonedUsers, "_id")
    });
  };

  const handleClear = () => {
    setSelectedUsers([]);
    setParams({
      page: 1,
      user: []
    });
  };

  return (
    <div>
      <Header />
      <Card
        elevation={Elevation.FOUR}
        className={Classes.DARK}
        style={style.card}
      >
        <Breadcrumb icon="chevron-right" text="Records" disabled={true} />
        <br />
        {media === "mobile" && (
          <ButtonGroup>
            <DateRangeInput
              allowSingleDayRange={true}
              className="mt-2"
              maxDate={new Date()}
              value={[startDate, endDate]}
              endInputProps={{ style: { width: "100px" } }}
              startInputProps={{ style: { width: "100px" } }}
              shortcuts={false}
              closeOnSelection
              onChange={handleChangeDateRange}
              {...jsDateFormatter}
            />
            <Button
              icon="cross"
              className={classNames(
                Classes.DARK,
                "mr-3",
                "mt-2",
                Classes.MINIMAL
              )}
              onClick={removeRange}
              intent={Intent.DANGER}
            />
          </ButtonGroup>
        )}
        <div className={Classes.NAVBAR_GROUP} style={style.cardChild}>
          <AddRow />

          <ButtonGroup>
            {me.role === ROLES.ADMIN && (
              <MultiSelectUser
                users={users}
                selectedUsers={selectedUsers}
                handleClick={handleClick}
                handleClear={handleClear}
                handleTagRemove={handleTagRemove}
              />
            )}
            {media !== "mobile" && (
              <ButtonGroup>
                <DateRangeInput
                  allowSingleDayRange={true}
                  className="ml-3"
                  maxDate={new Date()}
                  value={[startDate, endDate]}
                  closeOnSelection
                  onChange={handleChangeDateRange}
                  {...jsDateFormatter}
                />
                <Button
                  icon="cross"
                  className={classNames(Classes.DARK, "mr-3", Classes.MINIMAL)}
                  onClick={removeRange}
                  intent={Intent.DANGER}
                />
              </ButtonGroup>
            )}
          </ButtonGroup>
          <div>
            <Tooltip
              content={!records.length ? "There's no record to export." : ""}
            >
              <Button
                icon="export"
                className={classNames(
                  Classes.DARK,
                  me.role < ROLES.ADMIN ? "mr-3" : "mr-0"
                )}
                onClick={handleExportRecords}
                disabled={!records.length}
              >
                {media !== "mobile" ? "Export records" : ""}
              </Button>
            </Tooltip>
            {me.role < ROLES.ADMIN && <PreferredWorkingHours media={media} />}
          </div>
        </div>
        {!!records.length && (
          <>
            <Table
              numRows={records.length}
              defaultRowHeight={38}
              columnWidths={
                me.role < ROLES.ADMIN
                  ? [50, 0, 200, 950, 150, 210]
                  : [50, 200, 200, 750, 150, 210]
              }
              renderMode={RenderMode.NONE}
              truncated={false}
              enableRowHeader={false}
              allowSelection={false}
              selectionModes={SelectionModes.NONE}
            >
              <Column
                className={Classes.LARGE}
                name="No"
                allowSelection={false}
                cellRenderer={row => (
                  <Cell allowSelection={false}>
                    {row + (params.page - 1) * params.limit + 1}
                  </Cell>
                )}
              />
              <Column
                className={Classes.LARGE}
                name="User"
                cellRenderer={row => (
                  <Cell
                    intent={
                      me.role === ROLES.ADMIN ? getColor(row) : Intent.NONE
                    }
                  >
                    {records[row].user.firstName +
                      " " +
                      records[row].user.lastName}
                  </Cell>
                )}
              />
              <Column
                className={classNames(Classes.LARGE, "pt-1", "pl-2")}
                name="Date"
                cellRenderer={row => (
                  <Cell intent={getColor(row)}>
                    <EnhancedMomentDate
                      withTime={false}
                      date={records[row].date}
                      row={row}
                      intent={getColor(row)}
                    />
                  </Cell>
                )}
              />
              <Column
                className={Classes.LARGE}
                name="Note"
                cellRenderer={row => (
                  <Cell intent={getColor(row)}>{records[row].note}</Cell>
                )}
              />
              <Column
                className={Classes.LARGE}
                name="Working Hours"
                cellRenderer={row => (
                  <Cell intent={getColor(row)}>{records[row].hour}</Cell>
                )}
              />
              <Column
                name="Actions"
                cellRenderer={row => (
                  <Cell intent={getColor(row)} style={style.cell}>
                    <ButtonGroup>
                      <EditRow selectedRow={records[row]} users={users} />
                      <DeleteRow selectedRow={records[row]} />
                    </ButtonGroup>
                  </Cell>
                )}
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
        {!records.length && count === 0 && (
          <div className="bp3-non-ideal-state bp3-hotkey-column">
            No records found
          </div>
        )}
      </Card>
    </div>
  );
};

Dashboard.propTypes = {
  setParams: PropTypes.func.isRequired,
  getRecords: PropTypes.func.isRequired,
  records: PropTypes.array.isRequired,
  count: PropTypes.number.isRequired,
  params: PropTypes.object.isRequired,
  generateRecords: PropTypes.func
};

const mapStateToProps = state => ({
  records: state.record.records,
  currentRecord: state.record.currentRecord,
  params: state.record.params,
  count: state.record.count,
  me: state.auth.me,
  userParams: state.user.params,
  users: state.user.users,
  userCount: state.user.count,
  media: state.general.media
});

const mapDispatchToProps = {
  setParams: setParams,
  getRecords: getRecords,
  getUsers: getUsers,
  generateRecords: generateRecords
};

export default compose(connect(mapStateToProps, mapDispatchToProps))(
  withToast(Dashboard)
);
