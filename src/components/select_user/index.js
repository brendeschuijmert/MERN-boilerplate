import React from "react";
import { Select } from "@blueprintjs/select";
import { Button, MenuItem } from "@blueprintjs/core";

const SelectUser = ({ ...props }) => {
  const { users, userIndex, handleClick } = props;
  const selectedUser = users[userIndex] || {};

  return (
    <>
      {!!users.length && (
        <Select
          activeItem={selectedUser}
          filterable={false}
          items={users}
          itemRenderer={(item, { handleClick, modifiers, query }) => {
            if (!modifiers.matchesPredicate) {
              return null;
            }
            return (
              <MenuItem
                active={modifiers.active}
                tagName="button"
                label={item.firstName + " " + item.lastName}
                onClick={handleClick}
                key={item.id}
              />
            );
          }}
          onItemSelect={handleClick}
        >
          <Button
            text={`${selectedUser.firstName} ${selectedUser.lastName} (${selectedUser.email})`}
            rightIcon="double-caret-vertical"
          />
        </Select>
      )}
    </>
  );
};

export default SelectUser;
