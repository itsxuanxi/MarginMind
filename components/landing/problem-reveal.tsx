"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowDown } from "lucide-react";

const STEPS = [
  { value: "+40%", label: "Revenue", tone: "text-foreground" },
  { value: "−12%", label: "Profit", tone: "text-red-600" },
  { value: "3–8%", label: "Revenue Lost", tone: "text-red-600" },
  { value: "0", label: "Dashboards Showing It", tone: "text-muted-foreground" },
];

const EASE = [0.16, 1, 0.3, 1] as const;

export function ProblemReveal() {
  const reduce = useReducedMotion();
  return (
    <section className="relative overflow-hidden bg-background py-28 sm:py-36">
      <div className="absolute inset-0 grid-bg opacity-[0.25]" />
      <div className="relative mx-auto max-w-3xl px-6 text-center">
        <motion.h2
          initial={reduce ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.8, ease: EASE }}
          className="text-balance text-5xl font-semibold leading-[1.05] tracking-tight sm:text-7xl"
        >
          Revenue Up.
          <br />
          <span className="text-red-600">Profit Down.</span>
        </motion.h2>

        <p className="mx-auto mt-6 max-w-xl text-lg text-muted-foreground">
          The numbers everyone celebrates hide the one that actually matters.
        </p>

        <div className="mx-auto mt-16 flex max-w-md flex-col items-center gap-3">
          {STEPS.map((s, i) => (
            <div key={s.label} className="flex w-full flex-col items-center">
              <motion.div
                initial={reduce ? false : { opacity: 0, y: 28, filter: "blur(6px)" }}
                whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                viewport={{ once: true, amount: 0.8 }}
                transition={{ duration: 0.7, ease: EASE, delay: i * 0.12 }}
                className="flex w-full items-baseline justify-between rounded-2xl border border-border bg-card px-6 py-5 shadow-sm"
              >
                <span className={`tabular text-4xl font-semibold tracking-tight sm:text-5xl ${s.tone}`}>{s.value}</span>
                <span className="text-sm font-medium text-muted-foreground sm:text-base">{s.label}</span>
              </motion.div>
              {i < STEPS.length - 1 && (
                <motion.div
                  initial={reduce ? false : { opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true, amount: 0.8 }}
                  transition={{ duration: 0.4, delay: i * 0.12 + 0.2 }}
                  className="py-1.5 text-muted-foreground/50"
                >
                  <ArrowDown className="size-5" />
                </motion.div>
              )}
            </div>
          ))}
        </div>

        <motion.p
          initial={reduce ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.8 }}
          transition={{ duration: 0.7, ease: EASE }}
          className="mx-auto mt-14 max-w-lg text-pretty text-xl font-medium tracking-tight text-foreground sm:text-2xl"
        >
          MarginMind is the dashboard that finally shows it.
        </motion.p>
      </div>
    </section>
  );
}
