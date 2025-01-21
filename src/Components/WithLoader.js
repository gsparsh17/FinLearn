import React, { useState, useEffect } from "react";
import Loader from "./Loader";
import "../Styles/withLoader.css";

function withLoader(WrappedComponent) {
  return function LoaderWrapper(props) {
    const [loading, setLoading] = useState(true); // Whether to display the loader
    const [fadeOut, setFadeOut] = useState(false); // Whether fade-out animation starts

    useEffect(() => {
      const fadeOutTimer = setTimeout(() => setFadeOut(true), 4800);
      const loaderTimer = setTimeout(() => setLoading(false), 5000);

      return () => {
        clearTimeout(fadeOutTimer);
        clearTimeout(loaderTimer);
      };
    }, []);

    return (
      <>
        {loading ? (
          <div className={`fade-container ${fadeOut ? "fade-out" : "fade-in"}`}>
            <Loader />
          </div>
        ) : (
          <WrappedComponent {...props} />
        )}
      </>
    );
  };
}

export default withLoader;
