import React, { useEffect, useRef, useState } from 'react';
import { Check, FormatBold, FormatColorText, FormatItalic, FormatUnderlined } from '@mui/icons-material';
import sanitizeHtml from 'sanitize-html';
import ContentEditable from 'react-contenteditable';
import CustomTippyPopper from '../../components/Share/CustomTippyPopper';

import classNames from 'classnames/bind';
import styles from './Abc.module.scss';

const cx = classNames.bind(styles);

const EMPTY_VALUE = `<p><br></p>`;
const INITIAL_VALUE = `<p>Enter your note here</p>`;
const colors = ['red', 'white', 'black', 'blue', 'pink', 'green'];

export default function TextEditor({ data, handleBlurText }) {
    const [html, setHTML] = useState(INITIAL_VALUE);
    const textRef = useRef();
    const [activeButton, setActiveButton] = useState({ bold: 0, italic: 0, underline: 0 });
    const [colorSetting, setColorSetting] = useState({ foreBg: 'black', backBg: 'white' });
    const [popper, setPopper] = useState(false);

    useEffect(() => {
        setHTML(data === EMPTY_VALUE || !data ? INITIAL_VALUE : data);
    }, []);

    const handleChange = (evt) => {
        setHTML(() => evt.target.value);
    };

    const handleFocus = () => {
        if (textRef.current.lastHtml === INITIAL_VALUE) {
            setHTML(EMPTY_VALUE);
        }
    };

    const handleBlur = () => {
        if (textRef.current.lastHtml === EMPTY_VALUE) {
            setHTML(INITIAL_VALUE);
        }
        handleBlurText(textRef.current.lastHtml);
    };

    const handleClickIcon = (name) => {
        switch (name) {
            case 'bold':
                setActiveButton((preState) => {
                    return { ...preState, bold: !preState[name] };
                });
                break;
            case 'italic':
                setActiveButton((preState) => {
                    return { ...preState, italic: !preState[name] };
                });
                break;
            case 'underline':
                setActiveButton((preState) => {
                    return { ...preState, underline: !preState[name] };
                });
                break;
        }
    };

    const sanitizeConf = {
        allowedTags: ['b', 'i', 'em', 'strong', 'a', 'p', 'h1'],
        allowedAttributes: { a: ['href'] },
    };

    const sanitize = () => {
        setHTML(sanitizeHtml(html, sanitizeConf));
    };

    const handleChangeColor = (index, type) => {
        if (type === 0) {
            console.log('fore', colors[index]);
            setColorSetting((preState) => {
                return { ...preState, foreBg: colors[index] };
            });
            document.execCommand('foreColor', false, colors[index]);
        } else {
            console.log('back', colors[index]);
            setColorSetting((preState) => {
                return { ...preState, backBg: colors[index] };
            });
            document.execCommand('backColor', false, colors[index]);
        }
        setPopper(false);
    };

    return (
        <div className={cx('wrapper')}>
            <div className={cx('text-editor')}>
                <div className={cx('actions')}>
                    <EditButton
                        active={activeButton}
                        handleClick={() => handleClickIcon('bold')}
                        icon={<FormatBold className={cx('icon')} />}
                        cmd="bold"
                    />
                    <EditButton
                        active={activeButton}
                        handleClick={() => handleClickIcon('italic')}
                        icon={<FormatItalic className={cx('icon')} />}
                        cmd="italic"
                    />
                    <EditButton
                        active={activeButton}
                        handleClick={() => handleClickIcon('underline')}
                        icon={<FormatUnderlined className={cx('icon')} />}
                        cmd="underline"
                    />

                    <CustomTippyPopper
                        className={cx('user-popper')}
                        interactive={true}
                        placement="bottom"
                        visible={popper}
                        // handleClosePopper={hide}
                        popperRender={
                            <div className="py-2 px-4">
                                <div className="d-flex-center-between normal-font">
                                    Font Color:
                                    <div className="d-flex-center">
                                        {colors.map((item, index) => (
                                            <button
                                                className={cx('color')}
                                                style={{ background: item }}
                                                onClick={() => handleChangeColor(index, 0)}
                                            >
                                                {colorSetting.foreBg === item && (
                                                    <Check className={cx(index === 1 ? '' : 'icon-check')} />
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div className="d-flex-align-center normal-font">
                                    Background Color:
                                    <div className="d-flex-center">
                                        {colors.map((item, index) => (
                                            <button
                                                className={cx('color')}
                                                style={{ background: item, borderColor: index === 1 ? 'orange' : item }}
                                                onClick={() => handleChangeColor(index, 1)}
                                            >
                                                {colorSetting.backBg === item && (
                                                    <Check className={cx(index === 1 ? '' : 'icon-check')} />
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        }
                    >
                        <button className={cx('btn')} onClick={() => setPopper(!popper)}>
                            <FormatColorText className={cx('icon')} />
                        </button>
                    </CustomTippyPopper>
                </div>
                <ContentEditable
                    ref={textRef}
                    className={cx('container')}
                    tagName="pre"
                    html={html}
                    // disabled={!editable}
                    onChange={handleChange}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                />
            </div>
        </div>
    );
}

function EditButton(props) {
    return (
        <button
            key={props.cmd}
            className={cx('btn', props.active[props.cmd] && 'btn-active')}
            onMouseDown={(evt) => {
                evt.preventDefault();
                document.execCommand(props.cmd, false, props.arg);
                props.handleClick();
            }}
        >
            {props.icon}
        </button>
    );
}
