"use client";
import React, { useRef, useState } from "react";
import Webcam from "react-webcam";

const VideoRecorder: React.FC = () => {
  const webcamRef = useRef<Webcam>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const [capturedChunks, setCapturedChunks] = useState<Blob[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [videoURL, setVideoURL] = useState<string | null>(null); // State for the recorded video URL

  // Video constraints to use the rear camera
  const videoConstraints = {
    facingMode: "environment",
  };

  const getSupportedMimeType = (): string | undefined => {
    const possibleTypes = ["video/webm;codecs=vp8", "video/mp4"];
    return possibleTypes.find((type) => MediaRecorder.isTypeSupported(type));
  };

  const startRecording = () => {
    const stream = webcamRef.current?.stream;

    if (stream) {
      const mimeType = getSupportedMimeType() || "";
      try {
        const mediaRecorder = new MediaRecorder(stream, { mimeType });
        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            setCapturedChunks((prevChunks) => [...prevChunks, event.data]);
          }
        };

        mediaRecorder.start();
        mediaRecorderRef.current = mediaRecorder;
        setIsRecording(true);
      } catch (err) {
        console.error("Failed to start MediaRecorder:", err);
      }
    } else {
      console.error("Webcam stream not available");
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setIsRecording(false);
  };

  const downloadVideo = () => {
    if (capturedChunks.length > 0) {
      const mimeType = "video/webm"; // ใช้ MIME type ที่รองรับเบราว์เซอร์
      const blob = new Blob(capturedChunks, { type: mimeType });
      const url = URL.createObjectURL(blob);

      setVideoURL(url); // ตั้ง URL สำหรับแสดงวิดีโอ

      console.log("Video URL:", url);
    } else {
      console.error("No video to download");
      alert("No video to download");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>
        React Webcam Video Recorder (Rear Camera):{getSupportedMimeType()}
      </h1>

      {/* Webcam View */}
      <Webcam
        ref={webcamRef}
        audio
        videoConstraints={videoConstraints}
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
      <h1>{videoURL}</h1>
      <div style={{ marginTop: "20px" }}>
        {/* Display Recorded Video */}
        {videoURL && (
          <div>
            <h3>Recorded Video:</h3>
            <video controls>
              <source src={videoURL} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoRecorder;
