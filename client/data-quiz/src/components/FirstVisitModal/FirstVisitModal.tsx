import {Box, Button, Modal, Typography} from "@mui/material"
import React, {useEffect} from "react"
import styles from './FirstVisitModal.module.scss'
import {useTranslation} from "react-i18next";
import {ReactComponent as BoxIcon} from "../../assets/box.svg";
import {ReactComponent as JoystickIcon} from "../../assets/joystick.svg";

const boxModalStyle = {
    boxShadow: 24,
    bgcolor: 'background.paper',
    p: 4,
};

export const FirstVisitModal: React.FC = () => {
    const {t} = useTranslation()

    const [open, setOpen] = React.useState(false)
    const handleOpen = () => {
        if (localStorage.getItem('firstVisit') !== 'false') {
            setOpen(true)
        }
    }
    const handleClose = () => setOpen(false)

    const handleCloseAndSetFirstVisit = () => {
        setOpen(false)
        localStorage.setItem('firstVisit', 'false')
    }

    useEffect(() => {
        handleOpen()
    }, []);

    return (
        <Modal
            open={open}
            onClose={handleClose}
        >
            <Box sx={boxModalStyle} className={styles.modalBox}>
                <Typography variant="h6" component="h2">
                    <BoxIcon/>
                    {t('help.section-1-title')}
                </Typography>
                <Typography sx={{mt: 2}}>
                    <p>
                        {t('help.section-1-paragraph-1')}
                    </p>
                </Typography>

                <Typography variant="h6" component="h2">
                    <JoystickIcon/>
                    {t('help.section-2-title')}
                </Typography>

                <Typography sx={{mt: 2}}>
                    <p>
                        {t('help.section-2-paragraph-1')}
                    </p>
                    <p>
                        {t('help.section-2-paragraph-2')}
                    </p>
                </Typography>
                <div className={styles.cookiesNotice}>
                    <span>
                        {t('help.cookies-notice')}
                    </span>
                </div>
                <Button onClick={handleCloseAndSetFirstVisit}
                        className={styles.closeButton}>
                    {t('help.close')}
                </Button>
            </Box>
        </Modal>
    )
}
