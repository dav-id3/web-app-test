import LibraryAddIcon from "@mui/icons-material/LibraryAdd";
import { Box } from "@mui/system";
import { IconButton } from "@mui/material";

const styles = {
  buttonContainer: {
    position: "fixed",
    bottom: "20px",
    right: "20px",
    zIndex: 1000,
  },
};

interface FixedButtonProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const FixedButton = ({ open, setOpen }: FixedButtonProps) => {
  const handleClickOpen = () => setOpen(true);

  return (
    <div>
      <Box sx={styles.buttonContainer}>
        <IconButton color="primary" onClick={handleClickOpen}>
          <LibraryAddIcon fontSize="large" />
        </IconButton>
      </Box>
    </div>
  );
};
