"use client";
import React, { useState } from "react";
import { CustomButton, CustomInput, CustomLabel, DynamicHtmlTag, HeadingTag, CustomImage } from "@/components";

interface AccordionItemProps {
  title: string;
  timeSlots: { id: string; label: string; value: string; dayValue: string }[];
  isOpen: boolean;
  onClick: () => void;
  onTimeSlotSelect: (slotId: string, dayTitle: string, value: string, dayValue: string) => void;
  className?: string;
}

interface AccordionProps {
  items: { title: string; timeSlots: { id: string; label: string; value: string; dayValue: string }[] }[];
  onTimeSlotSelect: (slotId: string, dayTitle: string, value: string, dayValue: string) => void;
}

const AccordionItem: React.FC<AccordionItemProps> = ({ title, timeSlots, isOpen, onClick, onTimeSlotSelect, className }) => {
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);

  const handleSlotSelect = (slotId: string, dayTitle: string, value: string, dayValue: string) => {
    setSelectedSlotId(slotId);
    onTimeSlotSelect(slotId, dayTitle, value, dayValue);
  };

  return (
    <DynamicHtmlTag type="div" className={`accordionitem border border-gray-200 w-full mb-2 rounded-lg ${className}`}>
      <CustomButton onClick={onClick} className={`flex items-center justify-between w-full py-3 px-4 text-left`}>
        <HeadingTag type="h2" className={`text-xs font-semibold capitalize ${isOpen ? "text-red-500" : ""}`}>
          {title}
        </HeadingTag>
        <CustomImage src={"/images/arrow-down.svg"} width={10} height={15} alt="arrow" className="accordion-arrow ease-in" />
      </CustomButton>
      {isOpen && (
        <DynamicHtmlTag type="div" className="border-t border-gray-200 p-4 flex flex-wrap doctor-card-detail items-center gap-1 lg:gap-1.5">
          {timeSlots.map(slot => (
            <DynamicHtmlTag key={slot.id} type="div" className="radio-card w-[18%] lg:w-[14%] xl:w[10%]">
              <CustomButton
                className={`custom-select-btn ${selectedSlotId === slot.id ? "active" : ""} [&&]:text-3xs [&&]:lg:text-[0.625rem] [&&]:p-1`}
                onClick={() => handleSlotSelect(slot.id, title, slot.value, slot.dayValue)}>
                {slot.label}
              </CustomButton>
            </DynamicHtmlTag>
          ))}
        </DynamicHtmlTag>
      )}
    </DynamicHtmlTag>
  );
};

const Accordion: React.FC<AccordionProps> = ({ items, onTimeSlotSelect }) => {
  const [openIndex, setOpenIndex] = useState<number>(0);

  const handleToggle = (index: number) => {
    setOpenIndex(openIndex === index ? -1 : index);
  };

  return (
    <DynamicHtmlTag type="div" className="w-full mx-auto pt-0 md:pt-5">
      {items.map((item, index) => (
        <AccordionItem
          key={index}
          title={item.title}
          timeSlots={item.timeSlots}
          isOpen={openIndex === index}
          onClick={() => handleToggle(index)}
          onTimeSlotSelect={onTimeSlotSelect}
          className={openIndex === index ? "active" : ""}
        />
      ))}
    </DynamicHtmlTag>
  );
};

export default Accordion;
