export const generateHours = () => {
  const hours = [];
  for (let i = 9; i <= 12; i++) {
    hours.push(`${i}:00 AM`);
  }
  for (let i = 1; i <= 5; i++) {
    if (i === 2) continue;
    hours.push(`${i}:00 PM`);
  }
  return hours;
};

export const calculateTotals = (hourlyData = []) => {
  const totalPieces = hourlyData.reduce(
    (sum, hour) => sum + (hour?.pieces || 0),
    0
  );
  const totalEfficiency = hourlyData.reduce(
    (sum, hour) => sum + (hour?.efficiency || 0),
    0
  );
  const avgEfficiency =
    hourlyData.length > 0
      ? (totalEfficiency / hourlyData.length).toFixed(2)
      : 0;
  return { totalPieces, avgEfficiency };
};

export const tableHeaders = [
  { label: "Article", key: "articleName" },
  { label: "SAM", key: "SAM" },
  { label: "Operator", key: "operator" },
  { label: "Helper", key: "helper" },
  { label: "Shift Time", key: "shiftTime" },
  { label: "Available Minutes", key: "availableMinutes" },
  { label: "Target 100%", key: "target100" },
  { label: "Target 75%", key: "target75" },
  { label: "Target / Hour", key: "targetPerHour" },
];
