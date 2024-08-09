// components/Pagination.js

import React from 'react';



interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (selectedPage: number) => void; 
}

export const Pagination: React.FC<PaginationProps> = ({ currentPage , totalPages, onPageChange } ) => {


    const getPageNumbers = () => {
        const margin = 2;
        const pageNumbers = [];
        let startPage = Math.max(1, currentPage - margin);
        let endPage = Math.min(totalPages, currentPage + margin);
        console.log("startPage => ",startPage)
        console.log("endPage => ",endPage)
        if (currentPage <= margin) {
            endPage = Math.min(margin * 2 + 1, totalPages);
        } else if (currentPage >= totalPages - margin) {
            startPage = Math.max(totalPages - margin * 2, 1);
        }

        for (let i = startPage; i <= endPage; i++) {
            pageNumbers.push(i);
        }
        console.log("pageNumbers => ",pageNumbers)
        return pageNumbers;
    };

    const handlePageChange = (page: number) => {
        console.log("page => ",page)
        if (page >= 1 && page <= totalPages) {
              onPageChange(page);
        }
    };


    return (
        <div>
           <button disabled={currentPage === 1} onClick={() => handlePageChange(1)} className='p-1 text-gray-400'>{"<<"}</button>
            <button disabled={currentPage === 1} onClick={() => handlePageChange(currentPage-1)} className='p-1 text-gray-400'  >{"<"}</button>
            {getPageNumbers().map((page, index) => (
                <button key={index} className={`p-1 ${page === currentPage ? 'color-black' : 'text-gray-400'}`}  onClick={() => handlePageChange(page)}  >{page}</button>
            ))}
            <button disabled={currentPage === totalPages} onClick={() => handlePageChange(currentPage+1)} className='p-1 text-gray-400'>{">"}</button>
            <button disabled={currentPage === totalPages} onClick={() => handlePageChange(totalPages)} className='p-1 text-gray-400' >{">>"}</button>
        </div>
    );
}

