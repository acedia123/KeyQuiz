import { createContext, useState } from 'react';
import CustomToast from '../components/Toast/CustomToast';
export const ToastContext = createContext();

export const ToastContextProvider = ({ children }) => {
    const [dataAlert, setDataAlert] = useState({
        vertical: 'top',
        horizontal: 'right',
        duration: 6000,
        isOpen: false,
        message: '',
        status: 'info',
    });

    const handleClose = () => {
        setDataAlert({ ...dataAlert, isOpen: false });
    };
    return (
        <ToastContext.Provider value={{ dataAlert, setDataAlert }}>
            {children}
            <CustomToast data={dataAlert} handleClose={handleClose} />
        </ToastContext.Provider>
    );
};
