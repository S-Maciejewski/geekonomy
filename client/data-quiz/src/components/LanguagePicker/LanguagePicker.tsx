import React from "react";
import {FormControl, InputLabel, MenuItem, Select, SelectChangeEvent} from "@mui/material";
import styles from './LanguagePicker.module.scss'
import {useTranslation} from "react-i18next";

export const LanguagePicker: React.FC = () => {
    const {t, i18n} = useTranslation()

    const handleChange = (event: SelectChangeEvent<string>) => {
        i18n.changeLanguage(event.target.value)
    }

    const normalizeLanguage = (lang: string) => {
        return lang.split('-')[0]
    }

    const supportedLanguages = [
        {
            code: 'en',
            icon: '🇬🇧'
        },
        {
            code: 'pl',
            icon: '🇵🇱'
        }
    ]

    return (
        <div className={styles.container}>
            <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">{t('language')}</InputLabel>
                <Select
                    value={normalizeLanguage(i18n.language)}
                    label={t('language')}
                    onChange={(value) => handleChange(value)}
                >
                    {
                        supportedLanguages.map(language =>
                            <MenuItem value={language.code}>
                                <span className={styles.flagEmoji}>
                                    {language.icon}
                                </span>
                            </MenuItem>
                        )
                    }
                </Select>
            </FormControl>
        </div>
    )
}