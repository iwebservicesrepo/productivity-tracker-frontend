import React from 'react'

const Table = ({fixNavbar}) => {
  return (
    <>
    <div className={`section-body ${fixNavbar ? "marginTop" : ""} mt-3`}>
      
        <div className="container-fluid">
          <div className="d-flex justify-content-end align-items-center">
    <div className="row row-cards">
              <div className="table-responsive">
                <table className="table table-hover table-vcenter text-nowrap table_custom spacing8 mb-0">
                  <thead>
                    <tr>
                      <th>Invoice No.</th>
                      <th>Date</th>
                      <th>Amount</th>
                      <th>Payment Method</th>
                      <th>Download Invoice</th>
                    </tr>
                  </thead>
                  <tbody>
                    <td className='text-center'> <div className='text-capitalize'>123</div></td>
                    <td className='text-center'> <div className='text-capitalize'>04/12/2022</div></td>
                    <td className='text-center'> <div className='text-capitalize'>₹ 10000</div></td>
                    <td className='text-center'> <div className='text-capitalize'>Credit Card - PayPal</div></td>
                    <td className='text-center'> <div>www.downloadinvoice.com</div></td>
                    
                  </tbody>
                  </table>
                  </div>
                
  </div>
  </div>
  </div>
  </div>
  </>
  )
}

export default Table