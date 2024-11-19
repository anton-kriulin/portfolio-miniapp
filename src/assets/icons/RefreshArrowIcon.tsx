import React, { ReactNode } from "react";
export const RefreshArrowIcon = ({
  fill = 'currentColor',
  filled,
  size,
  height,
  width,
  label,
  ...props
}: { [key:string]: any}) => {
    
  return (
    <svg
      width={size || width || 24}
      height={size || height || 24}
      viewBox="0 -960 960 960"
      fill={fill}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="M480-200 240-440l56-56 184 183 184-183 56 56-240 240Zm0-240L240-680l56-56 184 183 184-183 56 56-240 240Z" fill={fill}/>
    </svg>
  );
};