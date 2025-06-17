// src/lib/utils.ts - 유틸리티 함수들

import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import {
  ResumeAnalysis,
  InterviewConfig,
  TaskStatus,
  PodcastResult,
} from "@/types";

// Tailwind CSS 클래스 병합
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// API 기본 URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// ==================== API 함수들 ====================

// 이력서 분석
export async function analyzeResume(file: File): Promise<ResumeAnalysis> {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${API_BASE_URL}/api/analyze-resume`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || "Failed to analyze resume");
  }

  return response.json();
}

// 팟캐스트 생성 시작
export async function generatePodcast(
  resumeText: string,
  config: InterviewConfig
): Promise<{ task_id: string; message: string }> {
  const formData = new FormData();

  formData.append("resume_text", resumeText);
  formData.append("interview_type", config.interview_type);
  formData.append("difficulty_level", config.difficulty_level);
  formData.append("tts_model", config.tts_model);
  formData.append("word_count", config.word_count.toString());
  formData.append("creativity_level", config.creativity_level.toString());

  if (config.gemini_api_key) {
    formData.append("gemini_api_key", config.gemini_api_key);
  }
  if (config.openai_api_key) {
    formData.append("openai_api_key", config.openai_api_key);
  }
  if (config.elevenlabs_api_key) {
    formData.append("elevenlabs_api_key", config.elevenlabs_api_key);
  }

  const response = await fetch(`${API_BASE_URL}/api/generate-podcast`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || "Failed to start podcast generation");
  }

  return response.json();
}

// 작업 상태 확인
export async function getTaskStatus(taskId: string): Promise<TaskStatus> {
  const response = await fetch(`${API_BASE_URL}/api/task-status/${taskId}`);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || "Failed to get task status");
  }

  return response.json();
}

// 오디오 다운로드 URL 생성
export function getDownloadUrl(taskId: string): string {
  return `${API_BASE_URL}/api/download-audio/${taskId}`;
}

// ==================== 로컬스토리지 관리 ====================

export const storage = {
  // 이력서 분석 결과 저장/불러오기
  setResumeAnalysis: (analysis: ResumeAnalysis) => {
    localStorage.setItem("resumeAnalysis", JSON.stringify(analysis));
  },

  getResumeAnalysis: (): ResumeAnalysis | null => {
    const stored = localStorage.getItem("resumeAnalysis");
    return stored ? JSON.parse(stored) : null;
  },

  // 면접 설정 저장/불러오기
  setInterviewConfig: (config: InterviewConfig) => {
    localStorage.setItem("interviewConfig", JSON.stringify(config));
  },

  getInterviewConfig: (): InterviewConfig | null => {
    const stored = localStorage.getItem("interviewConfig");
    return stored ? JSON.parse(stored) : null;
  },

  // 팟캐스트 결과 저장/불러오기
  setPodcastResult: (result: PodcastResult) => {
    localStorage.setItem("podcastResult", JSON.stringify(result));
  },

  getPodcastResult: (): PodcastResult | null => {
    const stored = localStorage.getItem("podcastResult");
    return stored ? JSON.parse(stored) : null;
  },

  // 모든 데이터 삭제
  clearAll: () => {
    localStorage.removeItem("resumeAnalysis");
    localStorage.removeItem("interviewConfig");
    localStorage.removeItem("podcastResult");
  },
};

// ==================== 시간 포맷팅 ====================

// 초를 MM:SS 형식으로 변환
export function formatTime(seconds: number): string {
  if (isNaN(seconds) || seconds < 0) return "0:00";

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
}

// 초를 HH:MM:SS 형식으로 변환 (긴 오디오용)
export function formatDuration(seconds: number): string {
  if (isNaN(seconds) || seconds < 0) return "0:00:00";

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, "0")}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
  }

  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
}

// 상대 시간 표시 (예: "2분 전")
export function timeAgo(date: string | Date): string {
  const now = new Date();
  const past = new Date(date);
  const diff = now.getTime() - past.getTime();

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days}일 전`;
  if (hours > 0) return `${hours}시간 전`;
  if (minutes > 0) return `${minutes}분 전`;
  return "방금 전";
}

// ==================== 파일 처리 ====================

// 파일 크기를 읽기 쉬운 형식으로 변환
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 B";

  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));

  return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
}

// 파일 타입 검증
export function validateFileType(file: File): {
  valid: boolean;
  error?: string;
} {
  const allowedTypes = [
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/msword",
  ];

  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: "PDF 또는 Word 문서만 업로드 가능합니다.",
    };
  }

  const maxSize = 10 * 1024 * 1024; // 10MB
  if (file.size > maxSize) {
    return {
      valid: false,
      error: "파일 크기는 10MB 이하여야 합니다.",
    };
  }

  return { valid: true };
}

// ==================== URL 및 공유 ====================

// 현재 페이지 URL 가져오기
export function getCurrentUrl(): string {
  if (typeof window !== "undefined") {
    return window.location.href;
  }
  return "";
}

// 클립보드에 텍스트 복사
export async function copyToClipboard(text: string): Promise<boolean> {
  if (typeof navigator !== "undefined" && navigator.clipboard) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (err) {
      console.error("Failed to copy to clipboard:", err);
      return false;
    }
  }
  return false;
}

// 소셜 미디어 공유 URL 생성
export const shareUrls = {
  twitter: (url: string, text: string) =>
    `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      text
    )}&url=${encodeURIComponent(url)}`,

  facebook: (url: string) =>
    `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,

  linkedin: (url: string, title: string) =>
    `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
      url
    )}&title=${encodeURIComponent(title)}`,

  kakao: (url: string, text: string) =>
    `https://story.kakao.com/share?url=${encodeURIComponent(
      url
    )}&text=${encodeURIComponent(text)}`,
};

// ==================== 에러 처리 ====================

// API 에러 메시지 파싱
export function parseErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === "string") {
    return error;
  }

  if (error && typeof error === "object" && "message" in error) {
    return String(error.message);
  }

  return "알 수 없는 오류가 발생했습니다.";
}

// ==================== 프로그레스 상태 ====================

// 진행률에 따른 색상 클래스 반환
export function getProgressColor(progress: number): string {
  if (progress < 25) return "from-red-500 to-orange-500";
  if (progress < 50) return "from-orange-500 to-yellow-500";
  if (progress < 75) return "from-yellow-500 to-blue-500";
  if (progress < 100) return "from-blue-500 to-purple-500";
  return "from-green-500 to-emerald-500";
}

// 상태에 따른 아이콘 반환
export function getStatusIcon(status: string): string {
  switch (status) {
    case "started":
      return "🚀";
    case "processing":
      return "⚡";
    case "completed":
      return "🎉";
    case "failed":
      return "❌";
    default:
      return "📄";
  }
}

// ==================== 디바운스 ====================

// 디바운스 함수
export function debounce<T extends (...args: any[]) => void>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;

  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

// ==================== 기타 유틸리티 ====================

// 랜덤 ID 생성
export function generateId(): string {
  return Math.random().toString(36).substr(2, 9);
}

// 배열 랜덤 셔플
export function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

// 텍스트 트런케이트
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + "...";
}

// 한국어 조사 처리
export function addJosa(
  word: string,
  josa: "을/를" | "이/가" | "은/는"
): string {
  const lastChar = word.charAt(word.length - 1);
  const code = lastChar.charCodeAt(0);

  // 한글이 아닌 경우
  if (code < 0xac00 || code > 0xd7a3) {
    return word + (josa === "을/를" ? "을" : josa === "이/가" ? "가" : "는");
  }

  // 받침 여부 확인
  const hasJongseong = (code - 0xac00) % 28 !== 0;

  switch (josa) {
    case "을/를":
      return word + (hasJongseong ? "을" : "를");
    case "이/가":
      return word + (hasJongseong ? "이" : "가");
    case "은/는":
      return word + (hasJongseong ? "은" : "는");
    default:
      return word;
  }
}
