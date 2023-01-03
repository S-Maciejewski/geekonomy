import React, {useEffect} from "react"
import styles from './HighscoreModal.module.scss'
import {useTranslation} from "react-i18next";
import {
    Box,
    Button,
    Modal,
    Paper,
    Table, TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography
} from "@mui/material"
import {ReactComponent as TrophyIcon} from "../../assets/trophy.svg";
import {Highscore} from "../types";
import {Engine} from "../../services/Engine";
import i18n from 'i18next'

// see: https://mui.com/material-ui/react-modal
const boxModalStyle = {
    boxShadow: 24,
    bgcolor: 'background.paper',
    p: 4,
};

type HighscoreTableProps = {
    currentHighscores: Highscore[]
}

export const HighscoreModal: React.FC = () => {
    const {t} = useTranslation()

    const [open, setOpen] = React.useState(false)
    const handleOpen = () => {
        getHighscores().then((highscores) => {
            setHighscores(highscores)
            setOpen(true)
        })
    }
    const handleClose = () => setOpen(false)

    const [highscores, setHighscores] = React.useState<Highscore[]>([])

    const getHighscores = async (): Promise<Highscore[]> => {
        try {
            return await Engine.getHighscores()
        } catch (e) {
            console.log('Error while getting highscores', e)
            setTimeout(getHighscores, 5000)
            return []
        }
    }

    useEffect(() => {
        getHighscores().then((highscores) => setHighscores(highscores))
            .catch(e => console.log('Error while getting highscores', e))
    }, [])

    const HighscoreTableComponent: React.FC<HighscoreTableProps> = ({currentHighscores}) => {
        return (
            <TableContainer component={Paper} className={styles.tableContainer}>
                <Table sx={{minWidth: 300}} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>{t('highscores.score')}</TableCell>
                            <TableCell align="right">{t('highscores.tag')}</TableCell>
                            <TableCell align="right">{t('highscores.date')}</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {currentHighscores.map((entry) => (
                            <TableRow
                                key={entry.sessionId}
                                sx={{'&:last-child td, &:last-child th': {border: 0}}}
                            >
                                <TableCell component="th" scope="row">
                                    {entry.score}
                                </TableCell>
                                <TableCell align="right">
                                    {entry.playerTag}
                                </TableCell>
                                <TableCell align="right">
                                    {new Date(entry.achievedAt).toLocaleString(i18n.language)}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        )
    }


    return (
        <div className={styles.container}>
            <Button onClick={() => handleOpen()} variant="contained"> <TrophyIcon/> </Button>
            <Modal
                open={open}
                onClose={handleClose}
            >
                <Box sx={boxModalStyle} className={styles.modalBox}>
                    <Typography variant="h6" component="h2">
                        {t('highscores.title')}
                    </Typography>
                    <Typography>
                        {t('highscores.explanation')}
                    </Typography>
                    <HighscoreTableComponent currentHighscores={highscores}/>
                </Box>
            </Modal>
        </div>
    )
}
