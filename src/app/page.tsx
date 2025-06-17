// src/app/page.tsx - 메인 랜딩 페이지
"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Upload,
  Mic,
  Brain,
  Sparkles,
  ArrowRight,
  FileText,
  PlayCircle,
} from "lucide-react";
import Link from "next/link";

export default function HomePage() {
  const [isHovered, setIsHovered] = useState(false);

  const features = [
    {
      icon: <FileText className="w-8 h-8" />,
      title: "이력서 분석",
      description:
        "PDF를 업로드하면 AI가 자동으로 분석하여 최적의 면접 전략을 제안합니다.",
    },
    {
      icon: <Brain className="w-8 h-8" />,
      title: "맞춤형 면접",
      description:
        "기술/디자인/비즈니스 등 분야별, 신입/중급/시니어별 맞춤 면접을 제공합니다.",
    },
    {
      icon: <Mic className="w-8 h-8" />,
      title: "실감나는 음성",
      description:
        "OpenAI, ElevenLabs 등 최신 TTS 기술로 실제 면접관과 대화하는 듯한 경험을 제공합니다.",
    },
  ];

  const interviewTypes = [
    { name: "기술 면접", color: "from-blue-500 to-purple-600", icon: "💻" },
    { name: "디자인 면접", color: "from-pink-500 to-orange-500", icon: "🎨" },
    { name: "비즈니스 면접", color: "from-green-500 to-teal-600", icon: "📊" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="relative z-10 p-6">
        <nav className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
              <Mic className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-white">
              Resume Podcast AI
            </span>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <a
              href="#features"
              className="text-gray-300 hover:text-white transition-colors"
            >
              기능
            </a>
            <a
              href="#how-it-works"
              className="text-gray-300 hover:text-white transition-colors"
            >
              사용법
            </a>
            <Link
              href="/upload"
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-2 rounded-full hover:opacity-90 transition-opacity"
            >
              시작하기
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pt-20 pb-32">
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-6xl md:text-8xl font-bold text-white mb-8">
              AI로 만드는
              <br />
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 bg-clip-text text-transparent">
                면접 연습
              </span>
              <br />
              팟캐스트
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed"
          >
            이력서를 업로드하면 AI가 실제 면접관과 지원자의 대화를 생성하여
            <br />
            개인 맞춤형 면접 연습 팟캐스트를 만들어드립니다.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-6"
          >
            <Link href="/upload">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onHoverStart={() => setIsHovered(true)}
                onHoverEnd={() => setIsHovered(false)}
                className="group bg-gradient-to-r from-purple-500 to-pink-500 text-white text-lg px-8 py-4 rounded-full font-semibold shadow-2xl hover:shadow-purple-500/25 transition-all duration-300"
              >
                <span className="flex items-center gap-2">
                  면접 팟캐스트 만들기
                  <motion.div
                    animate={{ x: isHovered ? 5 : 0 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    <ArrowRight className="w-5 h-5" />
                  </motion.div>
                </span>
              </motion.button>
            </Link>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="group text-white text-lg px-8 py-4 rounded-full font-semibold border-2 border-white/20 hover:border-white/40 transition-all duration-300"
            >
              <span className="flex items-center gap-2">
                <PlayCircle className="w-5 h-5" />
                데모 들어보기
              </span>
            </motion.button>
          </motion.div>
        </div>

        {/* Floating Elements */}
        <div className="absolute top-20 left-10 opacity-20">
          <motion.div
            animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
            transition={{ duration: 6, repeat: Infinity }}
            className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full blur-xl"
          />
        </div>
        <div className="absolute top-40 right-20 opacity-20">
          <motion.div
            animate={{ y: [0, 20, 0], rotate: [0, -5, 0] }}
            transition={{ duration: 8, repeat: Infinity }}
            className="w-32 h-32 bg-gradient-to-r from-blue-500 to-teal-500 rounded-full blur-xl"
          />
        </div>
      </section>

      {/* Interview Types Preview */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            다양한 면접 유형 지원
          </h2>
          <p className="text-xl text-gray-300">
            당신의 분야에 맞는 전문적인 면접 경험을 제공합니다
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {interviewTypes.map((type, index) => (
            <motion.div
              key={type.name}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              whileHover={{ scale: 1.05, y: -10 }}
              className={`relative p-8 rounded-2xl bg-gradient-to-br ${type.color} shadow-2xl overflow-hidden group cursor-pointer`}
            >
              <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative z-10">
                <div className="text-6xl mb-4">{type.icon}</div>
                <h3 className="text-2xl font-bold text-white mb-2">
                  {type.name}
                </h3>
                <p className="text-white/80">
                  전문적이고 실무 중심의 {type.name.split(" ")[0]} 질문들로
                  구성된 맞춤형 면접
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section
        id="features"
        className="relative z-10 max-w-7xl mx-auto px-6 py-20"
      >
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              왜 Resume Podcast AI인가요?
            </h2>
            <p className="text-xl text-gray-300">
              최신 AI 기술로 가장 현실적인 면접 연습 경험을 제공합니다
            </p>
          </motion.div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              viewport={{ once: true }}
              className="group p-8 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-300"
            >
              <div className="text-purple-400 mb-6 group-hover:scale-110 transition-transform duration-300">
                {feature.icon}
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">
                {feature.title}
              </h3>
              <p className="text-gray-300 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section
        id="how-it-works"
        className="relative z-10 max-w-7xl mx-auto px-6 py-20"
      >
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            간단한 3단계
          </h2>
          <p className="text-xl text-gray-300">
            복잡한 설정 없이 바로 시작하세요
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-12">
          {[
            {
              step: "01",
              title: "이력서 업로드",
              description: "PDF 이력서를 드래그앤드롭으로 업로드하세요",
              icon: <Upload className="w-12 h-12" />,
            },
            {
              step: "02",
              title: "면접 설정",
              description: "면접 유형과 난이도를 선택하세요",
              icon: <Brain className="w-12 h-12" />,
            },
            {
              step: "03",
              title: "팟캐스트 생성",
              description: "AI가 개인 맞춤형 면접 팟캐스트를 생성합니다",
              icon: <Sparkles className="w-12 h-12" />,
            },
          ].map((step, index) => (
            <motion.div
              key={step.step}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mb-6">
                <div className="text-white">{step.icon}</div>
              </div>
              <div className="text-purple-400 text-sm font-bold mb-2">
                STEP {step.step}
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">
                {step.title}
              </h3>
              <p className="text-gray-300">{step.description}</p>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-16">
          <Link href="/upload">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-lg px-12 py-4 rounded-full font-semibold shadow-2xl hover:shadow-purple-500/25 transition-all duration-300"
            >
              지금 시작하기
            </motion.button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 mt-20">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <Mic className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">
                Resume Podcast AI
              </span>
            </div>
            <p className="text-gray-400">
              AI 기술로 더 나은 면접 준비 경험을 제공합니다
            </p>
          </div>
        </div>
      </footer>

      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" />
      </div>
    </div>
  );
}
