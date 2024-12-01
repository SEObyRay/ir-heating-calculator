import React from 'react';
import { Tooltip } from 'react-tooltip';
import { QuestionMarkCircleIcon } from '@heroicons/react/24/outline';

interface InfoIconProps {
  tooltip: string;
}

export const InfoIcon: React.FC<InfoIconProps> = ({ tooltip }) => {
  const id = `tooltip-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <>
      <span
        data-tooltip-id={id}
        className="inline-flex ml-1 text-blue-500 hover:text-blue-600 cursor-help"
      >
        <QuestionMarkCircleIcon className="h-4 w-4" />
      </span>
      <Tooltip
        id={id}
        place="top"
        className="max-w-xs bg-gray-900 text-white text-sm rounded px-2 py-1"
      >
        {tooltip}
      </Tooltip>
    </>
  );
};
