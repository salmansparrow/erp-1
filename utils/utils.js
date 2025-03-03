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
  return { totalPieces };
};

export const calculateShiftMinutes = (shiftTime, operator, helper) => {
  return shiftTime * (operator + helper);
};

export const calculateTotalAvailableMinutes = (shiftMinutes, otMinutes) => {
  return shiftMinutes + otMinutes;
};

export const calculateEarnedMinutes = (SAM, totalLinePieces, otPieces) => {
  return SAM * (totalLinePieces + otPieces);
};

// Calculate OT Efficiency
export const calculateOTEfficiency = (otMinutes, totalAM) => {
  return totalAM > 0 ? Math.round((otMinutes / totalAM) * 100) : 0;
};

// Calculate Grand Efficiency
export const calculateGrandEfficiency = (
  earnedMinutes,
  totalAvailableMinutes
) => {
  return totalAvailableMinutes > 0
    ? (earnedMinutes / totalAvailableMinutes) * 100
    : 0;
};

export const calculateHourlyTotalPieces = (lines) => {
  const hourlyTotals = {};

  lines.forEach((line) => {
    line.hourlyData.forEach((hour, index) => {
      const hourKey = `hour_${index + 1}`; // hour_1, hour_2, hour_3...

      if (!hourlyTotals[hourKey]) {
        hourlyTotals[hourKey] = 0;
      }

      hourlyTotals[hourKey] += hour.pieces || 0; // Pieces ko total karna
    });
  });

  return hourlyTotals;
};

export const tableHeaders = [
  { label: "Article", key: "articleName" },
  { label: "SAM", key: "SAM" },
  { label: "Operator", key: "operator" },
  { label: "Helper", key: "helper" },
  { label: "Shift Time", key: "shiftTime" },
  { label: "Available Minutes", key: "availableMinutes" },
  { label: "Target 100%", key: "target100" },
  { label: "Target Efficiency%", key: "targetEfficiency" },
  { label: "Target", key: "target" }, // Changed from "target" to "target75"
  { label: "Target / Hour", key: "targetPerHour" },
  { label: "O.T Pieces", key: "otPieces" },
  { label: "O.T Hours", key: "otHours" },
  { label: "O.T MenPower", key: "otMenPower" },
  { label: "O.T Minutes", key: "otMinutes" },
  { label: "OT Efficiency", key: "otEfficiency" }, // ✅ New Key Added
  { label: "Shift Minutes", key: "shiftMinutes" },
  { label: "Total Available Minutes", key: "totalAvailableMinutes" },
  { label: "Earned Minutes", key: "earnedMinutes" },
];
