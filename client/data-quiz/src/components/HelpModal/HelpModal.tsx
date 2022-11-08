import {Box, Button, Modal, Typography} from "@mui/material"
import React from "react"
import styles from './HelpModal.module.scss'
import {useTranslation} from "react-i18next";
import {ReactComponent as QuestionCircleIcon} from '../../assets/question-circle.svg'
import {ReactComponent as EnvelopeIcon} from "../../assets/envelope.svg";
import {ReactComponent as GithubIcon} from "../../assets/github.svg";
import {ReactComponent as JoystickIcon} from "../../assets/joystick.svg";
import {ReactComponent as InfoSquareIcon} from "../../assets/info-square.svg";
import {ReactComponent as BoxIcon} from "../../assets/box.svg";

// see: https://mui.com/material-ui/react-modal
const boxModalStyle = {
    boxShadow: 24,
    bgcolor: 'background.paper',
    p: 4,
};

export const HelpModal: React.FC = () => {
    const {t} = useTranslation()

    const [open, setOpen] = React.useState(false)
    const handleOpen = () => setOpen(true)
    const handleClose = () => setOpen(false)

    return (
        <div className={styles.container}>
            <Button onClick={() => handleOpen()} variant="contained" endIcon={<QuestionCircleIcon/>}>
                {t('help.button')}
            </Button>
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
                        <p>
                            {t('help.section-1-paragraph-2')}
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

                    <Typography variant="h6" component="h2">
                        <InfoSquareIcon/>
                        {t('help.section-3-title')}
                    </Typography>

                    <Typography>
                        <p>
                            {t('help.section-3-paragraph-1')}
                        </p>
                        <p>
                            {t('help.section-3-paragraph-2')}
                        </p>

                        <p>
                            {t('help.section-3-contact')}
                            <a href="mailto:sebastian_maciejewski@yahoo.com">
                                <EnvelopeIcon className={styles.envelopeIcon}/>
                            </a>
                        </p>

                        <p>
                            {t('help.section-3-oss')}
                            <a href="https://github.com/S-Maciejewski/geekonomy"> GitHub <GithubIcon/>
                            </a>
                        </p>
                    </Typography>
                    <p className={styles.copyright}>
                        Copyright &copy; 2022 Sebastian Maciejewski
                    </p>
                </Box>
            </Modal>
        </div>
    )
}
