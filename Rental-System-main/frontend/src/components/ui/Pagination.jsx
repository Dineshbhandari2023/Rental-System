import React from "react";

const Pagination = ({ page, totalPages, onPageChange }) => {
  const prev = () => onPageChange(Math.max(1, page - 1));
  const next = () => onPageChange(Math.min(totalPages, page + 1));

  return (
    <div className="flex items-center justify-between mt-4">
      <div className="text-sm text-gray-600">
        Page {page} of {totalPages}
      </div>
      <div className="flex gap-2">
        <button onClick={prev} className="px-3 py-1 bg-white border rounded">
          Prev
        </button>
        <button onClick={next} className="px-3 py-1 bg-white border rounded">
          Next
        </button>
      </div>
    </div>
  );
};

export default Pagination;
