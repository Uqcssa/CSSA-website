'use client'

import { Toggle } from '@/components/ui/toggle'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import CharacterCount from '@tiptap/extension-character-count'
import Typography from '@tiptap/extension-typography'
import { Bold, Italic, List, ListOrdered, Strikethrough } from 'lucide-react'
import { useFormContext } from 'react-hook-form'
import { useEffect } from 'react'
import Link from '@tiptap/extension-link'


const Tiptap = ({val}: {val: string}) => {
  const { setValue } = useFormContext() //
  const limit = 1500;
  const editor = useEditor({
    extensions: [
      //set the style of orderedList
      StarterKit.configure({
        orderedList: {
          HTMLAttributes:{
            class: "list-decimal pl-4",
          }
        },
        bulletList:{
          HTMLAttributes:{
            class:"list-disc pl-4",
          }
        }
      }),
      Link.configure({
        openOnClick: false, // 你可以根据需要设置
        autolink: true,
        linkOnPaste: true,
      }),
      CharacterCount.configure({
        limit,
      }),
      Typography,
    ],

    onUpdate:({editor}) =>{
      const content = editor.getHTML() // get the content from the description textarea.the format of content can be json getJSON()
      setValue("description", content, {
        shouldValidate: true,
        shouldDirty: true,
      })
    },

    editorProps:{
      attributes:{
        class: "min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 "
      }
    },
    content: val,
  })

 

  const percentage = editor
    ? Math.round((100 / limit ) * editor.storage.characterCount.characters())
    : 0;
  //set content when the description is in edit mode
  useEffect(() => {
    if (editor?.isEmpty) editor.commands.setContent(val)
  }, [val])

  return(
    <div className='flex flex-col gap-3'>
      {editor && (
        <div className="border-input border rounded-md">
          <Toggle
            pressed={editor.isActive("bold")}
            onPressedChange={() => editor.chain().focus().toggleBold().run()}
            size={"sm"}
          >
            <Bold className="w-5 h-5" />
          </Toggle>
          <Toggle
            pressed={editor.isActive("italic")}
            onPressedChange={() => editor.chain().focus().toggleItalic().run()}
            size={"sm"}
          >
            <Italic className="w-5 h-5" />
          </Toggle>
          <Toggle
            pressed={editor.isActive("strike")}
            onPressedChange={()=> editor.chain().focus().toggleStrike().run()}
            size={"sm"}
          >
            <Strikethrough className="w-5 h-5" />
          </Toggle>
          <Toggle
            pressed={editor.isActive("orderedList")}
            onPressedChange={() =>
              editor.chain().focus().toggleOrderedList().run()
            }
            size={"sm"}
          >
            <ListOrdered className="w-5 h-5" />
          </Toggle>
          <Toggle
            pressed={editor.isActive("bulletList")}
            onPressedChange={() =>
              editor.chain().focus().toggleBulletList().run()
            }
            size={"sm"}
          >
            <List className="w-5 h-5" />
          </Toggle>
        </div>
      )}
      
      
      <EditorContent editor={editor}
      
      />
      <div className={`character-count ${editor?.storage.characterCount.characters() === limit ? 'character-count--warning' : ''} flex items-center gap-3`}>
        <svg
          height="20"
          width="20"
          viewBox="0 0 20 20"
        >
          <circle
            r="10"
            cx="10"
            cy="10"
            fill="#e9ecef"
          />
          <circle
            r="5"
            cx="10"
            cy="10"
            fill="transparent"
            stroke="#0070f3"
            strokeWidth="10"
            strokeDasharray={`calc(${percentage} * 31.4 / 100) 31.4`}
            transform="rotate(-90) translate(-20)"
          />
          <circle
            r="6"
            cx="10"
            cy="10"
            fill="white"
          />
        </svg>
        <p className='text-blue-600 text-sm'>{editor?.storage.characterCount.characters()} / {limit} characters</p>
        
      </div>
    </div>
    
  ) 
}

export default Tiptap
