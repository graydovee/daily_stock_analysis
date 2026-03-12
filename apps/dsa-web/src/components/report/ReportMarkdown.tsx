import type React from 'react';
import { useEffect, useState } from 'react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { historyApi } from '../../api/history';

interface ReportMarkdownProps {
  recordId: number;
  stockName: string;
  stockCode: string;
  onClose: () => void;
}

/**
 * Markdown 报告抽屉组件
 * 从右侧滑出的抽屉，展示完整的 Markdown 格式分析报告
 */
export const ReportMarkdown: React.FC<ReportMarkdownProps> = ({
  recordId,
  stockName,
  stockCode,
  onClose,
}) => {
  const [content, setContent] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchMarkdown = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const markdownContent = await historyApi.getMarkdown(recordId);
        if (isMounted) {
          setContent(markdownContent);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : '加载报告失败');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchMarkdown();

    return () => {
      isMounted = false;
    };
  }, [recordId]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Prevent body scroll when drawer is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[60]">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="absolute right-0 top-0 bottom-0 w-full max-w-3xl bg-base shadow-2xl animate-slide-in-right flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-purple/20 flex items-center justify-center">
              <svg className="w-4 h-4 text-purple" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <h2 className="text-base font-semibold text-white">{stockName || stockCode}</h2>
              <p className="text-xs text-muted">完整分析报告</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors text-muted hover:text-white"
            title="关闭"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-64">
              <div className="w-10 h-10 border-3 border-purple/20 border-t-purple rounded-full animate-spin" />
              <p className="mt-4 text-secondary text-sm">加载报告中...</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center h-64">
              <div className="w-12 h-12 rounded-xl bg-danger/10 flex items-center justify-center mb-3">
                <svg className="w-6 h-6 text-danger" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <p className="text-danger text-sm">{error}</p>
              <button
                type="button"
                onClick={onClose}
                className="mt-4 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-sm text-secondary transition-colors"
              >
                关闭
              </button>
            </div>
          ) : (
            <div
              className="prose prose-invert prose-sm max-w-none
                prose-headings:text-white prose-headings:font-semibold prose-headings:mt-4 prose-headings:mb-2
                prose-h1:text-xl prose-h1:border-b prose-h1:border-white/10 prose-h1:pb-2
                prose-h2:text-lg prose-h2:text-purple
                prose-h3:text-base
                prose-p:leading-relaxed prose-p:mb-3 prose-p:last:mb-0
                prose-strong:text-white prose-strong:font-semibold
                prose-ul:my-2 prose-ol:my-2 prose-li:my-1
                prose-code:text-cyan prose-code:bg-cyan/10 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:before:content-none prose-code:after:content-none
                prose-pre:bg-elevated prose-pre:border prose-pre:border-white/10
                prose-table:border-collapse
                prose-th:border prose-th:border-white/20 prose-th:px-3 prose-th:py-2 prose-th:text-white prose-th:bg-elevated
                prose-td:border prose-td:border-white/20 prose-td:px-3 prose-td:py-2
                prose-hr:border-white/10 prose-hr:my-4
                prose-a:text-cyan prose-a:no-underline hover:prose-a:underline
                prose-blockquote:border-purple/30 prose-blockquote:bg-purple/5 prose-blockquote:py-2 prose-blockquote:px-4 prose-blockquote:rounded-r-lg
                prose-blockquote:text-secondary
                whitespace-pre-line break-words
            "
            >
              <Markdown remarkPlugins={[remarkGfm]}>
                {content}
              </Markdown>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-4 border-t border-white/10 bg-elevated/50">
          <p className="text-xs text-muted">
            报告格式与推送通知一致
          </p>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-sm text-secondary hover:text-white transition-colors"
          >
            关闭
          </button>
        </div>
      </div>

      {/* Animation styles */}
      <style>{`
        @keyframes slide-in-right {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0);
          }
        }
        .animate-slide-in-right {
          animation: slide-in-right 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};
