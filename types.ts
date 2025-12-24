export interface CapturedFrame {
  id: string;
  dataUrl: string;
  timestamp: number;
  width: number;
  height: number;
  format: 'image/png' | 'image/jpeg';
}

export interface VideoState {
  src: string;
  file: File;
  name: string;
}

export enum ExportFormat {
  PNG = 'image/png',
  JPEG = 'image/jpeg',
}

export enum CaptureResolution {
  ORIGINAL = 'original',
  HD_1080P = '1080p',
  HD_720P = '720p',
}