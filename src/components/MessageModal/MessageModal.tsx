import React from 'react'
import { useHistory } from 'react-router-dom';

export default function MessageModal(props) {

    const { open, closeHandler } = props;

    const history = useHistory()
    return (
        <>
            {open &&
                <div
                    className="modal d-block"
                    aria-labelledby="exampleModalLabel"
                    aria-hidden="true"
                >
                    <div
                        className="modal-dialog modal-dialog-centered modal-md message-modal"
                        role="document"
                    >
                        <div className="modal-content">
                            <button className="close"  onClick={() => closeHandler()}></button>
                            <div className="modal-body">
                                <div className="welcome-modal-icon">
                                    <img src={require("../../images/monkey.png")} alt="logoProd2.png" />
                                </div>
                                <div className="bottom-content">
                                    <p>It looks like you want to add a few more users. The Forever FREE plan only allows up to 3 users. But don’t worry;
                                        you can add as many as you want by upgrading to our Premium plan by just paying $1.5/month per user. And enjoy a lot of other features.</p>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button
                                    type="submit"
                                    className="btn btn-success"
                                    onClick={() => history.push('/payment')}
                                >
                                    Upgrade to Premium
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            }
        </>
    )
}
