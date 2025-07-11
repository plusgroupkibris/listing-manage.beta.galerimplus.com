"use client"

import type React from "react"


interface MarkdownRendererProps {
  markdown: string
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ markdown }) => {
  const parseMarkdown = (text: string): string => {
    let html = text

    // Headers (h1-h6)
    html = html.replace(/^### (.*$)/gim, '<h3 class="text-lg font-semibold mt-4 mb-2">$1</h3>')
    html = html.replace(/^## (.*$)/gim, '<h2 class="text-xl font-semibold mt-6 mb-3">$1</h2>')
    html = html.replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold mt-8 mb-4">$1</h1>')
    html = html.replace(/^#### (.*$)/gim, '<h4 class="text-base font-semibold mt-3 mb-2">$1</h4>')
    html = html.replace(/^##### (.*$)/gim, '<h5 class="text-sm font-semibold mt-2 mb-1">$1</h5>')
    html = html.replace(/^###### (.*$)/gim, '<h6 class="text-xs font-semibold mt-2 mb-1">$1</h6>')

    // Bold text
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold">$1</strong>')
    html = html.replace(/__(.*?)__/g, '<strong class="font-bold">$1</strong>')

    // Italic text
    html = html.replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
    html = html.replace(/_(.*?)_/g, '<em class="italic">$1</em>')

    // Strikethrough
    html = html.replace(/~~(.*?)~~/g, '<del class="line-through">$1</del>')

    // Inline code
    html = html.replace(/`([^`]+)`/g, '<code class="bg-gray-100 px-1 py-0.5 rounded text-sm font-mono">$1</code>')

    // Code blocks
    html = html.replace(/```(\w+)?\n([\s\S]*?)```/g, (match, lang, code) => {
      return `<pre class="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto my-4"><code class="font-mono text-sm">${code.trim()}</code></pre>`
    })

    // Links
    html = html.replace(
      /\[([^\]]+)\]$$([^)]+)$$/g,
      '<a href="$2" class="text-blue-600 hover:text-blue-800 underline">$1</a>',
    )

    // Images
    html = html.replace(
      /!\[([^\]]*)\]$$([^)]+)$$/g,
      '<img src="$2" alt="$1" class="max-w-full h-auto rounded-lg my-4" />',
    )

    // Unordered lists
    html = html.replace(/^\* (.+)$/gm, '<li class="ml-4">$1</li>')
    html = html.replace(/^- (.+)$/gm, '<li class="ml-4">$1</li>')
    html = html.replace(/(<li class="ml-4">.*<\/li>)/s, '<ul class="list-disc list-inside space-y-1 my-2">$1</ul>')

    // Ordered lists
    html = html.replace(/^\d+\. (.+)$/gm, '<li class="ml-4">$1</li>')

    // Blockquotes
    html = html.replace(
      /^> (.+)$/gm,
      '<blockquote class="border-l-4 border-gray-300 pl-4 italic text-gray-600 my-4">$1</blockquote>',
    )

    // Horizontal rules
    html = html.replace(/^---$/gm, '<hr class="border-t border-gray-300 my-6" />')
    html = html.replace(/^\*\*\*$/gm, '<hr class="border-t border-gray-300 my-6" />')

    // Paragraphs
    html = html.replace(/\n\n/g, '</p><p class="mb-4">')
    html = '<p class="mb-4">' + html + "</p>"

    // Clean up empty paragraphs
    html = html.replace(/<p class="mb-4"><\/p>/g, "")

    return html
  }

  return <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: parseMarkdown(markdown) }} />
}

export default MarkdownRenderer