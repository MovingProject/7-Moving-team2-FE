"use client";

import { useEffect } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useRouter } from "next/navigation";
import Image from "next/image";
import truckImg from "../assets/img/truck.png";

type Props = {
  open: boolean;
  onClose?: () => void;
  durationMs?: number;
};

export default function WelcomeOverlay({ open, onClose, durationMs = 3000 }: Props) {
  const router = useRouter();
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    if (!open) return;
    const t = setTimeout(() => {
      onClose?.();
    }, durationMs + 800); // allow extra time for final text animation

    return () => clearTimeout(t);
  }, [open, onClose, durationMs, router]);

  if (!open) return null;

  const truckEnter = shouldReduceMotion
    ? { x: 0, opacity: 1 }
    : { x: [400, 20, 0], opacity: [0, 1, 1] };

  const truckTransition = shouldReduceMotion
    ? { duration: 0.2 }
    : { times: [0, 0.7, 1], duration: durationMs / 1000, ease: [0.22, 1, 0.36, 1] as const };

  const textVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="relative mx-4 w-full max-w-[960px] rounded-lg p-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
          className="flex w-full flex-col items-center gap-6"
        >
          <motion.div
            className="relative flex w-full items-center justify-center overflow-visible"
            animate={truckEnter}
            transition={truckTransition}
          >
            {/* replace full SVG truck with a single image for pixel-perfect rendering */}
            <div className="flex items-center gap-6">
              <Image
                src={truckImg}
                alt="무빙 트럭"
                width={467}
                height={264}
                className="h-auto max-w-full"
                style={{ position: "relative" }}
              />

              {/* smoke column placed to the right of the image so it's clearly visible */}
              <div className="flex w-24 flex-col items-start justify-center" aria-hidden>
                <motion.span
                  className="block"
                  initial={{ opacity: 0, y: 0, scale: 0.6 }}
                  animate={{ opacity: [0, 0.8, 0], y: [0, -12, -24], scale: [0.6, 1, 1.6] }}
                  transition={{ repeat: 0, duration: 1 }}
                  style={{
                    display: "inline-block",
                    width: 12,
                    height: 12,
                    borderRadius: "50%",
                    background: "#D9EFFF",
                    transformOrigin: "center",
                  }}
                />
                <motion.span
                  className="mt-2 block"
                  initial={{ opacity: 0, y: 0, scale: 0.6 }}
                  animate={{ opacity: [0, 0.7, 0], y: [0, -16, -36], scale: [0.6, 1, 1.6] }}
                  transition={{ repeat: 0, duration: 1.2, delay: 0.15 }}
                  style={{
                    display: "inline-block",
                    width: 16,
                    height: 16,
                    borderRadius: "50%",
                    background: "#CFE8FF",
                    transformOrigin: "center",
                  }}
                />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial="hidden"
            animate="visible"
            variants={textVariants}
            transition={{ delay: durationMs / 3000, duration: 0.4 }}
            className="text-center"
          >
            <h2 className="mb-2 text-4xl font-bold text-white">환영합니다!</h2>
            <p className="text-2xl text-white/90">
              무빙에 오신 걸 환영합니다 — 최고의 이사 전문 플랫폼.
            </p>
          </motion.div>

          <button
            aria-label="닫기"
            className="mt-6 rounded bg-white/10 px-4 py-2 text-sm text-white/90"
            onClick={() => {
              onClose?.();
            }}
          >
            바로 이동
          </button>
        </motion.div>
      </div>
    </div>
  );
}
