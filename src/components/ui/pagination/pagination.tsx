"use client";
import React from "react";
import { BiSolidLeftArrow, BiSolidRightArrow } from "react-icons/bi";
import ReactPaginate from "react-paginate";

interface PaginationProps {
  currentPage: number;
  pageCount: number;
  onPageChange?: (selectedItem: { selected: number }) => void;
  containerClassName?: string;
  pageClassName?: string;
  activeClassName?: string;
  previousClassName?: string;
  nextClassName?: string;
  disabledClassName?: string;
  breakLabel?: string;
  breakClassName?: string;
  marginPagesDisplayed?: number;
  pageRangeDisplayed?: number;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  pageCount,
  onPageChange,
  containerClassName,
  pageClassName,
  activeClassName,
  previousClassName,
  nextClassName,
  disabledClassName,
  breakLabel = "...", // Default value
  breakClassName,
  marginPagesDisplayed = 2, // Default value
  pageRangeDisplayed = 5, // Default value
}) => {
  return (
    <div className={containerClassName}>
      <ReactPaginate
        previousLabel={<BiSolidLeftArrow />}
        nextLabel={<BiSolidRightArrow />}
        breakLabel={breakLabel}
        breakClassName={breakClassName}
        pageCount={pageCount}
        marginPagesDisplayed={marginPagesDisplayed}
        pageRangeDisplayed={pageRangeDisplayed}
        onPageChange={onPageChange}
        containerClassName={"pagination flex items-center gap-2"}
        pageClassName={pageClassName}
        activeClassName={activeClassName}
        previousClassName={previousClassName}
        nextClassName={nextClassName}
        disabledClassName={disabledClassName}
        forcePage={currentPage}
      />
    </div>
  );
};

export default Pagination;
