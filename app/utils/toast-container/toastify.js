import { toast } from "react-toastify";

const toastOptions = {
  position: "top-center",
  autoClose: 2000,
  hideProgressBar: true,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  theme: "colored",
};

export const showSuccessToast = (message) => {
  toast.success(message, { ...toastOptions, className: "toast-success" });
};

export const showInfoToast = (message) => {
  toast.info(message, { ...toastOptions, className: "toast-info" });
};

export const showWarningToast = (message) => {
  toast.warn(message, { ...toastOptions, className: "toast-warning" });
};

export const showErrorToast = (message) => {
  toast.error(message, { ...toastOptions, className: "toast-error" });
};
