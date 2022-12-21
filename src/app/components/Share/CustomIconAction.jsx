import React from 'react';
import { IconButton, Tooltip } from '@mui/material';

function CustomIconAction(props) {
    const { icon, label = '', handleClick, className, children, arrow } = props;

    return (
        <Tooltip
            arrow={arrow ? arrow : false}
            title={label ? <span className="small-font">{label}</span> : ''}
            sx={{
                color: 'inherit',
                '&:hover': {
                    backgroundColor: '#e6e6e6',
                },
            }}
        >
            <IconButton className={className} onClick={handleClick}>
                {children ?? icon}
            </IconButton>
        </Tooltip>
    );
}

export default CustomIconAction;
