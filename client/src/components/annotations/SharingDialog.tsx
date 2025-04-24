import React, { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Copy, Check, Mail } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { z } from 'zod';
import { shareAnnotation, shareNote } from '@/lib/annotationService';
import { Annotation, Note } from '@/lib/types';

interface SharingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: Annotation | Note;
  itemType: 'annotation' | 'note';
  onShared?: () => void;
}

const SharingDialog: React.FC<SharingDialogProps> = ({
  open,
  onOpenChange,
  item,
  itemType,
  onShared
}) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [emailError, setEmailError] = useState('');
  const { toast } = useToast();
  
  const emailSchema = z.string().email({ message: 'Please enter a valid email address' });
  
  const validateEmail = () => {
    try {
      emailSchema.parse(email);
      setEmailError('');
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        setEmailError(error.errors[0].message);
      } else {
        setEmailError('Invalid email');
      }
      return false;
    }
  };
  
  const handleShare = async () => {
    if (!validateEmail()) return;
    
    setIsLoading(true);
    try {
      if (itemType === 'annotation') {
        await shareAnnotation(item.id, email);
      } else {
        await shareNote(item.id, email);
      }
      toast({
        title: `${itemType === 'annotation' ? 'Annotation' : 'Note'} shared`,
        description: `Successfully shared with ${email}`,
        variant: 'success',
      });
      setEmail('');
      if (onShared) onShared();
    } catch (error) {
      toast({
        title: 'Error sharing',
        description: `Failed to share ${itemType}. Please try again.`,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const copyToClipboard = async () => {
    // In a real implementation, you would generate a shareable link
    // e.g., `${window.location.origin}/share/${itemType}/${item.id}`
    const shareableText = `Check out this ${itemType} on MPC Ghana: "${itemType === 'annotation' ? item.text.substring(0, 50) : item.title}"`;
    
    try {
      await navigator.clipboard.writeText(shareableText);
      setIsCopied(true);
      toast({
        title: 'Copied to clipboard',
        description: 'You can now paste the sharing information anywhere.',
      });
      setTimeout(() => setIsCopied(false), 3000);
    } catch (error) {
      toast({
        title: 'Failed to copy',
        description: 'Could not copy to clipboard. Please try again.',
        variant: 'destructive',
      });
    }
  };
  
  const title = itemType === 'annotation' ? 'Share Annotation' : 'Share Note';
  const description = itemType === 'annotation' 
    ? 'Share this annotation with others via email or by copying a link.'
    : 'Share this note with others via email or by copying a link.';
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            {description}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-5 py-4">
          <div className="flex items-center space-x-2">
            <div className="grid flex-1 gap-2">
              <Label htmlFor="share-email" className="sr-only">Email</Label>
              <Input
                id="share-email"
                type="email"
                placeholder="Enter email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {emailError && (
                <p className="text-sm text-red-500">{emailError}</p>
              )}
            </div>
            <Button 
              type="button" 
              onClick={handleShare} 
              disabled={isLoading}
              className="flex items-center gap-1"
            >
              <Mail className="h-4 w-4" />
              Share
            </Button>
          </div>
          
          <div className="flex flex-col space-y-2">
            <div className="text-sm font-medium">Or share via link</div>
            <Button
              variant="outline"
              className="flex items-center justify-center gap-2"
              onClick={copyToClipboard}
            >
              {isCopied ? (
                <>
                  <Check className="h-4 w-4" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  Copy link
                </>
              )}
            </Button>
          </div>
        </div>
        
        <DialogFooter className="flex justify-end sm:justify-end">
          <Button 
            variant="secondary" 
            onClick={() => onOpenChange(false)}
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SharingDialog;