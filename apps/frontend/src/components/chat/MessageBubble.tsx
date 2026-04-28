'use client';

import { motion } from 'framer-motion';

const PROVIDER_BADGES: Record<string, { label: string; color: string }> = {
  chatgpt: { label: 'ChatGPT', color: '#10a37f' },
  claude: { label: 'Claude', color: '#d97706' },
  gemini: { label: 'Gemini', color: '#4f8ef7' },
};

interface Message {
  id: string;
  thread_id: string;
  provider: string;
  role: 'user' | 'assistant';
  content: string;
  created_at: string;
}

interface Props {
  message: Message;
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

// Lightweight markdown renderer — handles bold, italic, code, lists, headings
function renderMarkdown(text: string): React.ReactNode {
  const lines = text.split('\n');
  const elements: React.ReactNode[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Heading
    const headingMatch = line.match(/^(#{1,3})\s+(.+)/);
    if (headingMatch) {
      const level = headingMatch[1].length;
      const content = headingMatch[2];
      const Tag = `h${level}` as 'h1' | 'h2' | 'h3';
      elements.push(
        <Tag key={i} className={level === 1 ? 'text-[1.2rem] font-semibold text-white mt-4 mb-2' : level === 2 ? 'text-[1.05rem] font-semibold text-white mt-3 mb-1.5' : 'text-[0.95rem] font-semibold text-white mt-2 mb-1'}>
          {content}
        </Tag>
      );
      i++;
      continue;
    }

    // Code block
    if (line.startsWith('```')) {
      const lang = line.slice(3).trim();
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].startsWith('```')) {
        codeLines.push(lines[i]);
        i++;
      }
      i++; // skip closing ```
      elements.push(
        <div key={i} className="my-3 rounded-xl overflow-hidden border border-[#26272b]">
          {lang && (
            <div className="px-4 py-1.5 bg-[#1a1b1f] border-b border-[#26272b] text-[11px] text-[#6b7280] font-mono">{lang}</div>
          )}
          <pre className="bg-[#141416] px-4 py-3 overflow-x-auto text-[0.825rem] text-[#c9d1d9] font-mono leading-relaxed">
            <code>{codeLines.join('\n')}</code>
          </pre>
        </div>
      );
      continue;
    }

    // Horizontal rule
    if (line.match(/^---+$/)) {
      elements.push(<hr key={i} className="border-[#26272b] my-3" />);
      i++;
      continue;
    }

    // Unordered list
    if (line.match(/^[-*]\s/)) {
      const items: string[] = [];
      while (i < lines.length && lines[i].match(/^[-*]\s/)) {
        items.push(lines[i].slice(2));
        i++;
      }
      elements.push(
        <ul key={i} className="list-disc pl-5 space-y-1 my-2">
          {items.map((item, j) => (
            <li key={j} className="text-[0.9375rem] text-[#e5e7eb]">{inlineFormat(item)}</li>
          ))}
        </ul>
      );
      continue;
    }

    // Ordered list
    if (line.match(/^\d+\.\s/)) {
      const items: string[] = [];
      while (i < lines.length && lines[i].match(/^\d+\.\s/)) {
        items.push(lines[i].replace(/^\d+\.\s/, ''));
        i++;
      }
      elements.push(
        <ol key={i} className="list-decimal pl-5 space-y-1 my-2">
          {items.map((item, j) => (
            <li key={j} className="text-[0.9375rem] text-[#e5e7eb]">{inlineFormat(item)}</li>
          ))}
        </ol>
      );
      continue;
    }

    // Empty line
    if (line.trim() === '') {
      elements.push(<div key={i} className="h-2" />);
      i++;
      continue;
    }

    // Paragraph
    elements.push(
      <p key={i} className="text-[0.9375rem] text-[#e5e7eb] leading-[1.75]">
        {inlineFormat(line)}
      </p>
    );
    i++;
  }

  return <>{elements}</>;
}

function inlineFormat(text: string): React.ReactNode {
  // Bold + italic + inline code
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i} className="font-semibold text-white">{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith('*') && part.endsWith('*')) {
      return <em key={i} className="italic">{part.slice(1, -1)}</em>;
    }
    if (part.startsWith('`') && part.endsWith('`')) {
      return (
        <code key={i} className="bg-[#1e1f23] border border-[#2d2e35] rounded px-1.5 py-0.5 text-[0.85em] font-mono text-[#e2e8f0]">
          {part.slice(1, -1)}
        </code>
      );
    }
    return part;
  });
}

export function MessageBubble({ message }: Props) {
  const isUser = message.role === 'user';
  const badge = PROVIDER_BADGES[message.provider] || { label: message.provider, color: '#6b7280' };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22, ease: 'easeOut' }}
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} items-start gap-3`}
    >
      {/* AI avatar */}
      {!isUser && (
        <div
          className="w-7 h-7 rounded-full border border-[#2d2e35] bg-[#1a1b1f] flex items-center justify-center text-[10px] font-semibold shrink-0 mt-0.5"
          style={{ color: badge.color }}
        >
          {badge.label[0].toUpperCase()}
        </div>
      )}

      <div className={`flex flex-col gap-1 ${isUser ? 'items-end' : 'items-start'} max-w-[88%]`}>
        {/* Provider label for AI */}
        {!isUser && (
          <div className="flex items-center gap-2 px-0.5">
            <span className="text-[11px] font-medium" style={{ color: badge.color }}>{badge.label}</span>
            <span className="text-[11px] text-[#4b4d57]">{formatTime(message.created_at)}</span>
          </div>
        )}

        {/* Bubble */}
        {isUser ? (
          <div className="bg-[#1e1f23] border border-[#2d2e35] rounded-2xl rounded-tr-sm px-4 py-3 text-[0.9375rem] text-[#f3f4f6] leading-[1.65] whitespace-pre-wrap">
            {message.content}
          </div>
        ) : (
          <div className="text-[0.9375rem] leading-[1.75]">
            {renderMarkdown(message.content)}
          </div>
        )}
      </div>
    </motion.div>
  );
}
