import React from "react";
import Select from "react-select";
import type { StylesConfig } from "react-select";

type Option = { value: string; label: string };

interface DropdownControlProps {
  value: string | null;
  onChange: (value: string | null) => void;
  options: string[];
  placeholder?: string;
  className?: string;
  isSearchable?: boolean;
}

const DropdownControl: React.FC<DropdownControlProps> = ({
  value,
  onChange,
  options,
  placeholder = "Select...",
  className = "",
  isSearchable = true,
}) => {
  const formattedOptions: Option[] = options.map((opt) => ({
    value: opt,
    label: opt,
  }));

  const customStyles: StylesConfig<Option, false> = {
    control: (base, state) => ({
      ...base,
      backgroundColor: "rgba(17,24,39,0.7)", // bg-gray-900/70
      border: state.isFocused
        ? "1px solid #4B5563" // gray-700 when focused
        : "1px solid #1F2937", // border-gray-800
      borderRadius: "0.75rem", // rounded-xl
      boxShadow: "none",
      cursor: "pointer",
      minHeight: 42,
      "&:hover": {
        borderColor: "#374151", // gray-700 on hover
      },
    }),
    menu: (base) => ({
      ...base,
      backgroundColor: "rgba(17,24,39,0.7)", // bg-gray-900/70
      border: "1px solid #1F2937", // border-gray-800
      borderRadius: "0.75rem", // rounded-xl
      marginTop: 6,
      zIndex: 60,
      overflow: "hidden",
    }),
    menuList: (base) => ({
      ...base,
      maxHeight: 200,
      paddingRight: 4,
      scrollbarWidth: "thin", // Firefox
      scrollbarColor: "#6b7280 transparent", // Firefox
      "&::-webkit-scrollbar": {
        width: "6px",
        height: "6px",
      },
      "&::-webkit-scrollbar-thumb": {
        backgroundColor: "#4b5563", // gray-600
        borderRadius: "4px",
      },
      "&::-webkit-scrollbar-track": {
        background: "transparent",
      },
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isSelected
        ? "#2563eb" // blue-600
        : state.isFocused
        ? "rgba(59,130,246,0.12)" // blue-500/12
        : "transparent",
      color: state.isSelected ? "#fff" : "#d1d5db", // gray-300 text
      cursor: "pointer",
      padding: "10px 12px",
      fontSize: "0.95rem",
    }),
    singleValue: (base) => ({
      ...base,
      color: "#e5e7eb", // gray-200
    }),
    placeholder: (base) => ({
      ...base,
      color: "#6b7280", // gray-500
    }),
    input: (base) => ({
      ...base,
      color: "#e5e7eb",
    }),
    dropdownIndicator: (base) => ({
      ...base,
      color: "#9ca3af", // gray-400
      padding: 6,
    }),
    indicatorSeparator: () => ({
      display: "none",
    }),
    clearIndicator: (base) => ({
      ...base,
      color: "#9ca3af",
      padding: 6,
    }),
  };

  return (
    <div className={className}>
      <Select<Option, false>
        value={value ? { value, label: value } : null}
        onChange={(opt) => onChange(opt ? opt.value : null)}
        options={formattedOptions}
        placeholder={placeholder}
        styles={customStyles}
        isClearable
        isSearchable={isSearchable}
        menuPlacement="auto"
      />
    </div>
  );
};

export default DropdownControl;
