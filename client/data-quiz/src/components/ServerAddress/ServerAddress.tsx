import React, {ChangeEvent, useState} from "react";
import {Button} from "@mui/material";
import styles from './ServerAddress.module.scss'
import TextField from "@mui/material/TextField";
import {ApiClient} from "../../services/ApiClient";

export const ServerAddress: React.FC = () => {
    const [url, setUrl] = useState(ApiClient.API_URL)

    const handleUrlChange = (event: ChangeEvent<HTMLInputElement>) => {
        event.preventDefault()
        setUrl(event.target.value)
    }

    const handleConnect = () => {
        ApiClient.setApiUrl(url)
    }

    return (
        <div className={styles.container}>
            <TextField className={styles.addressField} value={url.valueOf()}
                       id="outlined-basic" label="Server address" variant="outlined"
                       onChange={(event) => handleUrlChange(event as ChangeEvent<HTMLInputElement>)}
            />
            <Button className={styles.connectButton} onClick={handleConnect}>Connect</Button>
        </div>
    )
}