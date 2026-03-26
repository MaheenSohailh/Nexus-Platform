import React, { useState, useEffect } from "react";
import FullCalendar, { DateClickArg, EventInput } from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { gsap } from "gsap";
import MeetingCard from "../Meeting/MeetingCard";
import MeetingModal from "../Meeting/MeetingModal";

interface Meeting {
  id: number;
  title: string;
  start: string;
  status: "pending" | "accepted" | "declined";
}

const CalendarPage: React.FC = () => {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [nextId, setNextId] = useState(1);
  const [openModal, setOpenModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");

  useEffect(() => {
    const storedMeetings = localStorage.getItem("meetings");
    if (storedMeetings) {
      setMeetings(JSON.parse(storedMeetings));
    }
    gsap.from(".calendar-header", { y: -20, duration: 1 });
  }, []);

  const handleDateClick = (info: DateClickArg) => {
    setSelectedDate(info.dateStr);
    setOpenModal(true);
  };

const addMeeting = (title: string) => {
  const newMeeting = {
    id: Date.now(),
    title,
    start: selectedDate,
    status: "pending",
  };
  const updatedMeetings = [...meetings, newMeeting];
  setMeetings(updatedMeetings);
  localStorage.setItem("meetings", JSON.stringify(updatedMeetings));
  setOpenModal(false);
};

const updateStatus = (id: number, status: "accepted" | "declined") => {
  const updated = meetings.map((m) => (m.id === id ? { ...m, status } : m));
  setMeetings(updated);
  localStorage.setItem("meetings", JSON.stringify(updated));
};

  const clearMeetings = () => {
    setMeetings([]);
    localStorage.removeItem("meetings");
  };

  const events: EventInput[] = meetings.map((m) => ({
    title: `${m.title} (${m.status})`,
    start: m.start,
    color:
      m.status === "accepted"
        ? "#22c55e"
        : m.status === "declined"
        ? "#ef4444"
        : "#facc15",
  }));

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-4">
        <h2 className="calendar-header text-3xl font-bold text-primary-600">
          Meeting Scheduling Calendar
        </h2>
        <button
          onClick={clearMeetings}
          className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Clear Meetings
        </button>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Calendar */}
        <div className="md:col-span-2 bg-white shadow-lg rounded-lg p-4">
          <FullCalendar
            plugins={[dayGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            dateClick={handleDateClick}
            events={events}
            height="70vh"
          />
        </div>

        {/* Upcoming meetings */}
        <div className="bg-white shadow-lg rounded-lg p-4 max-h-[70vh] overflow-y-auto animate__animated animate__bounceInRight">
          <h3 className="text-xl font-semibold mb-4 text-primary-600">
            Upcoming Meetings
          </h3>

          {meetings.length === 0 ? (
            <p>No meetings scheduled</p>
          ) : (
            meetings.map((m) => (
              <MeetingCard
                key={m.id}
                meeting={m}
                updateStatus={updateStatus}
              />
            ))
          )}
        </div>
      </div>

      {/* Modal */}
      <MeetingModal
        isOpen={openModal}
        onClose={() => setOpenModal(false)}
        onSave={addMeeting}
      />
    </div>
  );
};

export default CalendarPage;