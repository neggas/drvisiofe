"use client";

import DatePicker, { registerLocale } from "react-datepicker";
import { fr } from "date-fns/locale/fr"; // the locale you want
registerLocale("fr", fr); // register it with the name you want
import "react-datepicker/dist/react-datepicker.css";
import DynamicHtmlTag from "../dynamic-tag/dynamic-tag";
import CustomButton from "../button/button";
import CustomSelect from "../select/select"; // Import CustomSelect

interface CustomDatePickerProps {
  onChange?: any;
  selected?: any;
  todayButton?: string;
  showTimeSelect?: boolean;
  onFocus?: any;
  dateFormat?: string;
  placeholderText?: string;
  className?: string;
  minDate?: Date;
  maxDate?: Date;
  disabled?: boolean; // Add the disabled prop
  inline?: any;
}

export const CustomDatePicker = (props: CustomDatePickerProps) => {
  const { onChange, selected, todayButton, showTimeSelect, onFocus, className, dateFormat, disabled, placeholderText, minDate, maxDate, ...rest } =
    props;
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear(); // Get the current year
  return (
    <DatePicker
      inline
      fixedHeight
      selected={selected}
      onChange={onChange}
      placeholderText={placeholderText}
      timeCaption="Temps"
      dateFormat={dateFormat ?? "dd/MM/yyyy HH:mm"}
      timeFormat="HH:mm"
      locale="fr"
      timeIntervals={15}
      todayButton={todayButton}
      minDate={minDate}
      maxDate={maxDate}
      showTimeSelect={showTimeSelect}
      onFocus={(e: { target: { blur: () => any } }) => e.target.blur()}
      disabledKeyboardNavigation
      className={className}
      disabled={disabled} // Pass the disabled prop here
      renderCustomHeader={({ date, changeYear, changeMonth, decreaseMonth, increaseMonth, prevMonthButtonDisabled, nextMonthButtonDisabled }) => (
        <DynamicHtmlTag type="div" className="custom-header flex gap-1">
          <CustomButton
            onClick={decreaseMonth}
            disabled={prevMonthButtonDisabled}
            className="react-datepicker__navigation react-datepicker__navigation--previous"
            aria-label="Previous Month">
            <DynamicHtmlTag type="span" className="react-datepicker__navigation-icon react-datepicker__navigation-icon--previous">
              Previous Month
            </DynamicHtmlTag>
          </CustomButton>
          {/* Month Selector */}
          <CustomSelect
            value={{
              value: date instanceof Date ? date.getMonth() : new Date().getMonth(),
              label: new Date(0, date instanceof Date ? date.getMonth() : new Date().getMonth()).toLocaleString("fr", { month: "long" }),
            }}
            onChange={(selectedOption: any) => {
              if (selectedOption) {
                changeMonth(Number(selectedOption.value)); // Handle month change
              }
            }}
            options={Array.from({ length: 12 }, (_, i) => ({
              value: i,
              label: new Date(0, i).toLocaleString("fr", { month: "long" }),
            }))}
            classNamePrefix="month-year-selector"
          />
          {/* Year Selector */}
          <CustomSelect
            value={{
              value: date instanceof Date ? date.getFullYear() : new Date().getFullYear(),
              label: (date instanceof Date ? date.getFullYear() : new Date().getFullYear()).toString(),
            }}
            onChange={(selectedOption: any) => {
              if (selectedOption) {
                changeYear(Number(selectedOption.value)); // Handle year change
              }
            }}
            options={Array.from({ length: currentYear - 1940 + 1 }, (_, i) => currentYear - i).map(year => ({
              value: year,
              label: year.toString(),
            }))}
            classNamePrefix="month-year-selector"
            className="year-select"
          />
          {/* Next Month Button */}
          <CustomButton
            onClick={increaseMonth}
            disabled={nextMonthButtonDisabled}
            className="react-datepicker__navigation react-datepicker__navigation--next"
            aria-label="Next Month">
            <span className="react-datepicker__navigation-icon react-datepicker__navigation-icon--next">Next Month</span>
          </CustomButton>
        </DynamicHtmlTag>
      )}
      {...rest}
    />
  );
};
export default CustomDatePicker;
