import axios from "axios";
import React, { Fragment, useEffect, useState } from "react";
import { mainServerAppUrl } from "../apis/mainapi";

function Feedback({ fixNavbar }) {
  const [feedbackdata, setFeedbackdata] = useState([]);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalPage, setTotalPage] = useState();

  async function total() {
    const userFeedback = await axios.get(
      mainServerAppUrl + "/feedback/get-feedback"
    );
    const total = userFeedback.data.length;
    setTotalPage(Math.ceil(total / pageSize));
  }


  useEffect(() => {
    async function getFeedback(page) {
      const userFeedback = await axios.get(
        mainServerAppUrl +
        "/feedback/get-feedback?pageSize=" +
        pageSize +
        "&page=" +
        page
      );
      setFeedbackdata(userFeedback.data);
      total();
    }
    getFeedback(page);
  }, [page]);
  return (
    <>
      <header className="page-header">
        <div className="flex-40">
          <h1>Feedbacks</h1>
        </div>
        <div className="flex-60">
          <div className="d-flex justify-content-end align-item-center">
          </div>
        </div>
      </header>
      <div className={`section-body ${fixNavbar ? "marginTop" : ""}`}>
        {feedbackdata?.length > 0 ?
          <div className="table-responsive">
            <table className="table table-hover table-vcenter text-nowrap table_custom spacing8 mb-0">
              <thead>
                <tr>
                  <th>Email Id</th>
                  <th>Feedback Type</th>
                  <th>Feedback Message</th>
                  <th>Created At</th>
                </tr>
              </thead>
              <tbody>
                {feedbackdata?.map((value, index) => (
                  <tr key={index}>
                    <td>{value?.userEmail}</td>
                    <td>{value?.subject}</td>
                    <td>{value?.feedback}</td>
                    <td>{new Date(value?.createdAt).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {feedbackdata?.length > 0 && (
              <div className="d-flex justify-content-center">
                <nav aria-label="Page navigation example">
                  <ul className="pagination">
                    <li className="page-item">
                      <a
                        className="page-link"
                        onClick={() => {
                          setPage(page <= 0 ? 0 : page - 1);
                        }}
                        href="#"
                        aria-label="Previous"
                      >
                        <span aria-hidden="true">&laquo;</span>
                        <span className="sr-only">Previous</span>
                      </a>
                    </li>
                    <li className="page-item">
                      <a className="page-link" href="#">
                        {page + 1}/{totalPage}
                      </a>
                    </li>

                    <li className="page-item">
                      <a
                        className="page-link"
                        onClick={() => {
                          setPage(page == totalPage - 1 ? totalPage - 1 : page + 1);
                        }}
                        href="#"
                        aria-label="Next"
                      >
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
                <div className="no-data-image">
                </div>
                <p>No Data Found</p>
              </div>
            </div>
          </div>
        }
      </div>
    </>
  );
}

export default Feedback;
