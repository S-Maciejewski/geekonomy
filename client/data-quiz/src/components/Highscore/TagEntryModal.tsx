import React from "react"
import {useTranslation} from "react-i18next";
import {Box, Button, Modal, TextField, Typography} from "@mui/material";
import styles from "./TagEntryModal.module.scss";
import {Engine} from "../../services/Engine";
import {store} from "../../store/store";
import {ActionType} from "../../store/actions";


const boxModalStyle = {
    boxShadow: 24,
    bgcolor: 'background.paper',
    p: 4,
};

export type TagEntryModalProps = {
    open: boolean,
}

export const TagEntryModal: React.FC<TagEntryModalProps> = ({open}) => {
    const {t} = useTranslation()
    const [tag, setTag] = React.useState<string>('ANO')

    const handleClose = () => {
        if (tag.length > 3 || tag === '') {
            setTag('ANO')
        }
        Engine.handleHighscore(tag)
            .catch(e => {
                console.log('Error while handling highscore', e)
                store.dispatch({
                    type: ActionType.HIGHSCORE_POSTED
                })
            })
    }

    return (
        <Modal
            open={open}
            onClose={handleClose}
        >
            <Box sx={boxModalStyle} className={styles.modalBox}>
                <Typography variant="h6" component="h2">
                    {t('highscores.congratulations')}
                </Typography>
                <Typography>
                    {t('highscores.prompt')}
                </Typography>

                <div className={styles.input}>
                    <TextField className={styles.textField}
                               label={t('highscores.tag')}
                               variant="outlined"
                               inputProps={{maxLength: 3}}
                               value={tag}
                               onChange={(event) => setTag(event.target.value)}
                    />
                    <Button variant="contained" onClick={handleClose} className={'styles.submit'}>
                        {t('highscores.submit')}
                    </Button>
                </div>
            </Box>
        </Modal>

    )
}
