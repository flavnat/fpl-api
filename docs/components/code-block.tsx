"use client"

import { useState } from "react"
import { Highlight, themes } from "prism-react-renderer"
import { Check, Copy } from "lucide-react"
import { cn } from "@/lib/utils"

interface CodeBlockProps {
  code: string
  language?: string
  filename?: string
  showLineNumbers?: boolean
}

export function CodeBlock({ 
  code, 
  language = "typescript", 
  filename,
  showLineNumbers = false 
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false)

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="group relative my-4 overflow-hidden rounded-lg border border-border bg-[#0a0a0a]">
      {/* Header with filename and copy button */}
      <div className="flex items-center justify-between border-b border-border bg-[#0f0f0f] px-4 py-2">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="h-3 w-3 rounded-full bg-[#ff5f56]" />
            <div className="h-3 w-3 rounded-full bg-[#ffbd2e]" />
            <div className="h-3 w-3 rounded-full bg-[#27c93f]" />
          </div>
          {filename && (
            <span className="ml-2 text-xs text-muted-foreground">{filename}</span>
          )}
          {!filename && language && (
            <span className="ml-2 text-xs text-muted-foreground uppercase">{language}</span>
          )}
        </div>
        <button
          onClick={copyToClipboard}
          className={cn(
            "flex items-center gap-1.5 rounded-md px-2 py-1 text-xs transition-all",
            "text-muted-foreground hover:text-foreground hover:bg-accent",
            "opacity-0 group-hover:opacity-100 focus:opacity-100"
          )}
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5 text-green-500" />
              <span className="text-green-500">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Code content */}
      <Highlight theme={themes.nightOwl} code={code.trim()} language={language}>
        {({ className, style, tokens, getLineProps, getTokenProps }) => (
          <pre 
            className={cn(
              className,
              "overflow-x-auto p-4 text-sm leading-relaxed",
              "scrollbar-thin scrollbar-track-transparent scrollbar-thumb-border"
            )}
            style={{ ...style, background: "transparent", margin: 0 }}
          >
            {tokens.map((line, i) => (
              <div key={i} {...getLineProps({ line })} className="table-row">
                {showLineNumbers && (
                  <span className="table-cell select-none pr-4 text-right text-muted-foreground/50">
                    {i + 1}
                  </span>
                )}
                <span className="table-cell">
                  {line.map((token, key) => (
                    <span key={key} {...getTokenProps({ token })} />
                  ))}
                </span>
              </div>
            ))}
          </pre>
        )}
      </Highlight>
    </div>
  )
}
