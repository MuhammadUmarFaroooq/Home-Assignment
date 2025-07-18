import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import { CircularProgress } from "@mui/material";

function ReusableModal({
  show,
  onHide,
  onConfirm,
  icon,
  title,
  description,
  isLoading,
}) {
  return (
    <Dialog
      open={show}
      onClose={onHide}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        style: {
          borderRadius: "12px",
        },
      }}
      sx={{
        zIndex: 20000,
        "& .MuiDialog-paper": {
          margin: "16px",
          width: "100%",
          maxWidth: "400px",
        },
      }}
    >
      <DialogContent className="p-6">
        <div className="flex flex-col justify-center items-center">
          <div className="flex justify-center items-center rounded-full bg-gray-100 p-1">
            <img src={icon} alt="modal icon" className="w-18 h-18" />
          </div>
          <h4 className="text-center mt-3 font-bold text-lg">{title}</h4>
          <p className="text-center text-gray-600 mt-1">{description}</p>
        </div>
        <div className="flex gap-3 mt-6">
          <button
            disabled={isLoading}
            className="w-full py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
            onClick={onHide}
          >
            Cancel
          </button>
          <button
            className={`w-full py-2 cursor-pointer rounded-lg text-white transition-colors ${
              isLoading ? "bg-red-400" : "bg-red-600 hover:bg-red-700"
            }`}
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex justify-center">
                <CircularProgress size={20} color="inherit" />
              </div>
            ) : (
              "Confirm"
            )}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default ReusableModal;
