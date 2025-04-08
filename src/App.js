import logo from "./assets/logo.svg";
import "./App.css";
import performanceData from "./data/performanceData";
import chartColors from "./utils/chartColors";
import getChartData from "./utils/getChartData";

import * as React from "react";
import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";
import { Line } from "react-chartjs-2";
import "chartjs-adapter-date-fns";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale
);

function App() {
  const [min] = React.useState(new Date(1708386677 * 1000).getTime());
  const [max] = React.useState(new Date(1708895707 * 1000).getTime());
  const [value, setValue] = React.useState([min, max]);
  const [selectedOptions, setSelectedOptions] = React.useState({
    test: "Select Test",
    system: "Select System",
    scale: "Select Scale",
  });
  const [filteredBranches, setFilteredBranches] = React.useState([]);
  const [selectedBranches, setSelectedBranches] = React.useState([]);
  function getDate(value) {
    return new Date(value).toDateString();
  }
  React.useEffect(() => {
    if (
      performanceData[selectedOptions.test] &&
      performanceData[selectedOptions.test][selectedOptions.system] &&
      performanceData[selectedOptions.test][selectedOptions.system][
        selectedOptions.scale
      ]
    ) {
      setFilteredBranches(
        performanceData[selectedOptions.test][selectedOptions.system][
          selectedOptions.scale
        ]
      );
    } else {
      setFilteredBranches([]);
    }
  }, [selectedOptions.test, selectedOptions.system, selectedOptions.scale]);
  const handleTimeChange = (event, newValue) => {
    setValue(newValue);
  };
  function handleSelection(type, value) {
    setSelectedOptions((prev) => ({ ...prev, [type]: value }));
  }
  function handleSelectBranches(branchData) {
    if (!selectedBranches.includes(branchData)) {
      setSelectedBranches((prev) => [...prev, branchData]);
    }
  }
  function handleDeselectBranches(branch) {
    if (selectedBranches.includes(branch)) {
      setSelectedBranches((prev) => prev.filter((item) => item !== branch));
    }
  }

  return (
    <div className="App">
      <nav className="Menu">
        <img src={logo} className="App-logo" alt="logo" />
        <div className="Dropdown">
          <button className="Drop-button">{selectedOptions.test}</button>
          <div className="Dropdown-content">
            <button
              className="Select-button"
              onClick={() => handleSelection("test", "DBT-2")}
            >
              DBT-2
            </button>
          </div>
        </div>
        <div className="Dropdown">
          <button className="Drop-button">{selectedOptions.system}</button>
          <div className="Dropdown-content">
            <button
              className="Select-button"
              onClick={() => handleSelection("system", "vanillaleaf")}
            >
              vanillaleaf
            </button>
          </div>
        </div>
        <div className="Dropdown">
          <button className="Drop-button">{selectedOptions.scale}</button>
          <div className="Dropdown-content">
            <button
              className="Select-button"
              onClick={() => handleSelection("scale", 100)}
            >
              100
            </button>
          </div>
        </div>
        <div className="Dropdown">
          <button className="Drop-button">Add Branch</button>
          <div className="Dropdown-content">
            {filteredBranches.map((branchData, index) => (
              <button
                key={index}
                className="Select-button"
                onClick={() => handleSelectBranches(branchData)}
              >
                {branchData.label}
              </button>
            ))}
          </div>
        </div>
        <Box
          sx={{
            width: "90%",
            padding: "0px",
            marginTop: "0px",
            display: "flex",
            flexDirection: "column",
            gap: "5px",
          }}
        >
          <p
            style={{ color: "#336791", marginBottom: "5px", marginTop: "0px" }}
          >
            Select Time Range
          </p>
          <Slider
            value={value}
            onChange={handleTimeChange}
            valueLabelDisplay="auto"
            valueLabelFormat={getDate}
            min={min}
            max={max}
            style={{
              padding: "0px",
              marginLeft: "5px",
              color: "#336791",
            }}
          />
        </Box>
        <Box>
          <p style={{ color: "#336791", marginBottom: "0px" }}>
            Selected Branches
          </p>
          <Box className="BranchDisplay">
            {selectedBranches.map((branchData, index) => (
              <button
                style={{ backgroundColor: chartColors[index % 20] }}
                key={index}
                className="Remove-button"
                onClick={() => handleDeselectBranches(branchData)}
              >
                {branchData.label} ✕
              </button>
            ))}
          </Box>
        </Box>
      </nav>
      <div className="Chart-container">
        <header
          style={{ marginTop: "20px", fontSize: "20px", color: "#336791" }}
        >
          PostgreSQL Performance Metrics
        </header>
        <Line
          data={{
            datasets: getChartData(selectedBranches),
          }}
          options={{
            parsing: false,
            scales: {
              x: {
                title: {
                  display: true,
                  text: "Date",
                },
                type: "time",
                time: {
                  unit: "day",
                },
                min: value[0],
                max: value[1],
              },
              y: {
                title: {
                  display: true,
                  text: "Metric",
                },
              },
            },
            plugins: {
              tooltip: {
                callbacks: {
                  label: (context) => {
                    const meta = context.raw.meta;
                    return [
                      `Metric: ${context.formattedValue}`,
                      `Revision: ${meta.revision}`,
                      `Complete at: ${new Date(meta.complete_at * 1000)}`,
                    ];
                  },
                },
              },
              legend: {
                display: true,
                position: "bottom",
              },
            },
          }}
        />
      </div>
    </div>
  );
}

export default App;
