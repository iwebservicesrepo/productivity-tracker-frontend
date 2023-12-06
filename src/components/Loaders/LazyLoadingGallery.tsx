/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from 'react'

export default function LazyLoadingGallery(props) {
    const [cardRange, setCardRange] = useState([]);

    useEffect(() => {
        let nx = Array.from(Array(props.currentRecords).keys())
        setCardRange(nx);
    }, [])
    return (
        <>
            <div className={`section-body lazy-loading ${props.fixNavbar ? "marginTop" : ""} mt-3`}>
                <div className="container-fluid">
                    <div className="row row-cards">
                        <div className="col-12">
                            <div className="card">
                                <div className="card-header">
                                    <div className="page-subtitle ml-0 d-flex justify-content-between align-items-center">
                                        <div className="pagination"></div>
                                    </div>
                                    <div className="page-options d-flex"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row row-cards">
                        {cardRange.map((data, index) =>
                            <div className="col-sm-6 col-lg-4" key={index}>
                                <div className="card p-3">
                                    <a
                                        style={{ cursor: "pointer" }}
                                        className="mb-3 image-box"
                                    >
                                        <div className="rounded"></div>
                                    </a>
                                    <div className="d-flex align-items-center px-2">
                                        <div>
                                            <small className="d-block text-muted">

                                            </small>
                                        </div>
                                        <div className="ml-auto text-muted">
                                            <small className="icon">

                                            </small>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}
