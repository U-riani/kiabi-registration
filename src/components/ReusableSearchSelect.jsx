import { useState, useRef, useEffect } from "react";

const ReusableSearchSelect = ({
  options = [],
  value = "",
  onChange,
  forElement,
}) => {
  const dropdownRef = useRef(null);
  const [query, setQuery] = useState(value || "");
  const [open, setOpen] = useState(false);

  // Sync value from outside (important for reset)
  useEffect(() => {
    setQuery(value || "");
  }, [value]);

  // Filter logic
  const filtered =
    query.trim() === ""
      ? options
      : options.filter((item) =>
          item.label.toLowerCase().includes(query.toLowerCase())
        );

  // Select item
  const handleSelect = (item) => {
    setQuery(item.label);
    onChange(item.id); // return ID
    setOpen(false);
  };

  // On typing
  const handleInputChange = (val) => {
    setQuery(val);
    setOpen(true);

    // 🔥 IMPORTANT: clear selection when input is cleared
    if (val.trim() === "") {
      onChange(null);
    }
  };

  // Close dropdown on outside click
  useEffect(() => {
    const closeDropdown = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", closeDropdown);
    return () => document.removeEventListener("mousedown", closeDropdown);
  }, []);

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <div>
        <input
          id={forElement}
          name={forElement}
          type="text"
          autoComplete="new-password"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck={false}
          className="border px-3 py-2 rounded border-gray-400 w-full cursor-pointer "
          placeholder="Select..."
          value={query}
          onChange={(e) => handleInputChange(e.target.value)}
          onClick={() => setOpen(true)}
          onBlur={() => {
            const match = options.find(
              (o) => o.label.toLowerCase() === query.toLowerCase()
            );

            if (!match) {
              setQuery("");
              onChange(null);
            }
          }}
        />
      </div>
      {open && (
        <div className="absolute top-full left-0 right-0 bg-white border rounded shadow-lg max-h-60 overflow-y-auto z-50">
          {filtered.length === 0 ? (
            <p className="p-2 text-gray-500 text-sm">No matches...</p>
          ) : (
            filtered.map((item) => (
              <div
                key={item.id}
                onClick={() => handleSelect(item)}
                className="p-2 cursor-pointer hover:bg-blue-100 flex flex-row items-center"
              >
                {item.flag && (
                  <img
                    className=" mr-2 object-contain shadow-xs border border-slate-300"
                    src={`https://flagcdn.com/w20/${item.flag.toLocaleLowerCase()}.png`}
                  />
                )}
                {item.label}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default ReusableSearchSelect;
