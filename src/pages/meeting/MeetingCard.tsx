import React from "react";

interface Meeting {
  id: number;
  title: string;
  start: string;
  status: "pending" | "accepted" | "declined";
}

interface Props {
  meeting: Meeting;
  updateStatus: (id: number, status: "accepted" | "declined") => void;
}

const MeetingCard: React.FC<Props> = ({ meeting, updateStatus }) => {
  const colors = {
    pending: "bg-yellow-100 text-yellow-800",
    accepted: "bg-green-100 text-green-800",
    declined: "bg-red-100 text-red-800",
  };

  return (
    <div
      className={`p-3 rounded mb-3 shadow flex justify-between items-center ${colors[meeting.status]}`}
    >
      <div>
        <p className="font-semibold">{meeting.title}</p>
        <p className="text-sm text-gray-600">
          {new Date(meeting.start).toLocaleDateString()} 
        </p>
      </div>
      {meeting.status === "pending" && (
        <div className="flex gap-2">
          <button
            onClick={() => updateStatus(meeting.id, "accepted")}
            className="px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Accept
          </button>
          <button
            onClick={() => updateStatus(meeting.id, "declined")}
            className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Decline
          </button>
        </div>
      )}
    </div>
  );
};

export default MeetingCard;