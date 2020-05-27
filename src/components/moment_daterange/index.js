import React from "react";
import { Icon, Tag, Classes } from "@blueprintjs/core";
import classNames from "classnames";
import moment from "moment";

const FORMAT = "dddd, LL";
const FORMAT_TIME = "dddd, LL LT";

const MomentDate = ({
  date,
  withTime = false,
  format = withTime ? FORMAT_TIME : FORMAT,
  intent = null
}) => {
  const m = moment(date);

  if (m.isValid()) {
    return (
      <Tag
        className={classNames(
          Classes.LARGE,
          Classes.DARK,
          !intent ? Classes.MINIMAL : ""
        )}
        intent={intent}
      >
        {m.format(format)}
      </Tag>
    );
  } else {
    return (
      <Tag className={classNames(Classes.LARGE, Classes.MINIMAL)}>no date</Tag>
    );
  }
};

export const EnhancedMomentDate = MomentDate;

export const MomentDateRange = ({
  className,
  range: [start, end],
  withTime = false,
  format = withTime ? FORMAT_TIME : FORMAT
}) => (
  <div className={classNames("docs-date-range", className)}>
    <EnhancedMomentDate withTime={withTime} date={start} format={format} />
    <Icon className="mx-1 mt-1" icon="arrow-right" />
    <EnhancedMomentDate withTime={withTime} date={end} format={format} />
  </div>
);
