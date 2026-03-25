import { Button, DialogRoot, DialogBackdrop, DialogPositioner, DialogContent, DialogHeader, DialogTitle, DialogBody, DialogDescription, DialogFooter, HStack } from '@chakra-ui/react';

interface ConfirmDialogProps {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    description: string;
    confirmLabel?: string;
    loading?: boolean;
}

const ConfirmDialog = ({
    open,
    onClose,
    onConfirm,
    title,
    description,
    confirmLabel = '削除',
    loading = false,
}: ConfirmDialogProps) => {
    return (
        <DialogRoot open={open} onOpenChange={(e) => { if (!e.open) onClose(); }}>
            <DialogBackdrop />
            <DialogPositioner>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{title}</DialogTitle>
                    </DialogHeader>
                    <DialogBody>
                        <DialogDescription>{description}</DialogDescription>
                    </DialogBody>
                    <DialogFooter>
                        <HStack gap={3}>
                            <Button variant="outline" onClick={onClose} disabled={loading}>
                                キャンセル
                            </Button>
                            <Button colorPalette="red" onClick={onConfirm} loading={loading}>
                                {confirmLabel}
                            </Button>
                        </HStack>
                    </DialogFooter>
                </DialogContent>
            </DialogPositioner>
        </DialogRoot>
    );
};

export default ConfirmDialog;
