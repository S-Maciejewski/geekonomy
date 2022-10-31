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
            icon: '🇬🇧',
            className: styles["flag:GB"],
        },
        {
            code: 'pl',
            icon: '🇵🇱',
            className: styles["flag:PL"],
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
                    className={styles.select}
                >
                    {
                        supportedLanguages.map(language =>
                            <MenuItem value={language.code}>
                                <div className={styles.flagEmoji}>
                                    {/*Language icon is problematic - doesn't work on most browsers including Chrome
                                    That's why I'm using flags from https://unpkg.com/country-flag-icons@1.5.5/3x2/flags.css
                                    to avoid installing this package: https://www.npmjs.com/package/country-flag-icons*/}
                                    <div className={language.className}/>
                                </div>
                            </MenuItem>
                        )
                    }
                </Select>
            </FormControl>
        </div>
    )
}
