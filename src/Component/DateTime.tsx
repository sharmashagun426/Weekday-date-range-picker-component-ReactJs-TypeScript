import React, { useState } from 'react';
import './WeekdayDatePicker.css';

interface WeekdayDatePickerProps {
  onChange: (dateRange: [Date, Date], weekendDates: Date[]) => void;
  predefinedRanges?: { label: string; days: number }[];
}

const WeekdayDatePicker: React.FC<WeekdayDatePickerProps> = ({ onChange, predefinedRanges = [] }) => {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [displayedMonth, setDisplayedMonth] = useState<number>(new Date().getMonth());
  const [displayedYear, setDisplayedYear] = useState<number>(new Date().getFullYear());

  const handleDateClick = (date: Date) => {
    if (!startDate || endDate) {
      setStartDate(date);
      setEndDate(null);
    } else if (date >= startDate) {
      setEndDate(date);
    } else {
      setEndDate(startDate);
      setStartDate(date);
    }
  };

  const handleMonthChange = (increment: number) => {
    const newMonth = displayedMonth + increment;
    if (newMonth < 0) {
      setDisplayedYear(displayedYear - 1);
      setDisplayedMonth(11); // December
    } else if (newMonth > 11) {
      setDisplayedYear(displayedYear + 1);
      setDisplayedMonth(0); // January
    } else {
      setDisplayedMonth(newMonth);
    }
  };

  const handleYearChange = (increment: number) => {
    setDisplayedYear(displayedYear + increment);
  };

  const daysInMonth = new Date(displayedYear, displayedMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(displayedYear, displayedMonth, 1).getDay();

  const isWeekend = (date: Date): boolean => {
    const dayOfWeek = date.getDay();
    return dayOfWeek === 0 || dayOfWeek === 6;
  };

  const isDateInRange = (date: Date): boolean => {
    if (!startDate || !endDate) return false;
    return date >= startDate && date <= endDate;
  };

  const getWeekendDatesInRange = (): Date[] => {
    const weekendDates: Date[] = [];
    if (!startDate || !endDate) return weekendDates;
    let currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      if (isWeekend(currentDate)) {
        weekendDates.push(new Date(currentDate));
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }
    return weekendDates;
  };

  const handleRangeChange = () => {
    if (startDate && endDate) {
      onChange([startDate, endDate], getWeekendDatesInRange());
    }
  };

  const handlePredefinedRangeChange = (days: number) => {
    const today = new Date();
    const end = new Date(today.getTime() - (today.getTimezoneOffset() * 60000));
    const start = new Date(end);
    start.setDate(start.getDate() - days);
    setStartDate(start);
    setEndDate(end);
    handleRangeChange();
  };

  return (
    <div className="weekday-date-picker">
      <div className="header">
        <button onClick={() => handleMonthChange(-1)}>&lt;</button>
        <span>{new Date(displayedYear, displayedMonth).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
        <button onClick={() => handleMonthChange(1)}>&gt;</button>
        <button onClick={() => handleYearChange(-1)}>&lt;&lt;</button>
        <span>{displayedYear}</span>
        <button onClick={() => handleYearChange(1)}>&gt;&gt;</button>
      </div>
      <div className="days">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <span key={day}>{day}</span>
        ))}
        {[...Array(firstDayOfMonth)].map((_, index) => (
          <span key={`empty-${index}`} className="empty"></span>
        ))}
        {[...Array(daysInMonth)].map((_, index) => {
          const date = new Date(displayedYear, displayedMonth, index + 1);
          const isFirstDate = startDate && date.getTime() === startDate.getTime();
          return (
            <span
              key={index}
              className={`date ${isWeekend(date) ? 'weekend' : ''} ${isDateInRange(date) || isFirstDate ? 'selected' : ''}`}
              onClick={() => !isWeekend(date) && handleDateClick(date)}
            >
              {index + 1}
            </span>
          );
        })}
      </div>
      {startDate && endDate && (
        <div className="selected-dates">
          <h3>Selected Date Range:</h3>
          <p>{startDate.toLocaleDateString()} to {endDate.toLocaleDateString()}</p>
        </div>
      )}
      <div className="predefined-ranges">
        {predefinedRanges.map((range, index) => (
          <button key={index} onClick={() => handlePredefinedRangeChange(range.days)}>
            {range.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default WeekdayDatePicker;
