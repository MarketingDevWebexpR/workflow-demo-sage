import React from 'react';
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuSeparator, ContextMenuTrigger } from '../../../../../components/ui/context-menu/context-menu';
import { Trash2, Plus, Copy, ArrowUp, ArrowDown } from 'lucide-react';


type WorkflowElementContextMenuProps = {
    children: React.ReactNode;
    onInsertBefore?: () => void;
    onInsertAfter?: () => void;
    onDelete?: () => void;
    onDuplicate?: () => void;
    onMoveUp?: () => void;
    onMoveDown?: () => void;
    disabled?: boolean;
};

export default function WorkflowElementContextMenu({
    children,
    onInsertBefore,
    onInsertAfter,
    onDelete,
    onDuplicate,
    onMoveUp,
    onMoveDown,
    disabled = false,
}: WorkflowElementContextMenuProps) {

    if (disabled) {
        return <>{children}</>;
    }

    return (
        <ContextMenu>
            <ContextMenuTrigger asChild>
                {children}
            </ContextMenuTrigger>
            <ContextMenuContent style={{ minWidth: '200px' }}>
                {onInsertBefore && (
                    <ContextMenuItem onSelect={onInsertBefore}>
                        <Plus size={16} style={{ marginRight: 'var(--spacing-2)', color: 'var(--primary-color-500)' }} />
                        Insert before
                    </ContextMenuItem>
                )}
                {onInsertAfter && (
                    <ContextMenuItem onSelect={onInsertAfter}>
                        <Plus size={16} style={{ marginRight: 'var(--spacing-2)', color: 'var(--primary-color-500)' }} />
                        Insert after
                    </ContextMenuItem>
                )}

                {(onInsertBefore || onInsertAfter) && (onDuplicate || onDelete || onMoveUp || onMoveDown) && (
                    <ContextMenuSeparator />
                )}

                {onDuplicate && (
                    <ContextMenuItem onSelect={onDuplicate}>
                        <Copy size={16} style={{ marginRight: 'var(--spacing-2)', color: 'var(--primary-color-500)' }} />
                        Duplicate
                    </ContextMenuItem>
                )}

                {(onMoveUp || onMoveDown) && (
                    <>
                        {onDuplicate && <ContextMenuSeparator />}
                        {onMoveUp && (
                            <ContextMenuItem onSelect={onMoveUp}>
                                <ArrowUp size={16} style={{ marginRight: 'var(--spacing-2)', color: 'var(--primary-color-500)' }} />
                                Move up
                            </ContextMenuItem>
                        )}
                        {onMoveDown && (
                            <ContextMenuItem onSelect={onMoveDown}>
                                <ArrowDown size={16} style={{ marginRight: 'var(--spacing-2)', color: 'var(--primary-color-500)' }} />
                                Move down
                            </ContextMenuItem>
                        )}
                    </>
                )}

                {onDelete && (
                    <>
                        {(onDuplicate || onMoveUp || onMoveDown) && <ContextMenuSeparator />}
                        <ContextMenuItem
                            onSelect={onDelete}
                        >
                            <Trash2 size={16} style={{ marginRight: 'var(--spacing-2)', color: 'var(--text-destructive)' }} />
                            Delete
                        </ContextMenuItem>
                    </>
                )}
            </ContextMenuContent>
        </ContextMenu>
    );
}

