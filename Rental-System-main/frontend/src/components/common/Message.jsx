import React from "react";
import {
  CheckCircleIcon,
  XCircleIcon,
  InformationCircleIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";

const Message = ({ type = "info", message, onClose }) => {
  const config = {
    info: {
      icon: InformationCircleIcon,
      bgColor: "bg-blue-50",
      textColor: "text-blue-800",
      borderColor: "border-blue-200",
      iconColor: "text-blue-400",
    },
    success: {
      icon: CheckCircleIcon,
      bgColor: "bg-green-50",
      textColor: "text-green-800",
      borderColor: "border-green-200",
      iconColor: "text-green-400",
    },
    warning: {
      icon: ExclamationTriangleIcon,
      bgColor: "bg-yellow-50",
      textColor: "text-yellow-800",
      borderColor: "border-yellow-200",
      iconColor: "text-yellow-400",
    },
    error: {
      icon: XCircleIcon,
      bgColor: "bg-red-50",
      textColor: "text-red-800",
      borderColor: "border-red-200",
      iconColor: "text-red-400",
    },
  };

  const {
    icon: Icon,
    bgColor,
    textColor,
    borderColor,
    iconColor,
  } = config[type];

  return (
    <div className={`${bgColor} border ${borderColor} rounded-lg p-4 mb-4`}>
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <Icon className={`h-5 w-5 ${iconColor}`} aria-hidden="true" />
        </div>
        <div className="ml-3 flex-1">
          <p className={`text-sm font-medium ${textColor}`}>{message}</p>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="ml-4 flex-shrink-0 text-gray-400 hover:text-gray-500"
          >
            <span className="sr-only">Close</span>
            <XCircleIcon className="h-5 w-5" aria-hidden="true" />
          </button>
        )}
      </div>
    </div>
  );
};

export default Message;
