import React from "react";

const IconFont = ({ className, size, color, style, name, onClick }) => {
  return (
    <svg
      className={`icon ${className}`}
      aria-hidden="true"
      style={{ fontSize: `${size}px`, color: `${color}`, ...style }}
      onClick={onClick}
    >
      <use xlinkHref={`#icon-${name}`}> </use>
      <style jsx="true">
        {`
          .icon {
            width: 1em;
            height: 1em;
            vertical-align: -0.15em;
            fill: currentColor;
            overflow: hidden;
          }
        `}
      </style>
    </svg>
  );
};

export default IconFont;
