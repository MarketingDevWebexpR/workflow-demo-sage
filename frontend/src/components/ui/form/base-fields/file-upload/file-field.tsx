import React, { useRef, useState, DragEvent, useContext } from "react";
import { Button } from "../../../button/button";
import { Eye, RefreshCw, X, FileText, FileX, FileImage, FileSpreadsheet, FileVideo, FileAudio, FileArchive, File, ArrowDown, FileUp } from "lucide-react";
import { DragContext } from "../../../../../contexts/drag.context";
import { cn } from "../../../../../lib/utils";
import styles from "./file-upload.module.scss";


interface IUploadFieldProps {
    value?: File | string;
    onChange: (file: File | null) => void;
    accept?: string;
}

const fileIcons: Record<string, { icon: React.ElementType; iconClass: string }> = {
    pdf: { icon: FileX, iconClass: styles.fileIconTypePdf },
    doc: { icon: FileText, iconClass: styles.fileIconTypeDoc },
    docx: { icon: FileText, iconClass: styles.fileIconTypeDocx },
    odt: { icon: FileText, iconClass: styles.fileIconTypeOdt },
    txt: { icon: FileText, iconClass: styles.fileIconTypeTxt },
    rtf: { icon: FileText, iconClass: styles.fileIconTypeRtf },

    xls: { icon: FileSpreadsheet, iconClass: styles.fileIconTypeXls },
    xlsx: { icon: FileSpreadsheet, iconClass: styles.fileIconTypeXlsx },
    ods: { icon: FileSpreadsheet, iconClass: styles.fileIconTypeOds },
    csv: { icon: FileSpreadsheet, iconClass: styles.fileIconTypeCsv },

    ppt: { icon: FileText, iconClass: styles.fileIconTypePpt },
    pptx: { icon: FileText, iconClass: styles.fileIconTypePptx },
    odp: { icon: FileText, iconClass: styles.fileIconTypeOdp },

    png: { icon: FileImage, iconClass: styles.fileIconTypePng },
    jpg: { icon: FileImage, iconClass: styles.fileIconTypeJpg },
    jpeg: { icon: FileImage, iconClass: styles.fileIconTypeJpeg },
    gif: { icon: FileImage, iconClass: styles.fileIconTypeGif },
    svg: { icon: FileImage, iconClass: styles.fileIconTypeSvg },
    webp: { icon: FileImage, iconClass: styles.fileIconTypeWebp },

    mp4: { icon: FileVideo, iconClass: styles.fileIconTypeMp4 },
    avi: { icon: FileVideo, iconClass: styles.fileIconTypeAvi },
    mov: { icon: FileVideo, iconClass: styles.fileIconTypeMov },
    mkv: { icon: FileVideo, iconClass: styles.fileIconTypeMkv },
    webm: { icon: FileVideo, iconClass: styles.fileIconTypeWebm },

    mp3: { icon: FileAudio, iconClass: styles.fileIconTypeMp3 },
    wav: { icon: FileAudio, iconClass: styles.fileIconTypeWav },
    flac: { icon: FileAudio, iconClass: styles.fileIconTypeFlac },
    ogg: { icon: FileAudio, iconClass: styles.fileIconTypeOgg },

    zip: { icon: FileArchive, iconClass: styles.fileIconTypeZip },
    rar: { icon: FileArchive, iconClass: styles.fileIconTypeRar },
    tar: { icon: FileArchive, iconClass: styles.fileIconTypeTar },
    "7z": { icon: FileArchive, iconClass: styles.fileIconType7z },
};


export default function FileField({ value, onChange, accept }: IUploadFieldProps): React.ReactElement {
    const { isDraggingFile, setIsDraggingFile } = useContext(DragContext);
    const [isDragOver, setIsDragOver] = useState(false);
    const inputFileRef = useRef<HTMLInputElement>(null);

    const handleReset = () => onChange(null);
    const handlePreview = () => {
        if (value instanceof window.File) {
            window.open(URL.createObjectURL(value));
        } else if (typeof value === "string") {
            window.open(value +'?web=1');
        } else {
            alert("Impossible de prévisualiser ce document.");
        }
    };
    const handleReload = () => inputFileRef.current?.click();

    const handleDragOver = (e: DragEvent) => {
        e.preventDefault();
        setIsDragOver(true);
    };
    const handleDragEnter = (e: DragEvent) => {
        e.preventDefault();
        setIsDragOver(true);
    };
    const handleDragLeave = (e: DragEvent) => {
        e.preventDefault();
        setIsDragOver(false);
    };
    const handleDrop = (e: DragEvent) => {
        e.preventDefault();
        setIsDragOver(false);
        const [file] = Array.from(e.dataTransfer.files);
        onChange(file);
        setIsDraggingFile(false);
    };

    const IS_FILE = value instanceof window.File;
    const IS_URL = typeof value === 'string';
    const fileName = value && IS_FILE
        ? (value as File).name
        : value && IS_URL
            ? value.split("/").pop()
            : null;

    const fileType = fileName ? fileName.split(".").pop()?.toLowerCase() : null;
    const fileIcon = fileIcons[fileType!] || { icon: File, iconClass: styles.fileIconTypeDefault };

    return (
        <div>
            <div
                className={cn(
                    styles.fileUploadField,
                    isDraggingFile && styles.fileUploadFieldDragActive,
                    isDragOver && styles.fileUploadFieldDragOver,
                    // {
                    //     "border-primary bg-primary/10 border-2 border-dashed": isDraggingFile,
                    // },
                    // {
                    //     "bg-primary/20": isDragOver,
                    // }
                )}
                onDragOver={handleDragOver}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => inputFileRef.current?.click()}
            >
                {
                    fileName
                        ? (
                            <div className={styles.fileUploadFileName}>
                                    <fileIcon.icon size={16} className={fileIcon.iconClass} />
                                <span>{fileName}</span>
                            </div>
                        )
                        : (
                            isDraggingFile
                                ? <div className={styles.fileUploadFileName}>
                                    <ArrowDown size={16} />
                                    <span>Drop your file here</span>
                                </div>
                                : <div className={styles.fileUploadFileName}>
                                    <FileUp size={16} />
                                    <span>Drop or click to upload a file</span>
                                </div>
                        )}
                <input
                    ref={inputFileRef}
                    type="file"
                    className={styles.fileUploadInputFileHidden}
                    accept={accept}
                    onChange={(e) => {
                        const [file] = Array.from(e.target.files || []);
                        onChange(file || null);
                    }}
                />
            </div>
            {value && (
                <div className="mt-1 flex gap-1">
                    <Button variant="ghost" size="icon" className="rounded-full" onClick={handlePreview} title="Prévisualiser">
                        <Eye size={16} />
                    </Button>
                    <Button variant="ghost" size="icon" className="rounded-full" onClick={handleReload} title="Remplacer">
                        <RefreshCw size={16} />
                    </Button>
                    <Button variant="ghost" size="icon" className="rounded-full text-red-500" onClick={handleReset} title="Supprimer">
                        <X size={16} />
                    </Button>
                </div>
            )}
        </div>
    );
}
