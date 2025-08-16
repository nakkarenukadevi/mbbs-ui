import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Form = () => {
  const [score, setScore] = useState(565);
  const [gender, setGender] = useState(["Male"]);
  const [category, setCategory] = useState("OC");
  const [area, setArea] = useState(["SVU"]);
  const [muslimMinority, setMuslimMinority] = useState("No");
  const [angloIndian, setAngloIndian] = useState("No");
  const [pmc, setPmc] = useState("No");
  const [ews, setEws] = useState("No");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const validateScore = (value) => {
    const num = Number(value);
    if (!value || isNaN(num) || num < 100 || num > 720) {
      setError("Score must be between 100 and 720");
      return false;
    } else {
      setError("");
      return true;
    }
  };

  const handleScoreChange = (e) => {
    setScore(e.target.value);
  };

  const handleScoreBlur = (e) => {
    validateScore(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const isValid = validateScore(score);
    if (isValid) {
      // Pass form data to FilteredDataTable via navigation state
      const formData = {
        score,
        gender,
        category,
        area,
        muslimMinority,
        angloIndian,
        pmc,
        ews,
      };
      navigate("/filteredData", { state: { formData } });
    }
  };

  // Custom multi-select handlers using checkboxes
  const genderOptions = ["Male", "Female"];
  const areaOptions = ["SVU", "AU", "APNL"];

  // Custom multi-select dropdown component (shared for Gender and Area)
  const MultiSelectDropdown = ({ options, selected, setSelected, label }) => {
    const [open, setOpen] = React.useState(false);
    const toggleOption = (option) => {
      setSelected((prev) =>
        prev.includes(option)
          ? prev.filter((v) => v !== option)
          : [...prev, option]
      );
    };
    // Close dropdown if clicked outside
    const ref = React.useRef();
    React.useEffect(() => {
      const handleClick = (e) => {
        if (ref.current && !ref.current.contains(e.target)) setOpen(false);
      };
      if (open) document.addEventListener("mousedown", handleClick);
      return () => document.removeEventListener("mousedown", handleClick);
    }, [open]);
    return (
      <div className="relative" ref={ref}>
        <label className="block font-medium mb-1">{label}:</label>
        <div
          className="w-full border rounded px-3 py-2 bg-green-900 cursor-pointer min-h-[42px] flex flex-wrap gap-2 items-center"
          onClick={() => setOpen((o) => !o)}
        >
          {selected.length === 0 ? (
            <span className="text-gray-400">
              Select {label.toLowerCase()}...
            </span>
          ) : (
            selected.map((item) => (
              <span
                key={item}
                className="bg-green-200 text-green-900 px-2 py-1 rounded text-xs flex items-center gap-1"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleOption(item);
                }}
              >
                {item}
                <svg
                  className="w-3 h-3 ml-1 cursor-pointer"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </span>
            ))
          )}
          <span className="ml-auto text-gray-400">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </span>
        </div>
        {open && (
          <div className="absolute z-10 mt-1 w-full bg-white border rounded shadow max-h-40 overflow-auto">
            {options.map((option) => (
              <div
                key={option}
                className={`px-4 py-2 cursor-pointer hover:bg-green-200 flex items-center gap-2 ${
                  selected.includes(option) ? "bg-green-100" : ""
                }`}
                onMouseDown={(e) => {
                  e.preventDefault();
                  toggleOption(option);
                }}
              >
                <input
                  type="checkbox"
                  checked={selected.includes(option)}
                  readOnly
                  className="accent-green-900 rounded"
                />
                <span>{option}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const handleGenderChange = (option) => {
    setGender((prev) =>
      prev.includes(option)
        ? prev.filter((g) => g !== option)
        : [...prev, option]
    );
  };
  const handleAreaChange = (option) => {
    setArea((prev) =>
      prev.includes(option)
        ? prev.filter((a) => a !== option)
        : [...prev, option]
    );
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-white overflow-auto px-2">
      <form
        onSubmit={handleSubmit}
        className="max-w-2xl w-full bg-white rounded-lg shadow p-8 mx-auto"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block font-medium mb-1">Score:</label>
            <input
              type="number"
              value={score}
              onChange={handleScoreChange}
              onBlur={handleScoreBlur}
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            {error && (
              <span className="text-red-600 text-sm mt-1 block">{error}</span>
            )}
          </div>
          <div>
            <MultiSelectDropdown
              options={genderOptions}
              selected={gender}
              setSelected={setGender}
              label="Gender"
            />
          </div>
          <div>
            <label className="block font-medium mb-1">Category:</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="BC-A">BC-A</option>
              <option value="BC-B">BC-B</option>
              <option value="BC-C">BC-C</option>
              <option value="BC-D">BC-D</option>
              <option value="BC-E">BC-E</option>
              <option value="OC">OC</option>
              <option value="SC G-I">SC G-I</option>
              <option value="SC G-III">SC G-II</option>
              <option value="SC G-III">SC G-III</option>
              <option value="ST">ST</option>
            </select>
          </div>
          <div>
            <MultiSelectDropdown
              options={areaOptions}
              selected={area}
              setSelected={setArea}
              label="Area"
            />
          </div>
          <div>
            <label className="block font-medium mb-1">Muslim Minority:</label>
            <select
              value={muslimMinority}
              onChange={(e) => setMuslimMinority(e.target.value)}
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
          </div>
          <div>
            <label className="block font-medium mb-1">Anglo Indian:</label>
            <select
              value={angloIndian}
              onChange={(e) => setAngloIndian(e.target.value)}
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
          </div>
          <div>
            <label className="block font-medium mb-1">PMC:</label>
            <select
              value={pmc}
              onChange={(e) => setPmc(e.target.value)}
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
          </div>
          <div>
            <label className="block font-medium mb-1">EWS:</label>
            <select
              value={ews}
              onChange={(e) => setEws(e.target.value)}
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
          </div>
        </div>
        <button type="submit" className="bg-green-900 text-black w-full mt-5">
          Submit
        </button>
      </form>
    </div>
  );
};
export default Form;
