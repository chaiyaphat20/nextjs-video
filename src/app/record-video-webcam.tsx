'use client'
import React, { useEffect, useRef, useState } from "react";

const VideoRecorder: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const [recordedChunks, setRecordedChunks] = useState<Blob[]>([]);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        console.log("Permission granted");
      }
    } catch (err: any) {
      console.error("Permission denied:", err);
      setError("Please allow camera and microphone access in your browser settings.");
    }
  };

  const startRecording = (): void => {
    if (!videoRef.current || !videoRef.current.srcObject) {
      console.error("Camera stream is not available.");
      return;
    }

    const stream = videoRef.current.srcObject as MediaStream;
    const mediaRecorder = new MediaRecorder(stream, { mimeType: "video/webm" });

    mediaRecorder.ondataavailable = (event: BlobEvent) => {
      if (event.data.size > 0) {
        setRecordedChunks((prev) => [...prev, event.data]);
      }
    };

    mediaRecorder.start();
    mediaRecorderRef.current = mediaRecorder;
    setIsRecording(true);
  };

  const stopRecording = (): void => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const downloadVideo = (): void => {
    if (recordedChunks.length === 0) {
      console.error("No video data available.");
      return;
    }

    const blob = new Blob(recordedChunks, { type: "video/webm" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "recorded-video.webm";
    a.click();
    URL.revokeObjectURL(url);
  };

  useEffect(()=>{
    startCamera()
  },[])

  return (
    <div>
            {error && <p style={{ color: "red" }}>{error}</p>}

      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        style={{ width: "100%",height:"100%" }}
      />
      <div style={{backgroundColor:'red'}}>
        {isRecording ? (
          <button onClick={stopRecording}>Stop Recording</button>
        ) : (
          <button onClick={startRecording}>Start Recording</button>
        )}
        {recordedChunks.length > 0 && (
          <button onClick={downloadVideo}>Download Video</button>
        )}
      </div>
    </div>
  );
};

export default VideoRecorder;
