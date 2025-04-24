import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

// Check if PayPal client ID is available in environment variables
const paypalClientId = import.meta.env.VITE_PAYPAL_CLIENT_ID || '';

interface PayPalPaymentProps {
  amount: string;
  email: string;
  name: string;
  onSuccess: (paymentId: string) => void;
  onCancel: () => void;
}

export default function PayPalPayment({ amount, email, name, onSuccess, onCancel }: PayPalPaymentProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const numericAmount = parseFloat(amount);

  // If PayPal client ID is not set, show an error message
  if (!paypalClientId) {
    return (
      <div className="p-6 text-center">
        <p className="text-red-500">
          PayPal payment is not configured. Please contact the administrator.
        </p>
        <Button onClick={onCancel} className="mt-4">
          Go Back
        </Button>
      </div>
    );
  }
  
  // For demonstration purposes, since we're in a testing environment
  const handleProcessPayment = async () => {
    try {
      setIsLoading(true);
      
      // Create a PayPal order in our backend
      const response = await apiRequest('POST', '/api/paypal/create-order', {
        amount: numericAmount,
        email,
        name
      });
      
      if (!response.ok) {
        throw new Error('Failed to create PayPal order');
      }
      
      const orderData = await response.json();
      
      // For a real PayPal integration, we would redirect to PayPal here
      // But for demo purposes, we'll simulate success after a delay
      setTimeout(() => {
        // Call onSuccess with the payment ID
        onSuccess(orderData.id);
        
        toast({
          title: "Payment successful",
          description: "Your PayPal payment was successful. Thank you for your donation!",
        });
        
        setIsLoading(false);
      }, 2000);
      
    } catch (err: any) {
      setIsLoading(false);
      toast({
        title: "Error processing payment",
        description: err.message || "Could not process PayPal payment",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Pay with PayPal</h3>
        <p className="text-sm text-muted-foreground">
          You're making a donation of ${amount} to MPC Ghana.
        </p>
        
        {isLoading ? (
          <div className="p-6 text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto" />
            <p className="mt-2">Processing your PayPal payment...</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="p-6 bg-[#0070ba]/10 rounded-md border border-[#0070ba]/30 text-center">
              <svg className="h-12 w-12 mx-auto text-[#0070ba]" viewBox="0 0 24 24" fill="currentColor">
                <path d="M9.17,13.6a.68.68,0,0,0,.67.56h.47a4.62,4.62,0,0,0,5-3.75c0-2-1.56-2.77-3.81-2.77H9.3a.68.68,0,0,0-.67.56L7.28,15.36A.67.67,0,0,0,8,16.07h.47a.68.68,0,0,0,.67-.56l.42-2.13A.23.23,0,0,1,9.17,13.6Z"></path>
                <path d="M18.63,8.15c-.16,1-.95,4.92-1.2,6.2a.23.23,0,0,1-.23.19h-.74a.39.39,0,0,1-.38-.48L17.38,8a.28.28,0,0,1,.27-.24h.7A.3.3,0,0,1,18.63,8.15Z"></path>
                <path d="M20,7.56c-1.42-.16-3.27.06-4.4.86a.54.54,0,0,0-.24.33l-.18.91a.3.3,0,0,0,.3.35c.65,0,1.63-.9,3.08-.9Z"></path>
              </svg>
              
              <div className="mt-4">
                <p className="text-lg font-medium">Amount: ${amount}</p>
                <p className="text-sm text-muted-foreground">To MPC Ghana</p>
              </div>
              
              <Button 
                type="button"
                onClick={handleProcessPayment}
                className="mt-4 bg-[#0070ba] hover:bg-[#003087] text-white w-full"
              >
                Complete Payment with PayPal
              </Button>
            </div>
            
            <div className="text-sm text-muted-foreground text-center">
              <p>In a production environment, you would be redirected to PayPal's website to complete your payment securely.</p>
              <p className="mt-1">For this demo, the payment will be simulated.</p>
            </div>
          </div>
        )}
      </div>
      
      <Button 
        type="button"
        variant="outline"
        onClick={onCancel}
        disabled={isLoading}
        className="w-full"
      >
        Cancel
      </Button>
    </div>
  );
}