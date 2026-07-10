"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

function Counter({ end, suffix = "", label }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const duration = 2000;
    const steps = 60;
    const increment = end / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [end]);

  return (
    <div className="text-center">
      <div className="text-4xl font-bold text-white md:text-5xl">
        {count.toLocaleString()}{suffix}
      </div>
      <div className="mt-2 text-sm text-slate-400">{label}</div>
    </div>
  );
}

export default function StatsSection() {
  const stats = [
    { end: 500, suffix: "+", label: "Security Assessments" },
    { end: 98, suffix: "%", label: "Client Satisfaction" },
    { end: 50, suffix: "+", label: "Enterprise Clients" },
    { end: 15, suffix: "+", label: "Years Experience" },
  ];

  return (
    <section className="border-y border-slate-800 bg-slate-900/30 py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <Counter {...stat} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
