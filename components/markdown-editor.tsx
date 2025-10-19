"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import ReactMarkdown from "react-markdown"

interface MarkdownEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export function MarkdownEditor({
  value,
  onChange,
  placeholder = "Write your content in Markdown...",
}: MarkdownEditorProps) {
  const [tab, setTab] = useState("write")

  return (
    <Tabs value={tab} onValueChange={setTab} className="w-full">
      <TabsList>
        <TabsTrigger value="write">Write</TabsTrigger>
        <TabsTrigger value="preview">Preview</TabsTrigger>
      </TabsList>

      <TabsContent value="write" className="mt-4">
        <Textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="min-h-96 font-mono text-sm"
        />
      </TabsContent>

      <TabsContent value="preview" className="mt-4">
        <div className="border rounded-lg p-6 min-h-96 bg-muted/50 prose prose-sm dark:prose-invert max-w-none">
          {value ? (
            <ReactMarkdown>{value}</ReactMarkdown>
          ) : (
            <p className="text-muted-foreground">Nothing to preview yet...</p>
          )}
        </div>
      </TabsContent>
    </Tabs>
  )
}
