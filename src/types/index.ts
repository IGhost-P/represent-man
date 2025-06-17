// src/types/index.ts - 타입 정의들

export interface ResumeAnalysis {
  resume_text: string;
  word_count: number;
  detected_skills: string[];
  experience_level: string;
  suggested_interview_type: string;
  key_projects: string[];
  analysis_summary: string;
}

export interface InterviewConfig {
  interview_type: "tech" | "design" | "business" | "marketing" | "sales";
  difficulty_level: "junior" | "mid" | "senior" | "executive";
  tts_model: "openai" | "elevenlabs" | "edge";
  word_count: number;
  creativity_level: number;
  gemini_api_key?: string;
  openai_api_key?: string;
  elevenlabs_api_key?: string;
}

export interface TaskStatus {
  status: "started" | "processing" | "completed" | "failed";
  progress: number;
  message: string;
  audio_file?: string;
  download_url?: string;
  error?: string;
  created_at?: string;
  completed_at?: string;
  failed_at?: string;
}

export interface PodcastResult {
  task_id: string;
  status: string;
  progress: number;
  message: string;
  audio_file?: string;
  download_url?: string;
  completed_at?: string;
  error?: string;
}

export interface InterviewType {
  id: string;
  name: string;
  description: string;
  icon: string;
  gradient: string;
  features: string[];
}

export interface DifficultyLevel {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
}

export interface TTSModel {
  id: string;
  name: string;
  description: string;
  icon: string;
  quality: "Basic" | "Premium" | "Ultra";
  cost: "Free" | "Paid";
}

export interface GenerationStep {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  minProgress: number;
  maxProgress: number;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface UploadedFile {
  name: string;
  size: number;
  type: string;
  lastModified: number;
}

export interface SharePlatform {
  id: string;
  name: string;
  icon: React.ReactNode;
  color: string;
  action: (url: string, text: string) => void;
}
