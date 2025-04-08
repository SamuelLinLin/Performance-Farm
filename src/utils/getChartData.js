import chartColors from "./chartColors";

function getChartData(selectedBranches) {
  if (selectedBranches.length === 0) {
    return [
      {
        label: "No data",
        data: [],
      },
    ];
  }
  return selectedBranches.map((branchData, index) => {
    const dataPoints = branchData.data.map((entry) => ({
      x: new Date(entry.ctime * 1000),
      y: entry.metric,
      meta: {
        revision: entry.revision,
        complete_at: entry.complete_at,
      },
    }));
    return {
      label: branchData.label,
      data: dataPoints,
      borderColor: chartColors[index % 20],
      backgroundColor: chartColors[index % 20] + "40",
      borderWidth: 2,
      pointRadius: 4,
      pointHoverRadius: 6,
      fill: false,
      tension: 0,
    };
  });
}

export default getChartData;
