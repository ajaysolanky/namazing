"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface MarkdownContentProps {
  content: string;
  className?: string;
}

export function MarkdownContent({ content, className }: MarkdownContentProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className={cn("relative", className)}
    >
      {/* Content wrapper */}
      <div className="relative p-8 sm:p-12 lg:p-16 rounded-3xl bg-white border border-studio-ink/5 shadow-card">
        {/* Decorative corner flourishes */}
        <div className="absolute top-6 left-6 w-12 h-12 border-l-2 border-t-2 border-studio-rose/30 rounded-tl-lg" />
        <div className="absolute top-6 right-6 w-12 h-12 border-r-2 border-t-2 border-studio-sage/30 rounded-tr-lg" />
        <div className="absolute bottom-6 left-6 w-12 h-12 border-l-2 border-b-2 border-studio-sage/30 rounded-bl-lg" />
        <div className="absolute bottom-6 right-6 w-12 h-12 border-r-2 border-b-2 border-studio-rose/30 rounded-br-lg" />

        {/* Letter header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-3 px-5 py-2.5 bg-gradient-to-r from-studio-rose/20 via-white to-studio-sage/20 rounded-full">
            <div className="w-1.5 h-1.5 rounded-full bg-studio-rose" />
            <span className="text-sm font-medium text-studio-ink/70 tracking-wide">Your Personalized Consultation</span>
            <div className="w-1.5 h-1.5 rounded-full bg-studio-sage" />
          </div>
        </div>

        {/* Markdown content with beautiful typography */}
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            h1: ({ children }) => (
              <h1 className="font-display text-4xl sm:text-5xl text-studio-ink mb-8 text-center">
                {children}
              </h1>
            ),
            h2: ({ children }) => (
              <h2 className="font-display text-2xl sm:text-3xl text-studio-ink mt-12 mb-6 flex items-center gap-3">
                <span className="w-8 h-[2px] bg-gradient-to-r from-studio-rose to-transparent" />
                {children}
              </h2>
            ),
            h3: ({ children }) => (
              <h3 className="font-display text-xl sm:text-2xl text-studio-ink/90 mt-8 mb-4">
                {children}
              </h3>
            ),
            p: ({ children }) => (
              <p className="text-studio-ink/75 leading-relaxed text-[17px] mb-5">
                {children}
              </p>
            ),
            ul: ({ children }) => (
              <ul className="space-y-3 my-6 ml-2">
                {children}
              </ul>
            ),
            ol: ({ children }) => (
              <ol className="space-y-3 my-6 ml-2 list-none counter-reset-item">
                {children}
              </ol>
            ),
            li: ({ children }) => (
              <li className="flex items-start gap-3 text-studio-ink/75">
                <span className="flex-shrink-0 mt-1.5 w-2 h-2 rounded-full bg-gradient-to-br from-studio-rose to-studio-sage" />
                <span className="leading-relaxed">{children}</span>
              </li>
            ),
            strong: ({ children }) => (
              <strong className="font-semibold text-studio-ink">
                {children}
              </strong>
            ),
            em: ({ children }) => (
              <em className="italic text-studio-ink/80">
                {children}
              </em>
            ),
            blockquote: ({ children }) => (
              <blockquote className="relative my-8 py-6 px-8 bg-gradient-to-r from-studio-rose/10 via-transparent to-studio-sage/10 rounded-2xl border-l-4 border-studio-rose/40">
                <svg className="absolute top-4 left-4 w-6 h-6 text-studio-rose/30" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>
                <div className="text-studio-ink/70 italic text-lg leading-relaxed pl-6">
                  {children}
                </div>
              </blockquote>
            ),
            hr: () => (
              <div className="flex items-center justify-center gap-4 my-12">
                <div className="w-16 h-[1px] bg-gradient-to-r from-transparent to-studio-rose/40" />
                <div className="w-2 h-2 rounded-full bg-gradient-to-br from-studio-rose to-studio-sage" />
                <div className="w-16 h-[1px] bg-gradient-to-l from-transparent to-studio-sage/40" />
              </div>
            ),
            a: ({ href, children }) => (
              <a
                href={href}
                className="text-studio-rose hover:text-studio-ink underline underline-offset-2 decoration-studio-rose/30 hover:decoration-studio-ink/30 transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                {children}
              </a>
            ),
            code: ({ children }) => (
              <code className="px-2 py-0.5 bg-studio-sand/50 rounded text-sm font-mono text-studio-ink/80">
                {children}
              </code>
            ),
            table: ({ children }) => (
              <div className="overflow-x-auto my-6">
                <table className="w-full border-collapse text-sm">
                  {children}
                </table>
              </div>
            ),
            thead: ({ children }) => (
              <thead className="bg-studio-sand/50 border-b border-studio-ink/10">
                {children}
              </thead>
            ),
            tbody: ({ children }) => (
              <tbody>{children}</tbody>
            ),
            tr: ({ children }) => (
              <tr className="border-b border-studio-ink/5 last:border-0">
                {children}
              </tr>
            ),
            th: ({ children }) => (
              <th className="px-4 py-3 text-left font-semibold text-studio-ink/80 text-sm">
                {children}
              </th>
            ),
            td: ({ children }) => (
              <td className="px-4 py-3 text-studio-ink/70">
                {children}
              </td>
            ),
          }}
        >
          {content}
        </ReactMarkdown>

        {/* Signature flourish */}
        <div className="mt-16 pt-8 border-t border-studio-ink/5 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-8 h-[1px] bg-gradient-to-r from-transparent to-studio-rose/40" />
            <svg className="w-5 h-5 text-studio-rose/60" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
            </svg>
            <div className="w-8 h-[1px] bg-gradient-to-l from-transparent to-studio-sage/40" />
          </div>
          <p className="text-sm text-studio-ink/40 italic">
            Crafted with care by Namazing
          </p>
        </div>
      </div>
    </motion.div>
  );
}
