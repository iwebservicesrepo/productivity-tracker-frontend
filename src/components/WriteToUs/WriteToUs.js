/* eslint-disable jsx-a11y/anchor-is-valid */
import axios from "axios";
import React, { Fragment, useEffect, useState } from "react";
import { mainServerAppUrl } from "../../apis/mainapi";

function WriteToUs({ fixNavbar }) {
  const [writeToUsData, setWriteToUsData] = useState([]);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10)
  const [totalPage, setTotalPage] = useState(1)

  async function total() {
    const writeToUs = await axios.get(
      mainServerAppUrl + "/writeToUs/get-writeToUs");
    const total = writeToUs.data.length
    setTotalPage(Math.ceil(total / pageSize))
  }


  useEffect(() => {
    async function getWriteToUs(page) {
      const writeToUs = await axios.get(
        mainServerAppUrl + "/writeToUs/get-writeToUs?pageSize=" + pageSize + "&page=" + page);
      setWriteToUsData(writeToUs.data);
      total();
    }
    getWriteToUs(page);
  }, [page]);

  return (
    <>
      <header className="page-header">
        <div className="flex-40">
          <h1>Write To Us</h1>
        </div>
        <div className="flex-60">
          <div className="d-flex justify-content-end align-item-center">

          </div>
        </div>
      </header>
      <div className={`section-body ${fixNavbar ? "marginTop" : ""}`}>
        {writeToUsData?.length > 0 ?
          <div className="table-responsive">
            <table className="table table-hover table-vcenter text-nowrap table_custom spacing8 mb-0">
              <thead>
                <tr>
                  <th width="10%">Email Id</th>
                  <th width="20%">Subject</th>
                  <th width="60%">Message</th>
                  <th width="10%">Created At</th>
                </tr>
              </thead>
              <tbody>
                {writeToUsData?.map((value, index) => (
                  <tr key={index}>
                    <td>{value?.userEmail}</td>
                    <td className="text-wrap">{value?.subject}</td>
                    <td className="text-wrap">{value?.message}</td>
                    <td>{new Date(value?.createdAt).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {writeToUsData?.length > 0 && (
              <div className="d-flex justify-content-center">
                <nav aria-label="Page navigation example">
                  <ul className="pagination">
                    <li className="page-item">
                      <a className="page-link" onClick={() => {
                        setPage(page <= 0 ? 0 : page - 1);
                      }} href="#" aria-label="Previous">
                        <span aria-hidden="true">&laquo;</span>
                        <span className="sr-only" >Previous</span>
                      </a>
                    </li>
                    <li className="page-item">
                      <a className="page-link" href="#">
                        {page + 1}/{totalPage}
                      </a>
                    </li>

                    <li className="page-item">
                      <a className="page-link" onClick={() => {
                        setPage(page == totalPage - 1 ? totalPage - 1 : page + 1);
                      }} href="#" aria-label="Next">
                        <span aria-hidden="true">&raquo;</span>
                        <span className="sr-only">Next</span>
                      </a>
                    </li>
                  </ul>
                </nav>
              </div>
            )}
          </div>
          :
          <div className="no-data-found">
            <div className="card">
              <div className="card-body">
                <i className="fa fa-file" />
                <p>No Data Found</p>
              </div>
            </div>
          </div>
        }
      </div>
    </>
  );
}

export default WriteToUs;
