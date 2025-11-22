import { Color } from '@tiptap/extension-color';
import ListItem from '@tiptap/extension-list-item'
import TextStyle from '@tiptap/extension-text-style'
import { EditorProvider, useCurrentEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import React from 'react'
import { Button } from '../../../button/button'
import { AlignCenter, AlignJustify, AlignLeft, AlignRight, Bold, Code, Heading, Italic, List, ListOrdered, Minus, Pilcrow, Quote, Strikethrough, } from 'lucide-react';
// import BubbleMenu from '@tiptap/extension-bubble-menu';
import TextAlign from '@tiptap/extension-text-align';
import Placeholder from '@tiptap/extension-placeholder';

import styles from "./rich-text-editor.module.scss";
import { cn } from '../../../../../lib/utils';


function Toolbar() {
    const { editor } = useCurrentEditor();

    if (!editor) {
        return null;
    }

    const anyToolbarButtonCN = styles.toolbarButton;
    const activableToolbarButtonCN = (name: string, attributes?: {}) => cn(
        anyToolbarButtonCN,
        editor.isActive(name, attributes) && styles.toolbarButtonActive,
    );

    return <div className={styles.toolbar}>
        <div className={styles.toolbarContent}>

            {/* <Button
                type="button"
                onClick={() => editor.chain().focus().setColor('#FF0000').run()} // Change la couleur en rouge
                variant="outline"
                className="w-[30px] h-[30px] p-0"
            >
            </Button> */}

            <div className={styles.toolbarGroup}>
                <div className={styles.toolbarGroupContent}>
                    {/* Gras */}
                    <Button
                        type="button"
                        onClick={() => editor.chain().focus().toggleBold().run()}
                        variant="outline"
                        className={activableToolbarButtonCN('bold')}
                        disabled={
                            !editor.can()
                                .chain()
                                .focus()
                                .toggleBold()
                                .run()
                        }
                        tabIndex={-1}
                    ><Bold size={12} /></Button>

                    {/* Italic */}
                    <Button
                        type="button"
                        onClick={() => editor.chain().focus().toggleItalic().run()}
                        variant="outline"
                        disabled={
                            !editor.can()
                                .chain()
                                .focus()
                                .toggleItalic()
                                .run()
                        }
                        className={activableToolbarButtonCN('italic')}
                        tabIndex={-1}
                    ><Italic size={12} /></Button>

                    {/* Strike */}
                    <Button
                        type="button"
                        onClick={() => editor.chain().focus().toggleStrike().run()}
                        variant="outline"
                        disabled={
                            !editor.can()
                                .chain()
                                .focus()
                                .toggleStrike()
                                .run()
                        }
                        className={activableToolbarButtonCN('strike')}
                        tabIndex={-1}
                    >
                        <Strikethrough size={12} />
                    </Button>
                </div>
            </div>

            <div className={styles.toolbarGroup}>
                <div className={styles.toolbarGroupContent}>
                    {/* Text align left */}
                    <Button
                        type="button"
                        onClick={() => editor.chain().focus().setTextAlign('left').run()}
                        variant="outline"
                        className={activableToolbarButtonCN('textAlign', { align: 'left' })}
                        tabIndex={-1}
                    >
                        <AlignLeft size={12} />
                    </Button>

                    {/* Text align center */}
                    <Button
                        type="button"
                        onClick={() => editor.chain().focus().setTextAlign('center').run()}
                        variant="outline"
                        className={activableToolbarButtonCN('textAlign', { align: 'center' })}
                        tabIndex={-1}
                    >
                        <AlignCenter size={12} />
                    </Button>

                    {/* Text align right */}
                    <Button
                        type="button"
                        onClick={() => editor.chain().focus().setTextAlign('right').run()}
                        variant="outline"
                        className={activableToolbarButtonCN('textAlign', { align: 'right' })}
                        tabIndex={-1}
                    >
                        <AlignRight size={12} />
                    </Button>

                    {/* Text align justify */}
                    <Button
                        type="button"
                        onClick={() => editor.chain().focus().setTextAlign('justify').run()}
                        variant="outline"
                        className={activableToolbarButtonCN('textAlign', { align: 'justify' })}
                        tabIndex={-1}
                    >
                        <AlignJustify size={12} />
                    </Button>
                </div>
            </div>

            <div className={styles.toolbarGroup}>
                <div className={styles.toolbarGroupContent}>
                    {/* Paragraph */}
                    <Button
                        type="button"
                        onClick={() => editor.chain().focus().setParagraph().run()}
                        variant="outline"
                        className={activableToolbarButtonCN('paragraph')}
                        tabIndex={-1}
                    >
                        <Pilcrow size={12} />
                    </Button>

                    {/* Heading levels */}
                    {[1, 2, 3,].map((level) => (
                        <Button
                            type="button"
                            key={level}
                            onClick={() => editor.chain().focus().toggleHeading({ level: level as any, }).run()}
                            variant="outline"
                            className={activableToolbarButtonCN('heading', { level })}
                            tabIndex={-1}
                        >
                            <Heading size={12} /><span className="text-xs">{level}</span>
                        </Button>
                    ))}
                </div>
            </div>

            <div className={styles.toolbarGroup}>
                <div className={styles.toolbarGroupContent}>
                    {/* Bullet list */}
                    <Button
                        type="button"
                        onClick={() => editor.chain().focus().toggleBulletList().run()}
                        variant="outline"
                        className={activableToolbarButtonCN('bulletList')}
                        tabIndex={-1}
                    >
                        <List size={12} />
                    </Button>

                    {/* Ordered list */}
                    <Button
                        type="button"
                        onClick={() => editor.chain().focus().toggleOrderedList().run()}
                        variant="outline"
                        className={activableToolbarButtonCN('orderedList')}
                        tabIndex={-1}
                    >
                        <ListOrdered size={12} />
                    </Button>
                </div>
            </div>

            <div className={styles.toolbarGroup}>
                <div className={styles.toolbarGroupContent}>
                    {/* Code block */}
                    <Button
                        type="button"
                        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                        variant="outline"
                        className={activableToolbarButtonCN('codeBlock')}
                        tabIndex={-1}
                        >
                        <Code size={12} />
                    </Button>

                    {/* Blockquote */}
                    <Button
                        type="button"
                        onClick={() => editor.chain().focus().toggleBlockquote().run()}
                        variant="outline"
                        className={activableToolbarButtonCN('blockquote')}
                        tabIndex={-1}
                    >
                        <Quote size={12} />
                    </Button>

                    {/* Horizontal rule */}
                    <Button
                        type="button"
                        onClick={() => editor.chain().focus().setHorizontalRule().run()}
                        variant="outline"
                        className={anyToolbarButtonCN}
                        tabIndex={-1}
                    >
                        <Minus size={12} />
                    </Button>
                </div>
            </div>

        </div>
    </div>;
}

const createExtensions = (placeholder?: string) => [
    Color.configure({ types: [TextStyle.name, ListItem.name] }),
    TextStyle,
    StarterKit.configure({
        bulletList: {
            keepMarks: true,
            keepAttributes: false, // TODO : Making this as `false` becase marks are not preserved when I try to preserve attrs, awaiting a bit of help
        },
        orderedList: {
            keepMarks: true,
            keepAttributes: false, // TODO : Making this as `false` becase marks are not preserved when I try to preserve attrs, awaiting a bit of help
        },
    }),
    // BubbleMenu.configure({
    //     element: document.querySelector('header'),
    //     tippyOptions: {
    //         duration: 100,
    //         theme: 'light-border',
    //     },
    // }),
    TextAlign.configure({
        types: ['heading', 'paragraph'],
    }),
    ...(placeholder ? [
        Placeholder.configure({
            placeholder,
            emptyEditorClass: 'is-editor-empty',
            emptyNodeClass: 'is-node-empty',
            showOnlyWhenEditable: true,
            includeChildren: true,
        })
    ] : []),
];


interface IRichTextEditor {
    className?: string,
    value?: string,
    onChange?: (value: string) => void,
    readOnly?: boolean,
    placeholder?: string,
    minHeight?: number,
}

// Styles CSS intégrés pour le placeholder
const placeholderStyles = `
.ProseMirror p.is-node-empty:first-child::before,
.ProseMirror h1.is-node-empty::before,
.ProseMirror h2.is-node-empty::before,
.ProseMirror h3.is-node-empty::before,
.ProseMirror h4.is-node-empty::before,
.ProseMirror h5.is-node-empty::before,
.ProseMirror h6.is-node-empty::before {
  content: attr(data-placeholder);
  float: left;
  color: #757575;
  pointer-events: none;
  height: 0;
}

.ProseMirror .is-empty::before {
  content: attr(data-placeholder);
  float: left;
  color: #757575;
  pointer-events: none;
  height: 0;
}
`;

export default function RichTextEditor({
    className,
    value,
    onChange,
    readOnly,
    placeholder,
    minHeight,
}: IRichTextEditor): React.ReactElement {

    console.log('RichTextEditor', { value });
    return (
        <>
            <style>{placeholderStyles}</style>
            <EditorProvider
                slotBefore={readOnly ? null : <Toolbar />}
                extensions={createExtensions(placeholder)}
                content={value}
                editable={!readOnly}
                editorProps={{
                    attributes: {
                        class: readOnly ? '' : styles.richTextEditor,
                        style: `--min-height: ${minHeight}px`,
                    },
                }}
                editorContainerProps={{
                    className: cn(
                        !readOnly && styles.richTextEditorContainer,
                        className,
                    ),
                }}
                onUpdate={({ editor, }) => {
                    let html = editor.getHTML();
                    html = html === '<p></p>' ? '' : html;
                    onChange?.(html);
                }}
            />
        </>
    );
}