import { Button } from "@mui/material";
import { useEffect, useState } from "react";
import { Dialog, DialogActions, DialogContent } from "@mui/material";
import { AccountApiClient } from "../../../api";
import { AccountGetRecordResponseResponse } from "../../../api/type";
import { CheckboxGroup } from "../../atoms";

interface ConfirmDeleteRecordWindowProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  selectedRecord: AccountGetRecordResponseResponse | undefined;
  handleClose: () => void;
}

export const ConfirmDeleteRecordWindow = ({
  open,
  setOpen,
  selectedRecord,
  handleClose,
}: ConfirmDeleteRecordWindowProps) => {
  const [isRepeatCanceled, setIsRepeatCanceled] = useState<boolean>(false);

  const options: { id: number; name: string }[] = [
    { id: 1, name: "繰り返しも中止する" },
    { id: 2, name: "繰り返しは継続する" },
  ];
  const initialState = options.reduce((result, current) => {
    result[current.id] = current.id === 1 ? true : false;
    return result;
  }, {} as Record<string, boolean>);
  const [checkboxes, setCheckboxes] =
    useState<Record<string, boolean>>(initialState);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const updatedCheckboxes = options.reduce((result, current) => {
      result[current.id] =
        event.target.name === String(current.id)
          ? event.target.checked
          : !event.target.checked;
      return result;
    }, {} as Record<string, boolean>);
    setCheckboxes(updatedCheckboxes);
  };
  const handleConfirmClose = () => {
    setOpen(false);
    handleClose();
  };
  const handleDeleteRecord = () => {
    console.log(checkboxes);
    if (checkboxes[1]) {
      AccountApiClient.accountDeleteRegularDeletedIdIsRepeatationDeletedDelete(
        String(selectedRecord?.id),
        true
      );
    } else {
      AccountApiClient.accountDeleteDeletedIdDelete(String(selectedRecord?.id));
    }
    setOpen(false);
    handleClose();
  };

  return (
    <div>
      {open && (
        <Dialog open={open} onClose={handleConfirmClose}>
          <DialogContent>
            <CheckboxGroup
              checkboxesState={checkboxes}
              onChange={handleChange}
              options={options}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleConfirmClose}>Cancel</Button>
            <Button onClick={handleDeleteRecord}>Delete</Button>
          </DialogActions>
        </Dialog>
      )}
    </div>
  );
};
