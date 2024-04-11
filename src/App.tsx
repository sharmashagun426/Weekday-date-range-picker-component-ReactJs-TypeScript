import React from 'react';
import WeekdayDatePicker from './Component/DateTime';

interface WeekdayDatePickerProps {
  onChange?: (dateRange: [Date, Date], weekendDates: Date[]) => void;
  predefinedRanges?: { label: string; days: number }[];
}

const App: React.FC = () => {
  const handleDateRangeChange = (dateRange: [Date, Date], weekendDates: Date[]) => {
    console.log('Selected Date Range:', dateRange);
    console.log('Weekend Dates within Range:', weekendDates);
  };

  const predefinedRanges = [
    { label: 'Last 7 Days', days: 7 },
    { label: 'Last 30 Days', days: 30 },
  ];

  return (
    <div className="App">
      <WeekdayDatePicker onChange={handleDateRangeChange} predefinedRanges={predefinedRanges} />
    </div>
  );
};

export default App;
