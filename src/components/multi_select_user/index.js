import React from "react";
import { MultiSelect } from "@blueprintjs/select";
import { Button, MenuItem } from "@blueprintjs/core";
import { map } from "lodash-es";

const MultiSelectUser = ({ ...props }) => {
  const {
    users,
    selectedUsers,
    handleClick,
    handleClear,
    handleTagRemove
  } = props;

  const clearButton =
    selectedUsers.length > 0 ? (
      <Button icon="cross" minimal={true} onClick={handleClear} />
    ) : (
      undefined
    );

  return (
    <>
      {!!users.length && (
        <MultiSelect
          filterable={false}
          items={users}
          itemRenderer={(item, { handleClick, modifiers, query }) => {
            if (!modifiers.matchesPredicate) {
              return null;
            }
            return (
              <MenuItem
                active={modifiers.active}
                icon={
                  map(selectedUsers, "_id").includes(item["_id"])
                    ? "tick"
                    : "blank"
                }
                tagName="button"
                label={item.firstName + " " + item.lastName}
                onClick={handleClick}
                key={item.id}
                shouldDismissPopover={false}
              />
            );
          }}
          placeholder="By Users"
          tagRenderer={item => `${item.firstName} ${item.lastName}`}
          tagInputProps={{
            onRemove: handleTagRemove,
            rightElement: clearButton
          }}
          onItemSelect={handleClick}
          selectedItems={selectedUsers}
        >
          <Button rightIcon="double-caret-vertical" />
        </MultiSelect>
      )}
    </>
  );
};

export default MultiSelectUser;
