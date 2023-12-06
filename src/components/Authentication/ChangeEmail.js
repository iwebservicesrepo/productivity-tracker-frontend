import React, { useEffect } from 'react'
import {
    useParams
} from "react-router-dom";
import axios from 'axios';
import { mainServerAppUrl } from './../../apis/mainapi';
import { eraseCookie } from './authHelpers';
import { createBrowserHistory } from 'history';
import { toast } from 'react-hot-toast';

const history = createBrowserHistory();

export default function ChangeEmail({ fixNavbar }) {

    let { id } = useParams()
    eraseCookie("_token");

    useEffect(() => {
        axios.post(mainServerAppUrl + "/users/email-update-confirm", { id: id })
            .then(async (res) => {
                // toast.success("Email Changed successfully Redirecting to the login page", { position: 'top-center', duration: 2000 });
                history.push("/")
                 window.location.reload();

            })
            .catch((err) => {
                console.log(err)
            })
    }, [id])

    return (
        <>
        </>
    )
}
