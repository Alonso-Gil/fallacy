import { useCallback, useEffect, useRef, useState } from "react";

export type MediaDeviceState = {
  audioEnabled: boolean;
  videoEnabled: boolean;
  audioStream: MediaStream | null;
  videoStream: MediaStream | null;
  error: string | null;
  isPermissionsGranted: boolean;
};

const initialState: MediaDeviceState = {
  audioEnabled: false,
  videoEnabled: false,
  audioStream: null,
  videoStream: null,
  error: null,
  isPermissionsGranted: false
};

export const useMediaDevices = () => {
  const [state, setState] = useState<MediaDeviceState>(initialState);
  const streamRef = useRef<MediaStream | null>(null);

  const requestPermissions = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true
      });

      setState({
        audioEnabled: true,
        videoEnabled: true,
        audioStream: stream,
        videoStream: stream,
        error: null,
        isPermissionsGranted: true
      });

      return stream;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to access media devices";
      setState(prev => ({
        ...prev,
        error: errorMessage,
        isPermissionsGranted: false
      }));
      return null;
    }
  }, []);

  const requestMicPermission = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: false
      });

      setState(prev => ({
        ...prev,
        audioEnabled: true,
        audioStream: stream,
        error: null,
        isPermissionsGranted: true
      }));

      return stream;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Microphone access denied";
      setState(prev => ({
        ...prev,
        audioEnabled: false,
        audioStream: null,
        error: errorMessage,
        isPermissionsGranted: false
      }));
      return null;
    }
  }, []);

  const toggleAudio = useCallback(() => {
    if (state.audioStream) {
      const audioTrack = state.audioStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setState(prev => ({ ...prev, audioEnabled: audioTrack.enabled }));
      }
    }
  }, [state.audioStream]);

  const toggleVideo = useCallback(() => {
    if (state.videoStream) {
      const videoTrack = state.videoStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setState(prev => ({ ...prev, videoEnabled: videoTrack.enabled }));
      }
    }
  }, [state.videoStream]);

  const setStream = useCallback((stream: MediaStream | null) => {
    streamRef.current = stream;
  }, []);

  const stopAll = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setState(initialState);
  }, []);

  useEffect(() => {
    streamRef.current = state.audioStream || state.videoStream;
  }, [state.audioStream, state.videoStream]);

  useEffect(() => {
    return () => {
      streamRef.current?.getTracks().forEach(track => track.stop());
    };
  }, []);

  return {
    ...state,
    requestPermissions,
    requestMicPermission,
    toggleAudio,
    toggleVideo,
    setStream,
    stopAll
  };
};
