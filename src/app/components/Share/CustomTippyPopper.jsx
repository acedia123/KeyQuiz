import React, { useEffect, useState } from 'react';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';

function CustomTippyPopper(props) {
    const { visible, interactive = false, popperRender, children, handleClosePopper, placement, className } = props;

    let [key, setKey] = useState(0);

    useEffect(() => {
        setKey((preState) => (preState += 1));
    }, [visible]);

    return (
        <Tippy
            key={key}
            interactive={interactive}
            visible={visible}
            placement={placement}
            render={(attrs) => (
                <div className={className} id="tooltip" tabIndex="-1" {...attrs}>
                    <div className="Popper">{popperRender}</div>
                </div>
            )}
            onClickOutside={handleClosePopper}
        >
            {children}
        </Tippy>
    );
}

export default CustomTippyPopper;
