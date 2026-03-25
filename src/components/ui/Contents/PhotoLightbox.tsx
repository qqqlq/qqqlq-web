import { useEffect } from 'react';
import {
    Box, Image, Text, Heading, IconButton,
    DialogRoot, DialogBackdrop, DialogPositioner, DialogContent,
} from '@chakra-ui/react';
import { FiX, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import type { Photo } from '../../../types';

interface PhotoLightboxProps {
    photos: Photo[];
    selectedIndex: number | null;
    onClose: () => void;
    onSelect: (index: number) => void;
}

const PhotoLightbox = ({ photos, selectedIndex, onClose, onSelect }: PhotoLightboxProps) => {
    const isOpen = selectedIndex !== null;
    const photo = selectedIndex !== null ? photos[selectedIndex] : null;
    const hasPrev = selectedIndex !== null && selectedIndex > 0;
    const hasNext = selectedIndex !== null && selectedIndex < photos.length - 1;

    useEffect(() => {
        if (!isOpen) return;

        const handleKey = (e: KeyboardEvent) => {
            if (e.key === 'ArrowLeft' && hasPrev && selectedIndex !== null) {
                onSelect(selectedIndex - 1);
            } else if (e.key === 'ArrowRight' && hasNext && selectedIndex !== null) {
                onSelect(selectedIndex + 1);
            }
        };

        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, [isOpen, selectedIndex, hasPrev, hasNext, onSelect]);

    return (
        <DialogRoot
            open={isOpen}
            onOpenChange={(e) => { if (!e.open) onClose(); }}
            size="full"
        >
            <DialogBackdrop bg="blackAlpha.900" />
            <DialogPositioner>
                <DialogContent
                    bg="transparent"
                    boxShadow="none"
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    justifyContent="center"
                    h="100vh"
                    w="100vw"
                    p={0}
                    onClick={onClose}
                >
                    {/* 閉じるボタン */}
                    <Box
                        position="fixed"
                        top={4}
                        right={4}
                        zIndex={10}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <IconButton
                            aria-label="閉じる"
                            onClick={onClose}
                            variant="ghost"
                            colorPalette="whiteAlpha"
                            color="white"
                            size="lg"
                            _hover={{ bg: 'whiteAlpha.200' }}
                        >
                            <FiX />
                        </IconButton>
                    </Box>

                    {/* 左矢印 */}
                    <Box
                        position="fixed"
                        left={4}
                        top="50%"
                        transform="translateY(-50%)"
                        zIndex={10}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <IconButton
                            aria-label="前の写真"
                            onClick={() => selectedIndex !== null && onSelect(selectedIndex - 1)}
                            disabled={!hasPrev}
                            variant="ghost"
                            colorPalette="whiteAlpha"
                            color="white"
                            size="lg"
                            _hover={{ bg: 'whiteAlpha.200' }}
                        >
                            <FiChevronLeft />
                        </IconButton>
                    </Box>

                    {/* 右矢印 */}
                    <Box
                        position="fixed"
                        right={4}
                        top="50%"
                        transform="translateY(-50%)"
                        zIndex={10}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <IconButton
                            aria-label="次の写真"
                            onClick={() => selectedIndex !== null && onSelect(selectedIndex + 1)}
                            disabled={!hasNext}
                            variant="ghost"
                            colorPalette="whiteAlpha"
                            color="white"
                            size="lg"
                            _hover={{ bg: 'whiteAlpha.200' }}
                        >
                            <FiChevronRight />
                        </IconButton>
                    </Box>

                    {/* 写真本体 */}
                    {photo && (
                        <Box
                            display="flex"
                            flexDirection="column"
                            alignItems="center"
                            maxW="90vw"
                            maxH="90vh"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <Image
                                src={photo.url}
                                alt={photo.title}
                                objectFit="contain"
                                maxW="90vw"
                                maxH="80vh"
                                borderRadius="md"
                            />
                            {(photo.title || photo.description) && (
                                <Box
                                    mt={4}
                                    textAlign="center"
                                    color="white"
                                    px={4}
                                >
                                    <Heading size="md">{photo.title}</Heading>
                                    {photo.description && (
                                        <Text mt={1} fontSize="sm" color="whiteAlpha.800">
                                            {photo.description}
                                        </Text>
                                    )}
                                </Box>
                            )}
                        </Box>
                    )}

                    {/* ページネーション */}
                    {photos.length > 1 && selectedIndex !== null && (
                        <Box
                            position="fixed"
                            bottom={6}
                            color="whiteAlpha.600"
                            fontSize="sm"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {selectedIndex + 1} / {photos.length}
                        </Box>
                    )}
                </DialogContent>
            </DialogPositioner>
        </DialogRoot>
    );
};

export default PhotoLightbox;
