'use client'

import React, { useRef, useState } from "react";
import Webcam from "react-webcam";

const VideoRecorder: React.FC = () => {
  const webcamRef = useRef<Webcam>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const [capturedChunks, setCapturedChunks] = useState<Blob[]>([]);
  const [isRecording, setIsRecording] = useState(false);

  // Video constraints to use the rear camera
  const videoConstraints = {
    facingMode: "environment",
  };

  // Start Recording
  const startRecording = () => {
    const stream = webcamRef.current?.stream;

    if (stream) {
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: "video/webm",
      });

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          setCapturedChunks((prevChunks) => [...prevChunks, event.data]);
        }
      };

      mediaRecorder.start();
      mediaRecorderRef.current = mediaRecorder;
      setIsRecording(true);
    } else {
      console.error("Webcam stream not available");
    }
  };

  // Stop Recording
  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setIsRecording(false);
  };

  // Download Recorded Video
  const downloadVideo = () => {
    if (capturedChunks.length > 0) {
      const blob = new Blob(capturedChunks, { type: "video/webm" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "recorded-video.webm";
      a.click();
      URL.revokeObjectURL(url);
    } else {
      console.error("No video to download");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>React Webcam Video Recorder (Rear Camera)</h1>

      {/* Webcam View */}
      <Webcam
        ref={webcamRef}
        audio
        videoConstraints={videoConstraints} // Use the rear camera
        style={{
          width: "100%",
          height: "auto",
          border: "1px solid black",
        }}
      />

      <div style={{ marginTop: "20px" }}>
        {/* Recording Buttons */}
        {isRecording ? (
          <button onClick={stopRecording}>Stop Recording</button>
        ) : (
          <button onClick={startRecording}>Start Recording</button>
        )}

        {/* Download Button */}
        {capturedChunks.length > 0 && (
          <button onClick={downloadVideo}>Download Video</button>
        )}
      </div>
    </div>
  );
};

export default VideoRecorder;
