import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Tabs, Tab, tabsClasses, debounce } from '@mui/material';
import * as actions from '../../redux/category/actions';
// Component
import TabPanel from '../../components/Tab/TabPanel';
import CardCourses from '../../components/Card/CardCourses';
import CustomTippyPopper from '../../components/Share/CustomTippyPopper';
import { Link } from 'react-router-dom';
import { Category } from '@mui/icons-material';
import { searchOrFilterCategories } from '../../services/category';
import TopicSearch from '../../components/Search/TopicSearch';

import classNames from 'classnames/bind';
import styles from './Topics.module.scss';

const cx = classNames.bind(styles);

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

export default function Topics() {
    const inputSearch = useRef();
    const dispatch = useDispatch();
    const { categories } = useSelector((state) => state.category);
    const [value, setValue] = React.useState(0);
    const [popper, setPopper] = useState(false);
    const [dataSearch, setDataSearch] = useState(null);

    const [searchText, setSearchText] = useState('');
    const [focus, setFocus] = useState(false);

    const active = () => setFocus(true);
    const unActive = () => setFocus(false);

    const urlParams = new URLSearchParams(window.location.search);

    useEffect(() => {
        document.title = 'Topics | Key Quiz';
    }, []);

    useEffect(() => {
        dispatch(actions.getCategories.getCategoriesRequest());
    }, [dispatch]);

    useEffect(() => {
        if (window.location.search != '' && categories) {
            let searchIndex = categories.findIndex((item) => item.category_id === urlParams.get('tab'));
            setValue(searchIndex > -1 ? searchIndex : 0);
        }
    }, [window.location.search, categories]);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const handleChangeSearch = (event) => {
        setSearchText(event.target.value);
        if (event.target.value.length > 0) {
            showPopper();
        }
        debounceDropDown(event.target.value);
    };

    const fetchDropdownOptions = (value) => {
        searchOrFilterCategories({ searchText: value }).then(({ data }) => {
            inputSearch.current.focus();
            setDataSearch(data);
        });
    };

    const debounceDropDown = useCallback(
        debounce((nextValue) => fetchDropdownOptions(nextValue), 500),
        [],
    );

    const handleClearSearchText = () => {
        setSearchText('');
        debounceDropDown('');
    };

    const showPopper = () => setPopper(true);
    const hidePopper = () => setPopper(false);

    const handleClickChangeTopic = (id) => {
        let searchIndex = categories.findIndex((item) => item.category_id === id);
        setValue(searchIndex > -1 ? searchIndex : 0);
        hidePopper();
    };

    const handleFocusText = () => {
        if (searchText.trim().length > 0) {
            showPopper();
        }
        active();
    };

    return (
        <div className="inner" id="listTopics">
            <div className={cx('header')}>
                <h2 className={cx('header-title')}>Topics</h2>
                <div className={cx('header-action')}>
                    <CustomTippyPopper
                        visible={popper}
                        className={cx('topic-search-popper')}
                        interactive={true}
                        placement="bottom-start"
                        handleClosePopper={hidePopper}
                        popperRender={
                            <ul>
                                {dataSearch &&
                                    (dataSearch.length ? (
                                        dataSearch.map((cate) => (
                                            <li key={cate.name}>
                                                <Link
                                                    className="popper-link"
                                                    onClick={() => handleClickChangeTopic(cate.category_id)}
                                                >
                                                    <Category className="icon mr-2" />
                                                    {cate.name}
                                                </Link>
                                            </li>
                                        ))
                                    ) : (
                                        <li className="popper-link">No topics found</li>
                                    ))}
                            </ul>
                        }
                    >
                        <div>
                            <TopicSearch
                                ref={inputSearch}
                                focus={focus}
                                placeholder="Find topic..."
                                searchText={searchText}
                                handleFocus={handleFocusText}
                                handleBlur={unActive}
                                handleChangeSearch={handleChangeSearch}
                                handleClear={handleClearSearchText}
                            />
                        </div>
                    </CustomTippyPopper>
                </div>
            </div>
            <Box sx={{ borderBottom: 1, borderColor: 'divider', mt: 2 }}>
                <Tabs
                    value={value}
                    onChange={handleChange}
                    variant="scrollable"
                    scrollButtons
                    allowScrollButtonsMobile
                    sx={{
                        [`& .${tabsClasses.scrollButtons}`]: {
                            '&.Mui-disabled': { opacity: 0.3 },
                            '.MuiSvgIcon-root': { width: 20, height: 20 },
                        },
                    }}
                >
                    {categories &&
                        categories.map((item, index) => (
                            <Tab
                                key={item.id}
                                label={item.name}
                                {...a11yProps(index)}
                                className="normal-font font-weight-bold"
                                wrapped
                            />
                        ))}
                </Tabs>
            </Box>
            {categories &&
                categories.map((item, index) => (
                    <TabPanel value={value} index={index} key={item.id}>
                        <CardCourses category={item} />
                    </TabPanel>
                ))}
        </div>
    );
}
