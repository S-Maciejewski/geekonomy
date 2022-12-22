import {Box, Button, Modal, Typography, Accordion, AccordionDetails, AccordionSummary} from "@mui/material"
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import React from "react"
import styles from './GlossaryModal.module.scss'
import {useTranslation} from "react-i18next";
import {ReactComponent as JournalTextIcon} from "../../assets/journal-text.svg";
import {ReactComponent as LinkIcon} from "../../assets/link.svg";
import i18n from 'i18next'
import glossary_en from '../../i18n/content/glossary_en.json'
import glossary_pl from '../../i18n/content/glossary_pl.json'

// see: https://mui.com/material-ui/react-modal
const boxModalStyle = {
    boxShadow: 24,
    bgcolor: 'background.paper',
    p: 4,
};

interface GlossaryEntry {
    term: string,
    shortDefinition: string,
    description: string,
    wikiLink: string,
}

export const GlossaryModal: React.FC = () => {
    const {t} = useTranslation()

    const [open, setOpen] = React.useState(false)
    const handleOpen = () => setOpen(true)
    const handleClose = () => setOpen(false)

    const content = i18n.language.includes('en') ? glossary_en : glossary_pl

    const GlossaryEntryComponent: React.FC<GlossaryEntry> = (entry: GlossaryEntry) => {
        return (
            <Accordion
                className={styles.glossaryEntry}>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon/>}
                    aria-controls={`${entry.term}-content`}
                    id={entry.term}
                >
                    <Typography sx={{width: '33%', flexShrink: 0}}>
                        {entry.term}
                    </Typography>
                    <Typography sx={{color: 'text.secondary'}}>
                        {entry.shortDefinition}
                    </Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Typography>
                        {entry.description}
                    </Typography>

                    <div className='linkContainer'>
                        <Typography>
                            <LinkIcon/>
                            &nbsp;
                            <a href={entry.wikiLink} target="_blank" rel="noreferrer">
                                {t('glossary.learn-more')}
                            </a>
                        </Typography>
                    </div>
                </AccordionDetails>
            </Accordion>
        )
    }

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
                    <Typography variant="h6" component="h2">
                        {t('glossary.title')}
                    </Typography>
                    {content.map((glossaryEntry: GlossaryEntry) => <GlossaryEntryComponent {...glossaryEntry}/>)}
                </Box>
            </Modal>
        </div>
    )
}
