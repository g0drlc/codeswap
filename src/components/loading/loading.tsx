import Image from "next/image";
import React from "react";

const Loading = () => {
  return (
    <div className='z-50 w-full h-screen flex justify-center items-center overflow-hidden'>
      <div>
        <div className="loader">
          <div className="bar1"></div>
          <div className="bar2"></div>
          <div className="bar3"></div>
          <div className="bar4"></div>
          <div className="bar5"></div>
          <div className="bar6"></div>
          <div className="bar7"></div>
          <div className="bar8"></div>
          <div className="bar9"></div>
          <div className="bar10"></div>
        </div>
        <div className="loading spinner mt-2">
          <span data-text="C">C</span>
          <span data-text="O">O</span>
          <span data-text="D">D</span>
          <span data-text="E">E</span>
        </div>
      </div>
    </div>
  )
};

export default Loading;