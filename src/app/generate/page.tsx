// src/app/generate/page.tsx - 팟캐스트 생성 페이지
"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mic,
  Brain,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Home,
  ArrowRight,
  Clock,
  Sparkles,
  Volume2,
  Play,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface TaskStatus {
  status: string;
  progress: number;
  message: string;
  audio_file?: string;
  download_url?: string;
  error?: string;
}

interface GenerationStep {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  minProgress: number;
  maxProgress: number;
}

export default function GeneratePage() {
  const [taskId, setTaskId] = useState<string | null>(null);
  const [status, setStatus] = useState<TaskStatus | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [isStarted, setIsStarted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const statusIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const router = useRouter();

  const steps: GenerationStep[] = [
    {
      id: "analyze",
      title: "이력서 분석",
      description: "AI가 이력서 내용을 분석하고 있습니다",
      icon: <Brain className="w-8 h-8" />,
      minProgress: 0,
      maxProgress: 25,
    },
    {
      id: "generate",
      title: "대화 생성",
      description: "AI가 면접 대화를 생성하고 있습니다",
      icon: <Sparkles className="w-8 h-8" />,
      minProgress: 25,
      maxProgress: 70,
    },
    {
      id: "voice",
      title: "음성 합성",
      description: "AI가 음성을 생성하고 있습니다",
      icon: <Volume2 className="w-8 h-8" />,
      minProgress: 70,
      maxProgress: 90,
    },
    {
      id: "finalize",
      title: "최종 처리",
      description: "오디오 파일을 마무리하고 있습니다",
      icon: <Volume2 className="w-8 h-8" />,
      minProgress: 90,
      maxProgress: 100,
    },
  ];

  // 경과 시간 추적
  useEffect(() => {
    if (isStarted && !intervalRef.current) {
      intervalRef.current = setInterval(() => {
        setElapsedTime((prev) => prev + 1);
      }, 1000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isStarted]);

  // 현재 단계 업데이트
  useEffect(() => {
    if (status) {
      const newStep = steps.findIndex(
        (step) =>
          status.progress >= step.minProgress &&
          status.progress < step.maxProgress
      );
      if (newStep !== -1 && newStep !== currentStep) {
        setCurrentStep(newStep);
      }
    }
  }, [status, currentStep]);

  // 팟캐스트 생성 시작
  const startGeneration = async () => {
    try {
      setIsStarted(true);
      setError(null);

      // localStorage에서 데이터 가져오기
      const resumeAnalysis = localStorage.getItem("resumeAnalysis");
      const interviewConfig = localStorage.getItem("interviewConfig");

      if (!resumeAnalysis || !interviewConfig) {
        throw new Error(
          "설정 정보를 찾을 수 없습니다. 처음부터 다시 시작해주세요."
        );
      }

      const analysis = JSON.parse(resumeAnalysis);
      const config = JSON.parse(interviewConfig);

      // FormData 생성
      const formData = new FormData();
      formData.append("resume_text", analysis.resume_text);
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

      // 팟캐스트 생성 요청
      const response = await fetch(
        "http://localhost:8000/api/generate-podcast",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("팟캐스트 생성 요청에 실패했습니다.");
      }

      const result = await response.json();
      setTaskId(result.task_id);

      // 상태 폴링 시작
      startStatusPolling(result.task_id);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다."
      );
      setIsStarted(false);
    }
  };

  // 상태 폴링
  const startStatusPolling = (id: string) => {
    statusIntervalRef.current = setInterval(async () => {
      try {
        const response = await fetch(
          `http://localhost:8000/api/task-status/${id}`
        );
        if (!response.ok) {
          throw new Error("상태 확인에 실패했습니다.");
        }

        const statusData: TaskStatus = await response.json();
        console.log("Status update:", statusData); // 디버깅용 로그 추가
        setStatus(statusData);

        if (statusData.status === "completed") {
          console.log("Task completed, redirecting..."); // 디버깅용 로그 추가
          // 완료 시 결과 페이지로 이동
          localStorage.setItem("podcastResult", JSON.stringify(statusData));
          if (statusIntervalRef.current) {
            clearInterval(statusIntervalRef.current);
            statusIntervalRef.current = null;
          }
          router.push("/result");
        } else if (statusData.status === "failed") {
          setError(statusData.error || "팟캐스트 생성에 실패했습니다.");
          if (statusIntervalRef.current) {
            clearInterval(statusIntervalRef.current);
            statusIntervalRef.current = null;
          }
        }
      } catch (err) {
        console.error("Status polling error:", err); // 디버깅용 로그 추가
        setError("상태 확인 중 오류가 발생했습니다.");
        if (statusIntervalRef.current) {
          clearInterval(statusIntervalRef.current);
          statusIntervalRef.current = null;
        }
      }
    }, 2000);
  };

  // 페이지 로드 시 자동 시작
  useEffect(() => {
    const resumeAnalysis = localStorage.getItem("resumeAnalysis");
    const interviewConfig = localStorage.getItem("interviewConfig");

    if (!resumeAnalysis || !interviewConfig) {
      router.push("/configure");
      return;
    }

    startGeneration();

    return () => {
      if (statusIntervalRef.current) {
        clearInterval(statusIntervalRef.current);
      }
    };
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const retry = () => {
    setError(null);
    setStatus(null);
    setTaskId(null);
    setElapsedTime(0);
    setCurrentStep(0);
    setIsStarted(false);
    startGeneration();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="relative z-10 p-6">
        <nav className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
              <Mic className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-white">
              Resume Podcast AI
            </span>
          </Link>

          <Link
            href="/"
            className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
          >
            <Home className="w-5 h-5" />
            홈으로
          </Link>
        </nav>
      </header>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              팟캐스트
            </span>
            <br />
            생성 중...
          </h1>
          <p className="text-xl text-gray-300">
            AI가 당신만의 면접 시뮬레이션을 만들고 있습니다
          </p>
        </motion.div>

        {/* 진행률 및 상태 */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="space-y-8"
        >
          {/* 전체 진행률 */}
          <div className="p-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-white">전체 진행률</h3>
              <div className="flex items-center gap-4 text-gray-300">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm">{formatTime(elapsedTime)}</span>
                </div>
                <span className="text-sm">{status?.progress || 0}%</span>
              </div>
            </div>

            <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${status?.progress || 0}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>

            {status && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-gray-300 text-sm mt-3"
              >
                {status.message}
              </motion.p>
            )}
          </div>

          {/* 단계별 진행 상황 */}
          <div className="grid md:grid-cols-2 gap-6">
            {steps.map((step, index) => {
              const isActive = index === currentStep;
              const isCompleted = (status?.progress || 0) > step.maxProgress;
              const isCurrent =
                (status?.progress || 0) >= step.minProgress &&
                (status?.progress || 0) <= step.maxProgress;

              return (
                <motion.div
                  key={step.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className={`
                    relative p-6 rounded-2xl transition-all duration-500
                    ${
                      isCompleted
                        ? "bg-green-500/20 border-green-500/30"
                        : isCurrent
                        ? "bg-purple-500/20 border-purple-500/30"
                        : "bg-white/5 border-white/10"
                    }
                  `}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`
                      p-3 rounded-xl transition-all duration-500
                      ${
                        isCompleted
                          ? "bg-green-500 text-white"
                          : isCurrent
                          ? "bg-purple-500 text-white"
                          : "bg-white/10 text-gray-400"
                      }
                    `}
                    >
                      {isCompleted ? (
                        <CheckCircle className="w-8 h-8" />
                      ) : (
                        <motion.div
                          animate={
                            isCurrent
                              ? {
                                  rotate: 360,
                                  scale: [1, 1.1, 1],
                                }
                              : {}
                          }
                          transition={{
                            rotate: {
                              duration: 2,
                              repeat: Infinity,
                              ease: "linear",
                            },
                            scale: { duration: 1, repeat: Infinity },
                          }}
                        >
                          {step.icon}
                        </motion.div>
                      )}
                    </div>

                    <div className="flex-1">
                      <h4
                        className={`
                        font-semibold mb-1 transition-colors duration-500
                        ${
                          isCompleted
                            ? "text-green-400"
                            : isCurrent
                            ? "text-purple-400"
                            : "text-gray-400"
                        }
                      `}
                      >
                        {step.title}
                      </h4>
                      <p className="text-gray-300 text-sm">
                        {step.description}
                      </p>
                    </div>

                    {isCompleted && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="text-green-400"
                      >
                        <CheckCircle className="w-6 h-6" />
                      </motion.div>
                    )}
                  </div>

                  {isCurrent && (
                    <motion.div
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                      style={{
                        width: `${
                          (((status?.progress || 0) - step.minProgress) /
                            (step.maxProgress - step.minProgress)) *
                          100
                        }%`,
                      }}
                    />
                  )}
                </motion.div>
              );
            })}
          </div>

          {/* 완료 상태 */}
          <AnimatePresence>
            {status?.status === "completed" && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="text-center p-8 bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-2xl"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full mb-6"
                >
                  <CheckCircle className="w-10 h-10 text-white" />
                </motion.div>

                <h2 className="text-3xl font-bold text-white mb-4">
                  🎉 팟캐스트 생성 완료!
                </h2>
                <p className="text-green-300 text-lg mb-6">
                  당신만의 면접 시뮬레이션이 준비되었습니다
                </p>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="flex items-center justify-center gap-4"
                >
                  <div className="flex items-center gap-2 text-green-400">
                    <Play className="w-5 h-5" />
                    <span>결과 페이지로 이동 중...</span>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* 에러 상태 */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="p-6 bg-red-500/10 border border-red-500/20 rounded-2xl"
              >
                <div className="flex items-center gap-3 mb-4">
                  <AlertCircle className="w-6 h-6 text-red-400" />
                  <h3 className="text-xl font-semibold text-red-400">
                    오류 발생
                  </h3>
                </div>
                <p className="text-red-300 mb-6">{error}</p>

                <div className="flex flex-col sm:flex-row gap-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={retry}
                    className="flex items-center justify-center gap-2 bg-red-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-600 transition-colors"
                  >
                    <RefreshCw className="w-5 h-5" />
                    다시 시도
                  </motion.button>

                  <Link href="/configure">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center justify-center gap-2 bg-white/10 text-white px-6 py-3 rounded-lg font-semibold hover:bg-white/20 transition-colors"
                    >
                      설정 수정
                      <ArrowRight className="w-5 h-5" />
                    </motion.button>
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* 팁 */}
        {isStarted && !error && status?.status !== "completed" && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="mt-12 p-6 bg-blue-500/10 border border-blue-500/20 rounded-2xl"
          >
            <div className="flex items-center gap-3 mb-3">
              <Sparkles className="w-5 h-5 text-blue-400" />
              <h4 className="font-semibold text-blue-400">생성 중 팁</h4>
            </div>
            <p className="text-gray-300 text-sm">
              AI가 당신의 이력서를 바탕으로 실제와 같은 면접 상황을 만들어내고
              있습니다. 생성 시간은 선택한 설정과 서버 상황에 따라 2-5분 정도
              소요될 수 있습니다.
            </p>
          </motion.div>
        )}
      </div>

      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" />
      </div>
    </div>
  );
}
