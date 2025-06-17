// src/app/result/page.tsx - 결과 페이지
"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  Download,
  Share,
  Home,
  RefreshCw,
  Clock,
  Star,
  Headphones,
  Music,
  Copy,
  Check,
  Twitter,
  Facebook,
  Link as LinkIcon,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface PodcastResult {
  status: string;
  progress: number;
  message: string;
  audio_file?: string;
  download_url?: string;
  completed_at?: string;
}

export default function ResultPage() {
  const [result, setResult] = useState<PodcastResult | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [copied, setCopied] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const progressRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();

  useEffect(() => {
    // localStorage에서 결과 데이터 가져오기
    const savedResult = localStorage.getItem("podcastResult");
    if (savedResult) {
      const parsedResult = JSON.parse(savedResult);
      setResult(parsedResult);
      setIsLoading(false);
    } else {
      // 결과가 없으면 홈으로 리다이렉트
      router.push("/");
    }
  }, [router]);

  // 오디오 이벤트 핸들러
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    const handleEnded = () => setIsPlaying(false);

    audio.addEventListener("timeupdate", updateTime);
    audio.addEventListener("loadedmetadata", updateDuration);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("timeupdate", updateTime);
      audio.removeEventListener("loadedmetadata", updateDuration);
      audio.removeEventListener("ended", handleEnded);
    };
  }, [result]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const seekTo = (e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current;
    const progressBar = progressRef.current;
    if (!audio || !progressBar) return;

    const rect = progressBar.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const newTime = (clickX / rect.width) * duration;
    audio.currentTime = newTime;
  };

  const skip = (seconds: number) => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.currentTime = Math.max(
      0,
      Math.min(duration, audio.currentTime + seconds)
    );
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const handleDownload = () => {
    if (result?.download_url) {
      window.open(
        `${process.env.NEXT_PUBLIC_API_URL}${result.download_url}`,
        "_blank"
      );
    }
  };

  const handleShare = (platform?: string) => {
    const url = window.location.href;
    const text = "🎙️ AI로 만든 나만의 면접 연습 팟캐스트를 확인해보세요!";

    if (platform === "twitter") {
      window.open(
        `https://twitter.com/intent/tweet?text=${encodeURIComponent(
          text
        )}&url=${encodeURIComponent(url)}`,
        "_blank"
      );
    } else if (platform === "facebook") {
      window.open(
        `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
          url
        )}`,
        "_blank"
      );
    } else {
      // 링크 복사
      navigator.clipboard.writeText(url).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    }
    setShowShareMenu(false);
  };

  const createNew = () => {
    // localStorage 정리 후 새 팟캐스트 생성
    localStorage.removeItem("resumeAnalysis");
    localStorage.removeItem("interviewConfig");
    localStorage.removeItem("podcastResult");
    router.push("/upload");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white text-xl">결과를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-white text-xl mb-4">결과를 찾을 수 없습니다.</p>
          <Link href="/" className="text-purple-400 hover:text-purple-300">
            홈으로 돌아가기
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="relative z-10 p-6">
        <nav className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
              <Music className="w-6 h-6 text-white" />
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
        {/* Success Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full mb-6"
          >
            <Headphones className="w-12 h-12 text-white" />
          </motion.div>

          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            🎉
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              완성
            </span>
            !
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            당신만의 개인 맞춤형 면접 시뮬레이션 팟캐스트가 준비되었습니다. 지금
            바로 들어보고 면접 연습을 시작하세요!
          </p>
        </motion.div>

        {/* Audio Player */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mb-12"
        >
          <div className="p-8 bg-gradient-to-r from-purple-500/10 to-pink-500/10 backdrop-blur-sm border border-purple-500/20 rounded-3xl">
            {/* 오디오 엘리먼트 */}
            {result.download_url && (
              <audio
                ref={audioRef}
                src={`${process.env.NEXT_PUBLIC_API_URL}${result.download_url}`}
                preload="metadata"
              />
            )}

            {/* 플레이어 헤더 */}
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-white mb-2">
                면접 시뮬레이션 팟캐스트
              </h2>
              <p className="text-gray-300">AI가 생성한 개인 맞춤형 면접 연습</p>
            </div>

            {/* 컨트롤 */}
            <div className="space-y-6">
              {/* 진행률 바 */}
              <div className="space-y-2">
                <div
                  ref={progressRef}
                  onClick={seekTo}
                  className="w-full h-3 bg-gray-700 rounded-full cursor-pointer overflow-hidden"
                >
                  <motion.div
                    className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                    style={{
                      width: `${
                        duration ? (currentTime / duration) * 100 : 0
                      }%`,
                    }}
                  />
                </div>
                <div className="flex justify-between text-sm text-gray-400">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>

              {/* 플레이어 버튼들 */}
              <div className="flex items-center justify-center gap-6">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => skip(-10)}
                  className="p-3 text-gray-300 hover:text-white transition-colors"
                >
                  <SkipBack className="w-6 h-6" />
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={togglePlay}
                  className="p-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full text-white shadow-lg hover:shadow-purple-500/25 transition-all duration-300"
                >
                  {isPlaying ? (
                    <Pause className="w-8 h-8" />
                  ) : (
                    <Play className="w-8 h-8 ml-1" />
                  )}
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => skip(10)}
                  className="p-3 text-gray-300 hover:text-white transition-colors"
                >
                  <SkipForward className="w-6 h-6" />
                </motion.button>
              </div>

              {/* 볼륨 조절 */}
              <div className="flex items-center gap-4 max-w-md mx-auto">
                <Volume2 className="w-5 h-5 text-gray-400" />
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={volume}
                  onChange={handleVolumeChange}
                  className="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                />
                <span className="text-sm text-gray-400 w-8">
                  {Math.round(volume * 100)}%
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* 액션 버튼들 */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="grid md:grid-cols-3 gap-6 mb-12"
        >
          {/* 다운로드 */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleDownload}
            className="group p-6 bg-white/5 hover:bg-white/10 backdrop-blur-sm border border-white/10 rounded-2xl transition-all duration-300"
          >
            <div className="flex flex-col items-center gap-3">
              <div className="p-3 bg-blue-500/20 rounded-xl group-hover:bg-blue-500/30 transition-colors">
                <Download className="w-6 h-6 text-blue-400" />
              </div>
              <div className="text-center">
                <h3 className="font-semibold text-white mb-1">다운로드</h3>
                <p className="text-sm text-gray-400">MP3 파일로 저장</p>
              </div>
            </div>
          </motion.button>

          {/* 공유 */}
          <div className="relative">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowShareMenu(!showShareMenu)}
              className="group p-6 bg-white/5 hover:bg-white/10 backdrop-blur-sm border border-white/10 rounded-2xl transition-all duration-300 w-full"
            >
              <div className="flex flex-col items-center gap-3">
                <div className="p-3 bg-green-500/20 rounded-xl group-hover:bg-green-500/30 transition-colors">
                  <Share className="w-6 h-6 text-green-400" />
                </div>
                <div className="text-center">
                  <h3 className="font-semibold text-white mb-1">공유하기</h3>
                  <p className="text-sm text-gray-400">친구들과 공유</p>
                </div>
              </div>
            </motion.button>

            {/* 공유 메뉴 */}
            <AnimatePresence>
              {showShareMenu && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.9 }}
                  className="absolute top-full mt-2 left-0 right-0 p-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl shadow-xl z-10"
                >
                  <div className="space-y-2">
                    <button
                      onClick={() => handleShare("twitter")}
                      className="w-full flex items-center gap-3 p-2 hover:bg-white/10 rounded-lg transition-colors"
                    >
                      <Twitter className="w-4 h-4 text-blue-400" />
                      <span className="text-white text-sm">Twitter</span>
                    </button>
                    <button
                      onClick={() => handleShare("facebook")}
                      className="w-full flex items-center gap-3 p-2 hover:bg-white/10 rounded-lg transition-colors"
                    >
                      <Facebook className="w-4 h-4 text-blue-600" />
                      <span className="text-white text-sm">Facebook</span>
                    </button>
                    <button
                      onClick={() => handleShare()}
                      className="w-full flex items-center gap-3 p-2 hover:bg-white/10 rounded-lg transition-colors"
                    >
                      {copied ? (
                        <Check className="w-4 h-4 text-green-400" />
                      ) : (
                        <Copy className="w-4 h-4 text-gray-400" />
                      )}
                      <span className="text-white text-sm">
                        {copied ? "복사됨!" : "링크 복사"}
                      </span>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* 새로 만들기 */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={createNew}
            className="group p-6 bg-white/5 hover:bg-white/10 backdrop-blur-sm border border-white/10 rounded-2xl transition-all duration-300"
          >
            <div className="flex flex-col items-center gap-3">
              <div className="p-3 bg-purple-500/20 rounded-xl group-hover:bg-purple-500/30 transition-colors">
                <RefreshCw className="w-6 h-6 text-purple-400" />
              </div>
              <div className="text-center">
                <h3 className="font-semibold text-white mb-1">새로 만들기</h3>
                <p className="text-sm text-gray-400">다른 면접 연습</p>
              </div>
            </div>
          </motion.button>
        </motion.div>

        {/* 피드백 & 팁 */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="space-y-6"
        >
          {/* 사용 팁 */}
          <div className="p-6 bg-blue-500/10 border border-blue-500/20 rounded-2xl">
            <div className="flex items-center gap-3 mb-4">
              <Star className="w-6 h-6 text-blue-400" />
              <h3 className="text-xl font-semibold text-white">활용 팁</h3>
            </div>
            <div className="grid md:grid-cols-2 gap-4 text-gray-300">
              <div>
                <h4 className="font-medium text-white mb-2">🎧 반복 학습</h4>
                <p className="text-sm">
                  여러 번 듣고 면접관의 질문과 모범 답변을 숙지하세요.
                </p>
              </div>
              <div>
                <h4 className="font-medium text-white mb-2">📝 답변 연습</h4>
                <p className="text-sm">
                  팟캐스트를 듣고 실제로 소리내어 답변 연습을 해보세요.
                </p>
              </div>
              <div>
                <h4 className="font-medium text-white mb-2">🔄 다양한 설정</h4>
                <p className="text-sm">
                  난이도와 면접 유형을 바꿔가며 다양한 시나리오를 연습하세요.
                </p>
              </div>
              <div>
                <h4 className="font-medium text-white mb-2">📱 언제든지</h4>
                <p className="text-sm">
                  이동 중이나 여가 시간에 언제든 면접 연습을 할 수 있습니다.
                </p>
              </div>
            </div>
          </div>

          {/* 생성 정보 */}
          {result.completed_at && (
            <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
              <div className="flex items-center gap-2 text-gray-400 text-sm">
                <Clock className="w-4 h-4" />
                <span>
                  생성 완료:{" "}
                  {new Date(result.completed_at).toLocaleString("ko-KR")}
                </span>
              </div>
            </div>
          )}
        </motion.div>
      </div>

      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" />
      </div>

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 16px;
          width: 16px;
          border-radius: 50%;
          background: linear-gradient(to right, #8b5cf6, #ec4899);
          cursor: pointer;
          border: 2px solid #ffffff;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
        }
      `}</style>
    </div>
  );
}
