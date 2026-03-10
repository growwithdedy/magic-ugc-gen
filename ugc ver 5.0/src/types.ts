import React from 'react';

export interface VoiceOption {
  name: string;
  label: string;
  gender: string;
  style: string;
  langCode: string;
}

export interface LanguageOption {
  code: string;
  name: string;
}

export interface ToneOption {
  value: string;
  label: string;
  prompt: string;
}

export interface StoryboardType {
  value: string;
  label: string;
  icon: React.ReactNode;
  description: string;
}

export interface ProductImage {
  id: string;
  file: File;
  name: string;
}

export interface GeneratedImage {
  id: number;
  url: string;
  angle: string;
  videoPrompt: string;
  script: string;
  originalPrompt: string;
  customDetail?: string;
}

export interface ShotType {
  name: string;
  prompt: string;
  videoPrompt: string;
  script: string;
}

export interface ImageResolution {
  value: "1K" | "2K" | "4K";
  label: string;
  description: string;
}
