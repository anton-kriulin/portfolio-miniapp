import React from "react";
export const AddIcon = ({
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
      <path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z"/>
    </svg>
  );
};