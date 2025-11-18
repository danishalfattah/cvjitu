"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Bot, BarChart3, Database, CheckCircle } from "lucide-react";

const features = [
  {
    icon: Bot,
    title: "Pembuat CV AI",
    description:
      "Bantuan AI untuk membuat CV profesional dengan template yang dioptimalkan untuk ATS",
  },
  {
    icon: BarChart3,
    title: "Skor Otomatis 1–100",
    description:
      "Penilaian otomatis dengan rincian detail untuk meningkatkan kualitas CV Anda",
  },
  {
    icon: Database,
    title: "Repositori CV",
    description:
      "Simpan dan kelola semua versi CV Anda dalam satu tempat yang terorganisir",
  },
  {
    icon: CheckCircle,
    title: "Template ATS",
    description:
      "Template yang telah terbukti lolos sistem ATS dari berbagai perusahaan",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

export function FeaturesSection() {
  return (
    <section id="features" className="py-20 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl lg:text-4xl font-poppins font-bold text-[var(--neutral-ink)] mb-4">
            Fitur Unggulan CVJitu
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Platform lengkap untuk membuat, mengevaluasi, dan mengoptimalkan CV
            Anda dengan teknologi AI terdepan
          </p>
        </motion.div>

        <motion.div
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {features.map((feature, index) => (
            <motion.div key={index} variants={cardVariants}>
              <Card className="border border-[var(--border-color)] hover:shadow-lg hover:-translate-y-1 transition-smooth h-full">
                <CardHeader className="text-center">
                  <motion.div
                    className="w-16 h-16 bg-[var(--red-light)] rounded-2xl flex items-center justify-center mx-auto mb-4"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <feature.icon className="w-8 h-8 text-[var(--red-normal)]" />
                  </motion.div>
                  <CardTitle className="text-xl font-poppins text-[var(--neutral-ink)]">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-center leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
