import React, { useState, useEffect } from "react";
import {
  TextField,
  MenuItem,
  Select,
  InputAdornment,
  FormControl,
  InputLabel,
  Box,
  styled,
} from "@mui/material";
import { FiUser, FiSearch } from "react-icons/fi";
import { debounce } from "lodash";

interface SelectOption {
  value: string | number;
  label: string;
}

interface SelectProps {
  label: string;
  name: string;
  options: SelectOption[];
  register?: any;
  withSearch?: boolean;
  withIcon?: boolean;
  defaultValue?: string | number;
  onSearch?: (searchTerm: string) => void;
}

const SearchTextField = styled(TextField)({
  "& .MuiOutlinedInput-root": {
    borderRadius: "8px",
    "&:hover fieldset": {
      borderColor: "#1976d2",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#1976d2",
      borderWidth: 1,
    },
  },
});

const CustomSelect: React.FC<SelectProps> = ({
  label,
  name,
  options,
  register,
  withSearch = false,
  withIcon = false,
  defaultValue = "",
  onSearch,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [open, setOpen] = useState(false);

  const debouncedSearchLog = debounce((term: string) => {
    if (onSearch) onSearch(term);
  }, 500);

  useEffect(() => {
    debouncedSearchLog(searchTerm);
    return () => debouncedSearchLog.cancel();
  }, [searchTerm]);

  useEffect(() => {
    if (!open) {
      setSearchTerm("");
    }
  }, [open]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  return (
    <Box sx={{ width: "100%", mb: 2 }}>
      <InputLabel
        htmlFor={`${name}-select`}
        shrink
        sx={{
          fontSize: "14px",
          fontWeight: 600,
          color: "#333",
          mb: "4px",
          transform: "none",
          position: "relative",
        }}
      >
        {label}
      </InputLabel>
      <FormControl fullWidth>
        <Select
          id={`${name}-select`}
          labelId={`${name}-label`}
          {...(register ? register(name) : {})}
          defaultValue={defaultValue}
          open={open}
          onOpen={() => setOpen(true)}
          onClose={() => setOpen(false)}
          sx={{
            backgroundColor: "#fff",
            borderRadius: "8px",
            "& .MuiSelect-select": {
              display: "flex",
              alignItems: "center",
              padding: "12px 14px",
              pl: withIcon ? 4 : 2,
            },
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: "rgba(0, 0, 0, 0.23)",
            },
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: "rgba(0, 0, 0, 0.87)",
            },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: "#1976d2",
              borderWidth: 1,
            },
          }}
          MenuProps={{
            PaperProps: {
              sx: {
                mt: 1,
                maxHeight: 300,
                minWidth: 250,
                boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.15)",
                borderRadius: "8px",
                border: "1px solid #e0e0e0",
              },
            },
            MenuListProps: {
              sx: {
                paddingTop: withSearch ? 0 : undefined,
              },
            },
          }}
        >
          {withSearch && (
            <Box
              sx={{
                px: 2,
                py: 1.5,
                position: "sticky",
                top: 0,
                backgroundColor: "#fff",
                zIndex: 1,
                borderBottom: "1px solid #e0e0e0",
              }}
            >
              <SearchTextField
                fullWidth
                variant="outlined"
                placeholder="Search..."
                value={searchTerm}
                onChange={handleSearchChange}
                autoFocus
                size="small"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <FiSearch size={18} color="#666" />
                    </InputAdornment>
                  ),
                }}
                onClick={(e) => e.stopPropagation()}
              />
            </Box>
          )}

          {withIcon && !withSearch && (
            <InputAdornment
              position="start"
              sx={{ position: "absolute", ml: 1.5 }}
            >
              <FiUser size={18} color="#666" />
            </InputAdornment>
          )}

          {options.length > 0 ? (
            options.map((option) => (
              <MenuItem
                key={option.value}
                value={option.value}
                sx={{
                  padding: "10px 16px",
                  "&.Mui-selected": {
                    backgroundColor: "rgba(25, 118, 210, 0.08)",
                  },
                  "&.Mui-selected:hover": {
                    backgroundColor: "rgba(25, 118, 210, 0.12)",
                  },
                  "&:hover": {
                    backgroundColor: "rgba(0, 0, 0, 0.04)",
                  },
                }}
              >
                {option.label}
              </MenuItem>
            ))
          ) : (
            <MenuItem
              disabled
              sx={{ padding: "10px 16px", color: "text.disabled" }}
            >
              No user found
            </MenuItem>
          )}
        </Select>
      </FormControl>
    </Box>
  );
};

export default CustomSelect;
