import {Box, Button, Modal, Typography} from "@mui/material"
import React from "react"
import styles from './GlossaryModal.module.scss'
import {useTranslation} from "react-i18next";
import {ReactComponent as JournalTextIcon} from "../../assets/journal-text.svg";

// see: https://mui.com/material-ui/react-modal
const boxModalStyle = {
    boxShadow: 24,
    bgcolor: 'background.paper',
    p: 4,
};

export const GlossaryModal: React.FC = () => {
    const {t} = useTranslation()

    const [open, setOpen] = React.useState(false)
    const handleOpen = () => setOpen(true)
    const handleClose = () => setOpen(false)

    return (
        <div className={styles.container}>
            <Button onClick={() => handleOpen()} variant="contained" endIcon={<JournalTextIcon/>}>
                {t('glossary.button')}
            </Button>
            <Modal
                open={open}
                onClose={handleClose}
            >
                <Box sx={boxModalStyle} className={styles.modalBox}>
                    test
                </Box>
            </Modal>
        </div>
    )
}
