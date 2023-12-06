/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react'

const Pagination = ({ nPages, currentPage, setCurrentPage, setActiveIndex, indexOfFirstRecord, currentRecords, totalRecord }) => {

  const arr = Array.from({ length: nPages }, (_, index) => index + 1);

  const nextPage = () => {
    if (currentPage !== nPages) setCurrentPage(currentPage + 1);
    setActiveIndex("");
  }
  const prevPage = () => {
    if (currentPage !== 1) setCurrentPage(currentPage - 1);
    setActiveIndex("");
  }

  return (
    <nav>
      <ul className='pagination d-flex justify-content-between align-items-center m-0'>
        <span className="mr-2">
          {indexOfFirstRecord + 1} - {currentRecords + indexOfFirstRecord} of {totalRecord} photos
        </span>
        <li className="page-item" onClick={prevPage}>
          <a style={{ cursor: "pointer" }} className="page-link "
            onClick={prevPage}>
            Previous
          </a>
        </li>
        {arr.map(pgNumber => (
          <li key={pgNumber}
            className={`page-item  ${currentPage === pgNumber ? 'active' : ''} `} >
            <a onClick={() => { setCurrentPage(pgNumber); setActiveIndex("") }}
              className='page-link'>
              {pgNumber}
            </a>
          </li>
        ))}
        <li className="page-item ">
          <a style={{ cursor: "pointer" }} className="page-link"
            onClick={nextPage}>
            Next
          </a>
        </li>
      </ul>
    </nav>
  )
}

export default Pagination
