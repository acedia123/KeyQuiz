import React from 'react';
import CustomButton from './CustomButton';
import i18n from 'i18next';
import { useTranslation } from 'react-i18next';
import LanguageIcon from '@mui/icons-material/Language';
function ChangeLanguage() {
    const languages = [
        {
            code: 'vi',
            name: 'vietnam',
            country_code: 'vi',
        },
        {
            code: 'en',
            name: 'english',
            country_code: 'gb',
        },
    ];

    const { t } = useTranslation();

    const [value, setValue] = React.useState('Tiếng Việt');

    const handleChangeLanguage = (code, name) => {
        i18n.changeLanguage(code);
        setTimeout(() => {
            setValue(t(name));
        }, 100);
    };

    return (
        <div className="dropdown">
            <button
                className="dropdown-toggle d-flex align-items-center text-light"
                type="button"
                id="dropdownMenuButton"
                data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
            >
                <LanguageIcon />
                <span className="d-block normal-font mx-1">{value}</span>
            </button>
            <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                {languages.map(({ code, name, country_code }) => {
                    return (
                        <CustomButton
                            className="dropdown-item"
                            key={country_code}
                            title={t(name)}
                            colorButton="light"
                            handleClick={() => handleChangeLanguage(code, name)}
                        />
                    );
                })}
            </div>
        </div>
    );
}

export default ChangeLanguage;
