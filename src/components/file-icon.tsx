import React from 'react'; // Import React for ComponentType
import {
    FileText,
    FileJson,
    FileArchive,
    FileCode2,
    ImageIcon,
    Mic,
    Video,
    Code,
    Sheet,
    BookText,
    File,
    Parentheses,
    type LucideProps // Import LucideProps type for better typing
} from "lucide-react";

// Define the type for the icon components we are using
type IconComponentType = React.ComponentType<LucideProps>;

type Props = {
    fileType: string; // MIME type
    fileName?: string;
    className?: string;
    size?: number;
};

// Helper to get lower-case extension
const getExtension = (fileName: string = ""): string => {
    try {
        const cleanName = fileName.split(/[?#]/)[0]; // Remove query/hash
        const parts = cleanName.split(".");
        return parts.length > 1 ? parts.pop()!.toLowerCase() : "";
    } catch {
        return "";
    }
};


// --- Configuration Map ---
// Define mappings from conditions to Icon Components.
// Order matters: More specific rules should come before general ones.
// Rule Types: 'mime_exact', 'mime_starts', 'mime_includes', 'ext_exact'

const iconMappings: [string, string, IconComponentType][] = [
    // MIME: Specific types first
    ['mime_starts', 'image/', ImageIcon],
    ['mime_starts', 'audio/', Mic],
    ['mime_starts', 'video/', Video],
    ['mime_exact', 'application/pdf', FileText],
    ['mime_exact', 'application/json', FileJson],
    ['mime_exact', 'application/zip', FileArchive],
    ['mime_includes', 'xml', Code],
    ['mime_includes', 'markdown', BookText],

    // EXT: Specific extension-based logic comes earlier now
    ['ext_exact', 'ts', FileCode2],
    ['ext_exact', 'tsx', FileCode2],
    ['ext_exact', 'js', FileCode2],
    ['ext_exact', 'jsx', FileCode2],
    ['ext_exact', 'py', FileCode2],
    ['ext_exact', 'sh', FileCode2],
    ['ext_exact', 'html', FileCode2],
    ['ext_exact', 'css', FileCode2],
    ['ext_exact', 'doc', FileText],
    ['ext_exact', 'docx', FileText],
    ['ext_exact', 'pdf', FileText],
    ['ext_exact', 'md', Parentheses],
    ['ext_exact', 'csv', Sheet],
    ['ext_exact', 'xls', Sheet],
    ['ext_exact', 'xlsx', Sheet],
    ['ext_exact', 'zip', FileArchive],
    ['ext_exact', 'rar', FileArchive],
    ['ext_exact', '7z', FileArchive],
    ['ext_exact', 'yml', FileJson],
    ['ext_exact', 'yaml', FileJson],
    ['ext_exact', 'json', FileJson],
    ['ext_exact', 'xml', Code],

    // MIME: Generic fallback comes later
    ['mime_starts', 'text/', FileText],
    ['mime_starts', 'application/', FileCode2],
];


// --- The Component ---
export const FileIcon = ({
    fileType,
    fileName = "",
    className = "text-muted-foreground", // Default class
    size = 20, // Default size
}: Props) => {
    const ext = getExtension(fileName);
    const safeFileType = fileType || ""; // Ensure fileType is a string

    let SelectedIcon: IconComponentType = File; // Default Icon

    // Find the first matching rule in our configuration
    for (const [ruleType, value, IconComponent] of iconMappings) {
        let match = false;
        switch (ruleType) {
            case 'ext_exact':
                // Only match extension if it's not empty
                match = ext !== "" && ext === value;
                break;
            case 'mime_exact':
                match = safeFileType === value;
                break;
            case 'mime_starts':
                match = safeFileType.startsWith(value);
                break;
            case 'mime_includes':
                match = safeFileType.includes(value);
                break;
        }

        if (match) {
            SelectedIcon = IconComponent;
            break; // Stop searching once a match is found
        }
    }

    // Pass size and className directly to the selected Lucide icon component
    return <SelectedIcon size={size} className={className} />;
};