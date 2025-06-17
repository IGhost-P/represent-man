// src/app/configure/page.tsx - 면접 설정 페이지
"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Settings,
  Brain,
  Mic,
  Star,
  Zap,
  ArrowRight,
  Home,
  Eye,
  EyeOff,
  Lightbulb,
  Target,
  Volume2,
  Key,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface InterviewConfig {
  interview_type: string;
  difficulty_level: string;
  tts_model: string;
  word_count: number;
  creativity_level: number;
  gemini_api_key?: string;
  openai_api_key?: string;
  elevenlabs_api_key?: string;
}

export default function ConfigurePage() {
  const [config, setConfig] = useState<InterviewConfig>({
    interview_type: "tech",
    difficulty_level: "mid",
    tts_model: "openai",
    word_count: 2000,
    creativity_level: 0.7,
  });
  const [showApiKeys, setShowApiKeys] = useState(false);
  const [isValid, setIsValid] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Gemini API 키는 필수, TTS 모델에 따라 추가 키 필요
    const hasGeminiKey =
      config.gemini_api_key && config.gemini_api_key.trim().length > 0;

    let hasTTSKey = true;
    if (config.tts_model === "openai") {
      hasTTSKey = Boolean(
        config.openai_api_key && config.openai_api_key.trim().length > 0
      );
    } else if (config.tts_model === "elevenlabs") {
      hasTTSKey = Boolean(
        config.elevenlabs_api_key && config.elevenlabs_api_key.trim().length > 0
      );
    }
    // edge는 API 키 불필요

    setIsValid(Boolean(hasGeminiKey && hasTTSKey));
  }, [config]);

  const interviewTypes = [
    {
      id: "tech",
      name: "기술 면접",
      description: "개발자를 위한 기술 중심 면접",
      icon: "💻",
      gradient: "from-blue-500 to-purple-600",
      features: ["알고리즘 문제", "프로젝트 경험", "기술 스택"],
    },
    {
      id: "design",
      name: "디자인 면접",
      description: "디자이너를 위한 창의성 중심 면접",
      icon: "🎨",
      gradient: "from-pink-500 to-orange-500",
      features: ["포트폴리오 리뷰", "디자인 프로세스", "사용자 경험"],
    },
    {
      id: "business",
      name: "비즈니스 면접",
      description: "비즈니스 전략과 분석 중심 면접",
      icon: "📊",
      gradient: "from-green-500 to-teal-600",
      features: ["전략적 사고", "시장 분석", "리더십"],
    },
  ];

  const difficultyLevels = [
    {
      id: "junior",
      name: "신입/주니어",
      description: "기본적이고 격려적인 분위기",
      icon: "🌱",
      color: "text-green-400",
    },
    {
      id: "mid",
      name: "중급",
      description: "실무 경험과 성장 가능성 중심",
      icon: "⚡",
      color: "text-yellow-400",
    },
    {
      id: "senior",
      name: "시니어",
      description: "심화된 질문과 리더십 경험",
      icon: "🔥",
      color: "text-red-400",
    },
  ];

  const ttsModels = [
    {
      id: "openai",
      name: "OpenAI TTS",
      description: "고품질 음성, API 키 필요",
      icon: "🎙️",
      quality: "Premium",
      cost: "Paid",
    },
    {
      id: "elevenlabs",
      name: "ElevenLabs",
      description: "최고 품질 음성, API 키 필요",
      icon: "🌟",
      quality: "Ultra",
      cost: "Paid",
    },
    {
      id: "edge",
      name: "Edge TTS",
      description: "무료 음성, 기본 품질",
      icon: "🆓",
      quality: "Basic",
      cost: "Free",
    },
  ];

  const handleProceed = () => {
    // 설정을 localStorage에 저장
    localStorage.setItem("interviewConfig", JSON.stringify(config));
    router.push("/generate");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="relative z-10 p-6">
        <nav className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
              <Settings className="w-6 h-6 text-white" />
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
      <div className="max-w-6xl mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            면접
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              설정
            </span>
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            당신에게 맞는 면접 유형과 설정을 선택하여 최적화된 면접 시뮬레이션을
            경험해보세요.
          </p>
        </motion.div>

        <div className="space-y-12">
          {/* 면접 유형 선택 */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <Target className="w-6 h-6 text-purple-400" />
              <h2 className="text-2xl font-bold text-white">면접 유형 선택</h2>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {interviewTypes.map((type, index) => (
                <motion.div
                  key={type.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() =>
                    setConfig((prev) => ({ ...prev, interview_type: type.id }))
                  }
                  className={`
                    relative p-6 rounded-2xl cursor-pointer transition-all duration-300
                    ${
                      config.interview_type === type.id
                        ? `bg-gradient-to-br ${type.gradient} shadow-2xl`
                        : "bg-white/5 hover:bg-white/10 border border-white/10"
                    }
                  `}
                >
                  <div className="text-center">
                    <div className="text-4xl mb-4">{type.icon}</div>
                    <h3 className="text-xl font-bold text-white mb-2">
                      {type.name}
                    </h3>
                    <p className="text-gray-300 text-sm mb-4">
                      {type.description}
                    </p>

                    <div className="flex flex-wrap gap-1 justify-center">
                      {type.features.map((feature) => (
                        <span
                          key={feature}
                          className="px-2 py-1 bg-white/20 text-white text-xs rounded-full"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>

                  {config.interview_type === type.id && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute top-4 right-4"
                    >
                      <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                        <div className="w-3 h-3 bg-green-500 rounded-full" />
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* 난이도 선택 */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <Lightbulb className="w-6 h-6 text-yellow-400" />
              <h2 className="text-2xl font-bold text-white">난이도 선택</h2>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {difficultyLevels.map((level, index) => (
                <motion.div
                  key={level.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() =>
                    setConfig((prev) => ({
                      ...prev,
                      difficulty_level: level.id,
                    }))
                  }
                  className={`
                    relative p-6 rounded-2xl cursor-pointer transition-all duration-300
                    ${
                      config.difficulty_level === level.id
                        ? "bg-white/15 border-2 border-white/30 shadow-xl"
                        : "bg-white/5 hover:bg-white/10 border border-white/10"
                    }
                  `}
                >
                  <div className="text-center">
                    <div className="text-3xl mb-3">{level.icon}</div>
                    <h3 className={`text-lg font-bold ${level.color} mb-2`}>
                      {level.name}
                    </h3>
                    <p className="text-gray-300 text-sm">{level.description}</p>
                  </div>

                  {config.difficulty_level === level.id && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute top-4 right-4"
                    >
                      <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                        <div className="w-3 h-3 bg-white rounded-full" />
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* TTS 모델 선택 */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <Volume2 className="w-6 h-6 text-blue-400" />
              <h2 className="text-2xl font-bold text-white">음성 모델 선택</h2>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {ttsModels.map((model, index) => (
                <motion.div
                  key={model.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() =>
                    setConfig((prev) => ({ ...prev, tts_model: model.id }))
                  }
                  className={`
                    relative p-6 rounded-2xl cursor-pointer transition-all duration-300
                    ${
                      config.tts_model === model.id
                        ? "bg-white/15 border-2 border-blue-400 shadow-xl"
                        : "bg-white/5 hover:bg-white/10 border border-white/10"
                    }
                  `}
                >
                  <div className="text-center">
                    <div className="text-3xl mb-3">{model.icon}</div>
                    <h3 className="text-lg font-bold text-white mb-2">
                      {model.name}
                    </h3>
                    <p className="text-gray-300 text-sm mb-3">
                      {model.description}
                    </p>

                    <div className="flex justify-center gap-2">
                      <span
                        className={`
                        px-2 py-1 text-xs rounded-full
                        ${
                          model.quality === "Ultra"
                            ? "bg-purple-500/20 text-purple-300"
                            : model.quality === "Premium"
                            ? "bg-blue-500/20 text-blue-300"
                            : "bg-gray-500/20 text-gray-300"
                        }
                      `}
                      >
                        {model.quality}
                      </span>
                      <span
                        className={`
                        px-2 py-1 text-xs rounded-full
                        ${
                          model.cost === "Free"
                            ? "bg-green-500/20 text-green-300"
                            : "bg-orange-500/20 text-orange-300"
                        }
                      `}
                      >
                        {model.cost}
                      </span>
                    </div>
                  </div>

                  {config.tts_model === model.id && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute top-4 right-4"
                    >
                      <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                        <div className="w-3 h-3 bg-white rounded-full" />
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* 고급 설정 */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="p-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl"
          >
            <div className="flex items-center gap-3 mb-6">
              <Brain className="w-6 h-6 text-green-400" />
              <h2 className="text-2xl font-bold text-white">고급 설정</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* 단어 수 */}
              <div>
                <label className="block text-white font-medium mb-2">
                  대화 길이 (단어 수): {config.word_count}
                </label>
                <input
                  type="range"
                  min="1000"
                  max="5000"
                  step="500"
                  value={config.word_count}
                  onChange={(e) =>
                    setConfig((prev) => ({
                      ...prev,
                      word_count: parseInt(e.target.value),
                    }))
                  }
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-sm text-gray-400 mt-1">
                  <span>짧게 (1000)</span>
                  <span>길게 (5000)</span>
                </div>
              </div>

              {/* 창의성 수준 */}
              <div>
                <label className="block text-white font-medium mb-2">
                  창의성 수준: {(config.creativity_level * 100).toFixed(0)}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={config.creativity_level}
                  onChange={(e) =>
                    setConfig((prev) => ({
                      ...prev,
                      creativity_level: parseFloat(e.target.value),
                    }))
                  }
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-sm text-gray-400 mt-1">
                  <span>사실적</span>
                  <span>창의적</span>
                </div>
              </div>
            </div>
          </motion.section>

          {/* API 키 설정 */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="p-6 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-2xl"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Key className="w-6 h-6 text-purple-400" />
                <h2 className="text-2xl font-bold text-white">API 키 설정</h2>
              </div>
              <button
                onClick={() => setShowApiKeys(!showApiKeys)}
                className="flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors"
              >
                {showApiKeys ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
                {showApiKeys ? "숨기기" : "보이기"}
              </button>
            </div>

            <AnimatePresence>
              {showApiKeys && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-4"
                >
                  {/* Gemini API Key */}
                  <div>
                    <label className="block text-white font-medium mb-2">
                      Gemini API Key <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="password"
                      placeholder="Gemini API 키를 입력하세요 (필수)"
                      value={config.gemini_api_key || ""}
                      onChange={(e) =>
                        setConfig((prev) => ({
                          ...prev,
                          gemini_api_key: e.target.value,
                        }))
                      }
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>

                  {/* OpenAI API Key */}
                  {config.tts_model === "openai" && (
                    <div>
                      <label className="block text-white font-medium mb-2">
                        OpenAI API Key <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="password"
                        placeholder="OpenAI API 키를 입력하세요"
                        value={config.openai_api_key || ""}
                        onChange={(e) =>
                          setConfig((prev) => ({
                            ...prev,
                            openai_api_key: e.target.value,
                          }))
                        }
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  )}

                  {/* ElevenLabs API Key */}
                  {config.tts_model === "elevenlabs" && (
                    <div>
                      <label className="block text-white font-medium mb-2">
                        ElevenLabs API Key{" "}
                        <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="password"
                        placeholder="ElevenLabs API 키를 입력하세요"
                        value={config.elevenlabs_api_key || ""}
                        onChange={(e) =>
                          setConfig((prev) => ({
                            ...prev,
                            elevenlabs_api_key: e.target.value,
                          }))
                        }
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                  )}

                  <div className="text-sm text-gray-400">
                    <p>
                      💡 API 키는 안전하게 처리되며 브라우저에만 저장됩니다.
                    </p>
                    {config.tts_model === "edge" && (
                      <p>
                        ✅ Edge TTS는 무료로 사용 가능하며 추가 API 키가
                        필요하지 않습니다.
                      </p>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.section>

          {/* 생성 버튼 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9 }}
            className="text-center pt-8"
          >
            <motion.button
              whileHover={{ scale: isValid ? 1.05 : 1 }}
              whileTap={{ scale: isValid ? 0.95 : 1 }}
              onClick={handleProceed}
              disabled={!isValid}
              className={`
                group text-lg px-8 py-4 rounded-full font-semibold shadow-2xl transition-all duration-300
                ${
                  isValid
                    ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:shadow-purple-500/25 cursor-pointer"
                    : "bg-gray-600 text-gray-400 cursor-not-allowed"
                }
              `}
            >
              <span className="flex items-center gap-2">
                {isValid ? (
                  <>
                    팟캐스트 생성하기
                    <motion.div
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <ArrowRight className="w-5 h-5" />
                    </motion.div>
                  </>
                ) : (
                  <>
                    필수 API 키를 입력해주세요
                    <Key className="w-5 h-5" />
                  </>
                )}
              </span>
            </motion.button>

            {!isValid && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-red-400 text-sm mt-4"
              >
                Gemini API 키
                {config.tts_model !== "edge"
                  ? "와 선택한 TTS 모델의 API 키"
                  : ""}
                를 입력해주세요
              </motion.p>
            )}
          </motion.div>
        </div>
      </div>

      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" />
      </div>

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: linear-gradient(to right, #8b5cf6, #ec4899);
          cursor: pointer;
          border: 2px solid #ffffff;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
        }
      `}</style>
    </div>
  );
}
