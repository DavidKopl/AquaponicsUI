import React from 'react';

export const Quote = () => {
  return (
    <blockquote className="text-2xl font-semibold italic text-center text-slate-900">
      Moderní zemědělství
      <span className="before:block before:absolute before:-inset-1 before:-skew-y-3 before:bg-green-500 relative inline-block ml-2 mr-2">
        <span className="relative text-white">začíná</span>
      </span>
      kde data přicházejí
    </blockquote>
  );
};
