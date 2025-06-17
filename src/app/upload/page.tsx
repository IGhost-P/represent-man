// src/app/upload/page.tsx - 이력서 업로드 페이지
"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDropzone } from "react-dropzone";
import {
  Upload,
  FileText,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  Brain,
  Loader2,
  Home,
  Sparkles,
  Target,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface AnalysisResult {
  resume_text: string;
  word_count: number;
  detected_skills: string[];
  experience_level: string;
  suggested_interview_type: string;
  key_projects: string[];
  analysis_summary: string;
}

export default function UploadPage() {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setUploadedFile(file);
    setIsAnalyzing(true);
    setError(null);
    setAnalysisResult(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("http://localhost:8000/api/analyze-resume", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("이력서 분석에 실패했습니다.");
      }

      const result: AnalysisResult = await response.json();
      setAnalysisResult(result);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다."
      );
    } finally {
      setIsAnalyzing(false);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        [".docx"],
      "application/msword": [".doc"],
    },
    maxFiles: 1,
    disabled: isAnalyzing,
  });

  const handleProceed = () => {
    if (analysisResult) {
      // 분석 결과를 localStorage에 저장 후 다음 페이지로
      localStorage.setItem("resumeAnalysis", JSON.stringify(analysisResult));
      router.push("/configure");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="relative z-10 p-6">
        <nav className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
              <Brain className="w-6 h-6 text-white" />
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
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            이력서를
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              분석
            </span>
            해드릴게요
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            PDF 또는 Word 파일을 업로드하면 AI가 자동으로 분석하여 최적의 면접
            시뮬레이션을 준비합니다.
          </p>
        </motion.div>

        {/* Upload Area */}
        {!analysisResult && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-12"
          >
            <div
              {...getRootProps()}
              className={`
                relative border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer
                transition-all duration-300 group
                ${
                  isDragActive
                    ? "border-purple-400 bg-purple-500/10"
                    : "border-gray-600 hover:border-purple-400 hover:bg-purple-500/5"
                }
                ${isAnalyzing ? "pointer-events-none opacity-50" : ""}
              `}
            >
              <input {...getInputProps()} />

              <AnimatePresence mode="wait">
                {isAnalyzing ? (
                  <motion.div
                    key="analyzing"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="flex flex-col items-center"
                  >
                    <Loader2 className="w-16 h-16 text-purple-400 animate-spin mb-4" />
                    <h3 className="text-2xl font-semibold text-white mb-2">
                      이력서를 분석하고 있습니다...
                    </h3>
                    <p className="text-gray-300">
                      AI가 당신의 이력서를 꼼꼼히 살펴보고 있어요
                    </p>
                  </motion.div>
                ) : uploadedFile ? (
                  <motion.div
                    key="uploaded"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="flex flex-col items-center"
                  >
                    <CheckCircle className="w-16 h-16 text-green-400 mb-4" />
                    <h3 className="text-2xl font-semibold text-white mb-2">
                      {uploadedFile.name}
                    </h3>
                    <p className="text-gray-300">파일이 업로드되었습니다</p>
                  </motion.div>
                ) : (
                  <motion.div
                    key="upload"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="flex flex-col items-center"
                  >
                    <div className="relative mb-6">
                      <motion.div
                        animate={{ y: [0, -10, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center"
                      >
                        <Upload className="w-8 h-8 text-white" />
                      </motion.div>
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl opacity-20"
                      />
                    </div>

                    <h3 className="text-2xl font-semibold text-white mb-2">
                      {isDragActive
                        ? "파일을 놓아주세요"
                        : "이력서를 드래그하거나 클릭하세요"}
                    </h3>
                    <p className="text-gray-300 mb-4">
                      PDF, DOC, DOCX 파일을 지원합니다 (최대 10MB)
                    </p>

                    <div className="flex items-center gap-4 text-sm text-gray-400">
                      <div className="flex items-center gap-1">
                        <FileText className="w-4 h-4" />
                        PDF
                      </div>
                      <div className="flex items-center gap-1">
                        <FileText className="w-4 h-4" />
                        DOC
                      </div>
                      <div className="flex items-center gap-1">
                        <FileText className="w-4 h-4" />
                        DOCX
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}

        {/* Error Message */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-8 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3"
            >
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
              <p className="text-red-300">{error}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Analysis Results */}
        <AnimatePresence>
          {analysisResult && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              {/* Success Header */}
              <div className="text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full mb-6"
                >
                  <CheckCircle className="w-10 h-10 text-white" />
                </motion.div>
                <h2 className="text-4xl font-bold text-white mb-4">
                  분석 완료!
                </h2>
                <p className="text-gray-300 text-lg">
                  이력서 분석이 완료되었습니다. 결과를 확인해보세요.
                </p>
              </div>

              {/* Analysis Cards */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* 경력 수준 */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="p-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <TrendingUp className="w-6 h-6 text-blue-400" />
                    <h3 className="text-lg font-semibold text-white">
                      경력 수준
                    </h3>
                  </div>
                  <p className="text-2xl font-bold text-blue-400 mb-2">
                    {analysisResult.experience_level}
                  </p>
                  <p className="text-gray-300 text-sm">
                    {analysisResult.word_count}개 단어로 구성된 이력서
                  </p>
                </motion.div>

                {/* 추천 면접 유형 */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="p-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <Target className="w-6 h-6 text-purple-400" />
                    <h3 className="text-lg font-semibold text-white">
                      추천 면접
                    </h3>
                  </div>
                  <p className="text-2xl font-bold text-purple-400 mb-2">
                    {analysisResult.suggested_interview_type}
                  </p>
                  <p className="text-gray-300 text-sm">
                    가장 적합한 면접 유형으로 판단됩니다
                  </p>
                </motion.div>

                {/* 감지된 스킬 */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="p-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl md:col-span-2 lg:col-span-1"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <Sparkles className="w-6 h-6 text-orange-400" />
                    <h3 className="text-lg font-semibold text-white">
                      핵심 기술
                    </h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {analysisResult.detected_skills.length > 0 ? (
                      analysisResult.detected_skills.map((skill, index) => (
                        <motion.span
                          key={skill}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.6 + index * 0.1 }}
                          className="px-3 py-1 bg-orange-500/20 text-orange-300 rounded-full text-sm"
                        >
                          {skill}
                        </motion.span>
                      ))
                    ) : (
                      <p className="text-gray-400 text-sm">
                        기술 스택을 감지하지 못했습니다
                      </p>
                    )}
                  </div>
                </motion.div>
              </div>

              {/* Summary */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="p-6 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-xl"
              >
                <h3 className="text-xl font-semibold text-white mb-3">
                  분석 요약
                </h3>
                <p className="text-gray-300 leading-relaxed">
                  {analysisResult.analysis_summary}
                </p>
              </motion.div>

              {/* Proceed Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="text-center pt-8"
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleProceed}
                  className="group bg-gradient-to-r from-purple-500 to-pink-500 text-white text-lg px-8 py-4 rounded-full font-semibold shadow-2xl hover:shadow-purple-500/25 transition-all duration-300"
                >
                  <span className="flex items-center gap-2">
                    면접 설정하러 가기
                    <motion.div
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <ArrowRight className="w-5 h-5" />
                    </motion.div>
                  </span>
                </motion.button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" />
      </div>
    </div>
  );
}
