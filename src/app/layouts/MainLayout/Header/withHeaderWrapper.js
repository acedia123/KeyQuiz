import { debounce } from '@mui/material';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { routes } from '../../../configs';
import { searchingGeneral } from '../../../services/ulti';

export default function withHeaderWrapper(WrapperComponent) {
    return (props) => {
        const [hideSearch, setHideSearch] = useState(false);

        const [searchResult, setSearchResult] = useState(null);
        const [searchText, setSearchText] = useState('');
        const pathName = window.location.pathname;

        const hideSearchPopper = () => {
            setSearchText('');
        };

        useEffect(() => {
            setHideSearch(pathName == routes.home);
        }, [pathName]);

        const handleOnBlur = () => {
            if (pathName != routes.home || window.innerWidth <= 1000) {
                setHideSearch(false);
            }
        };

        const handleOpenSearch = () => {
            setHideSearch(true);
            debounceDropDown('');
        };

        const handleChangeSearch = (e) => {
            if (e.target.value != '') {
                setSearchText(e.target.value);
                debounceDropDown(e.target.value);
            }
        };

        window.addEventListener('resize', (e) => {
            setHideSearch(e.target.innerWidth >= 1000);
        });

        const fetchDropdownOptions = (value) => {
            searchingGeneral({ searchText: value.trim() }).then(({ data }) => {
                // inputSearch.current.focus();
                setSearchResult(data);
            });
        };

        const debounceDropDown = useCallback(
            debounce((nextValue) => fetchDropdownOptions(nextValue), 500),
            [],
        );

        return (
            <WrapperComponent
                searchText={searchText}
                hideSearch={hideSearch}
                searchResult={searchResult}
                handleOpenSearch={handleOpenSearch}
                handleChangeSearch={handleChangeSearch}
                hideSearchPopper={hideSearchPopper}
                handleOnBlur={handleOnBlur}
                {...props}
            />
        );
    };
}
