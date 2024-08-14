'use client'
import SnackbarProvider from "@/utils/custom.snackbar";
import { createContext, useContext, useState } from "react";
export const ToastContext = createContext<IToastContext | null>(null);
export const ToastContextProvider = ({ children }: { children: React.ReactNode }) => {
    const initialValue = {
        messageSnackbar: "",
        severity: undefined
    }
    const [currentToast, setCurrentToast] = useState<IShareToast>(initialValue);
    const [openToast, setOpenToast] = useState<boolean>(false);

    return (
        <ToastContext.Provider value={{ currentToast, setCurrentToast, openToast, setOpenToast }}>
            {children}
            <SnackbarProvider
                open={openToast}
                setOpen={setOpenToast}
                messageSnackbar={currentToast.messageSnackbar}
                severity={currentToast.severity}
            />
        </ToastContext.Provider>
    )
};
export const useToastContext = () => useContext(ToastContext);