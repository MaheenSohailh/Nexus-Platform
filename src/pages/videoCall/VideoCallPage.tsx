import React, { useRef, useState } from "react";
import { Mic, MicOff, Video, VideoOff, Phone, PhoneOff, ScreenShare } from "lucide-react";

const VideoCallPage: React.FC = () => {

  const localVideo = useRef<HTMLVideoElement>(null);
  const remoteVideo = useRef<HTMLVideoElement>(null);

  const [stream, setStream] = useState<MediaStream | null>(null);
  const [inCall, setInCall] = useState(false);
  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);

  // Start camera
  const startCall = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });

      if (localVideo.current) {
        localVideo.current.srcObject = mediaStream;
      }

      if (remoteVideo.current) {
        remoteVideo.current.srcObject = mediaStream;
      }

      setStream(mediaStream);
      setInCall(true);

    } catch {
      alert("Camera permission denied");
    }
  };

  // End call
  const endCall = () => {
    stream?.getTracks().forEach(track => track.stop());
    setStream(null);
    setInCall(false);
  };

  // Toggle mic
  const toggleMic = () => {
    if (!stream) return;

    stream.getAudioTracks().forEach(track => {
      track.enabled = !track.enabled;
    });

    setMicOn(!micOn);
  };

  // Toggle camera
  const toggleCamera = () => {
    if (!stream) return;

    stream.getVideoTracks().forEach(track => {
      track.enabled = !track.enabled;
    });

    setCamOn(!camOn);
  };

  // Screen share
  const shareScreen = async () => {
    try {
      const screenStream = await navigator.mediaDevices.getDisplayMedia({
        video: true
      });

      if (localVideo.current) {
        localVideo.current.srcObject = screenStream;
      }

    } catch {
      alert("Screen share cancelled");
    }
  };

  return (
    <div className="p-6 min-h-screen bg-gray-100 flex flex-col items-center">

      <h2 className="text-3xl font-bold mb-6 text-primary-600">
        Video Meeting Room
      </h2>

      {/* Video layout */}
      <div className="grid md:grid-cols-2 gap-6 w-full max-w-5xl mb-6">

        {/* Local video */}
        <div className="bg-black rounded-lg overflow-hidden h-80">
          <video
            ref={localVideo}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
          />
        </div>

        {/* Remote video */}
        <div className="bg-black rounded-lg overflow-hidden h-80">
          <video
            ref={remoteVideo}
            autoPlay
            playsInline
            className="w-full h-full object-cover"
          />
        </div>

      </div>

      {/* Controls */}
      <div className="flex gap-4">

        {!inCall && (
          <button
            onClick={startCall}
            className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            <Phone size={18}/> Start Call
          </button>
        )}

        {inCall && (
          <button
            onClick={endCall}
            className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            <PhoneOff size={18}/> End Call
          </button>
        )}

        {inCall && (
          <button
            onClick={toggleMic}
            className="p-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            {micOn ? <Mic/> : <MicOff/>}
          </button>
        )}

        {inCall && (
          <button
            onClick={toggleCamera}
            className="p-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            {camOn ? <Video/> : <VideoOff/>}
          </button>
        )}

        {inCall && (
          <button
            onClick={shareScreen}
            className="p-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            <ScreenShare/>
          </button>
        )}

      </div>

    </div>
  );
};

export default VideoCallPage;