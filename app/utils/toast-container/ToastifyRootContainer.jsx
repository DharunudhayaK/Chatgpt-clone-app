"use client";

import { cssTransition, ToastContainer } from "react-toastify";

const Fade = cssTransition({
  enter: "fadeIn",
  exit: "fadeOut",
  duration: [200, 400],
});

const CustomToastContainer = () => {
  return (
    <ToastContainer
      position="top-center"
      autoClose={1000}
      closeOnClick
      pauseOnHover
      draggable
      theme="colored"
      transition={Fade}
    />
  );
};

export default CustomToastContainer;
