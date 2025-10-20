"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import {
  Bold,
  Italic,
  Strikethrough,
  Code,
  List,
  ListOrdered,
  Quote,
  Undo,
  Redo,
  Heading1,
  Heading2,
  Heading3,
  ImageIcon,
  Link as LinkIcon,
} from "lucide-react";
import { Button } from "./ui/button";
import { useState } from "react";

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

export function RichTextEditor({
  content,
  onChange,
  placeholder,
}: RichTextEditorProps) {
  const [imageUrl, setImageUrl] = useState("");
  const [showImageInput, setShowImageInput] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const [showLinkInput, setShowLinkInput] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.configure({
        HTMLAttributes: {
          class: "rounded-lg max-w-full h-auto",
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-emerald-600 dark:text-[#00ff9d] hover:underline",
        },
      }),
      Placeholder.configure({
        placeholder: placeholder || "Start writing your post...",
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          "prose prose-lg dark:prose-invert max-w-none focus:outline-none min-h-[400px] p-6 text-gray-900 dark:text-white bg-white dark:bg-black [&_*]:text-gray-900 dark:[&_*]:text-white [&_p]:text-gray-900 dark:[&_p]:text-white [&_h1]:text-gray-900 dark:[&_h1]:text-white [&_h2]:text-gray-900 dark:[&_h2]:text-white [&_h3]:text-gray-900 dark:[&_h3]:text-white [&_li]:text-gray-900 dark:[&_li]:text-white [&_strong]:text-gray-900 dark:[&_strong]:text-white",
      },
    },
  });

  if (!editor) {
    return null;
  }

  const addImage = () => {
    if (imageUrl) {
      editor.chain().focus().setImage({ src: imageUrl }).run();
      setImageUrl("");
      setShowImageInput(false);
    }
  };

  const addLink = () => {
    if (linkUrl) {
      editor.chain().focus().setLink({ href: linkUrl }).run();
      setLinkUrl("");
      setShowLinkInput(false);
    }
  };

  return (
    <div className="border border-gray-300 dark:border-white/20 rounded-md overflow-hidden bg-white dark:bg-black">
      {/* Toolbar */}
      <div className="border-b border-gray-300 dark:border-white/20 p-2 flex flex-wrap gap-1 bg-gray-50 dark:bg-white/5">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`text-gray-700 dark:text-white hover:bg-gray-200 dark:hover:bg-white/10 ${
            editor.isActive("bold") ? "bg-gray-200 dark:bg-white/20" : ""
          }`}>
          <Bold className="w-4 h-4" />
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`text-gray-700 dark:text-white hover:bg-gray-200 dark:hover:bg-white/10 ${
            editor.isActive("italic") ? "bg-gray-200 dark:bg-white/20" : ""
          }`}>
          <Italic className="w-4 h-4" />
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={`text-gray-700 dark:text-white hover:bg-gray-200 dark:hover:bg-white/10 ${
            editor.isActive("strike") ? "bg-gray-200 dark:bg-white/20" : ""
          }`}>
          <Strikethrough className="w-4 h-4" />
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleCode().run()}
          className={`text-gray-700 dark:text-white hover:bg-gray-200 dark:hover:bg-white/10 ${
            editor.isActive("code") ? "bg-gray-200 dark:bg-white/20" : ""
          }`}>
          <Code className="w-4 h-4" />
        </Button>

        <div className="w-px h-6 bg-gray-300 dark:bg-white/20 mx-1" />

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
          className={`text-gray-700 dark:text-white hover:bg-gray-200 dark:hover:bg-white/10 ${
            editor.isActive("heading", { level: 1 })
              ? "bg-gray-200 dark:bg-white/20"
              : ""
          }`}>
          <Heading1 className="w-4 h-4" />
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          className={`text-gray-700 dark:text-white hover:bg-gray-200 dark:hover:bg-white/10 ${
            editor.isActive("heading", { level: 2 })
              ? "bg-gray-200 dark:bg-white/20"
              : ""
          }`}>
          <Heading2 className="w-4 h-4" />
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
          className={`text-gray-700 dark:text-white hover:bg-gray-200 dark:hover:bg-white/10 ${
            editor.isActive("heading", { level: 3 })
              ? "bg-gray-200 dark:bg-white/20"
              : ""
          }`}>
          <Heading3 className="w-4 h-4" />
        </Button>

        <div className="w-px h-6 bg-gray-300 dark:bg-white/20 mx-1" />

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`text-gray-700 dark:text-white hover:bg-gray-200 dark:hover:bg-white/10 ${
            editor.isActive("bulletList") ? "bg-gray-200 dark:bg-white/20" : ""
          }`}>
          <List className="w-4 h-4" />
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`text-gray-700 dark:text-white hover:bg-gray-200 dark:hover:bg-white/10 ${
            editor.isActive("orderedList") ? "bg-gray-200 dark:bg-white/20" : ""
          }`}>
          <ListOrdered className="w-4 h-4" />
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`text-gray-700 dark:text-white hover:bg-gray-200 dark:hover:bg-white/10 ${
            editor.isActive("blockquote") ? "bg-gray-200 dark:bg-white/20" : ""
          }`}>
          <Quote className="w-4 h-4" />
        </Button>

        <div className="w-px h-6 bg-gray-300 dark:bg-white/20 mx-1" />

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => setShowImageInput(!showImageInput)}
          className="text-gray-700 dark:text-white hover:bg-gray-200 dark:hover:bg-white/10">
          <ImageIcon className="w-4 h-4" />
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => setShowLinkInput(!showLinkInput)}
          className="text-gray-700 dark:text-white hover:bg-gray-200 dark:hover:bg-white/10">
          <LinkIcon className="w-4 h-4" />
        </Button>

        <div className="w-px h-6 bg-gray-300 dark:bg-white/20 mx-1" />

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().undo().run()}
          className="text-gray-700 dark:text-white hover:bg-gray-200 dark:hover:bg-white/10">
          <Undo className="w-4 h-4" />
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().redo().run()}
          className="text-gray-700 dark:text-white hover:bg-gray-200 dark:hover:bg-white/10">
          <Redo className="w-4 h-4" />
        </Button>
      </div>

      {/* Image Input */}
      {showImageInput && (
        <div className="p-3 border-b border-gray-300 dark:border-white/20 bg-gray-50 dark:bg-white/5 flex gap-2">
          <input
            type="url"
            placeholder="Enter image URL"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 dark:border-white/20 rounded-md bg-white dark:bg-black text-gray-900 dark:text-white text-sm placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:focus:ring-[#00ff9d]"
          />
          <Button
            type="button"
            size="sm"
            onClick={addImage}
            className="bg-emerald-600 hover:bg-emerald-700 dark:bg-[#00ff9d] dark:hover:bg-[#00e68a] text-white dark:text-black">
            Add
          </Button>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() => setShowImageInput(false)}
            className="border-gray-300 dark:border-white/20 text-gray-700 dark:text-white">
            Cancel
          </Button>
        </div>
      )}

      {/* Link Input */}
      {showLinkInput && (
        <div className="p-3 border-b border-gray-300 dark:border-white/20 bg-gray-50 dark:bg-white/5 flex gap-2">
          <input
            type="url"
            placeholder="Enter link URL"
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 dark:border-white/20 rounded-md bg-white dark:bg-black text-gray-900 dark:text-white text-sm placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:focus:ring-[#00ff9d]"
          />
          <Button
            type="button"
            size="sm"
            onClick={addLink}
            className="bg-emerald-600 hover:bg-emerald-700 dark:bg-[#00ff9d] dark:hover:bg-[#00e68a] text-white dark:text-black">
            Add
          </Button>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() => setShowLinkInput(false)}
            className="border-gray-300 dark:border-white/20 text-gray-700 dark:text-white">
            Cancel
          </Button>
        </div>
      )}

      {/* Editor Content */}
      <EditorContent
        editor={editor}
        className="prose-headings:text-gray-900 dark:prose-headings:text-white prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-strong:text-gray-900 dark:prose-strong:text-white prose-code:text-emerald-600 dark:prose-code:text-[#00ff9d] prose-blockquote:text-gray-600 dark:prose-blockquote:text-gray-400 prose-blockquote:border-emerald-500 dark:prose-blockquote:border-[#00ff9d]"
      />
    </div>
  );
}
