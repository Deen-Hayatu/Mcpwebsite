import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

// Define PaystackProps type internally to avoid import errors
interface PaystackProps {
  key: string;
  email: string;
  amount: number;
  ref: string;
  currency: string;
  channels: string[];
  label?: string;
  onClose: () => void;
  callback: (response: any) => void;
}

// Check if Paystack public key is available in environment variables
const paystackPublicKey = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY || '';

// Extend the Window interface to include PaystackPop
declare global {
  interface Window {
    PaystackPop: any;
  }
}

// Import the Paystack inline script dynamically (this avoids issues with SSR)
const loadPaystackScript = (): Promise<any> => {
  return new Promise((resolve) => {
    if (typeof window !== 'undefined' && window.PaystackPop === undefined) {
      const script = document.createElement('script');
      script.src = 'https://js.paystack.co/v1/inline.js';
      script.async = true;
      script.onload = () => resolve(window.PaystackPop);
      document.body.appendChild(script);
    } else if (typeof window !== 'undefined') {
      resolve(window.PaystackPop);
    }
  });
};

interface PaystackPaymentProps {
  amount: string;
  email: string;
  name: string;
  paymentMethod: 'card' | 'mobile-money';
  onSuccess: (paymentId: string) => void;
  onCancel: () => void;
}

export default function PaystackPayment({ 
  amount, 
  email, 
  name, 
  paymentMethod,
  onSuccess, 
  onCancel 
}: PaystackPaymentProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [reference, setReference] = useState('');
  const [paystackInstance, setPaystackInstance] = useState<any>(null);
  const { toast } = useToast();
  
  // Convert amount to Ghana cedis (GHS) and format for Paystack (in kobo)
  // Using a rough exchange rate of 1 USD = 13 GHS
  const ghsAmount = Math.round(parseFloat(amount) * 13 * 100);
  
  // Generate a reference on component mount
  useEffect(() => {
    const generateReference = () => {
      const date = new Date().getTime();
      return `mpc-donate-${date}-${Math.floor(Math.random() * 1000)}`;
    };
    
    setReference(generateReference());
    
    // Load Paystack script
    loadPaystackScript().then(instance => {
      setPaystackInstance(instance);
    }).catch(err => {
      console.error('Failed to load Paystack:', err);
    });
  }, []);

  // Handle payment initialization
  const handlePayment = async () => {
    if (!paystackPublicKey) {
      toast({
        title: "Configuration Error",
        description: "Paystack is not properly configured. Please contact the administrator.",
        variant: "destructive"
      });
      return;
    }
    
    if (!paystackInstance) {
      toast({
        title: "Loading Error",
        description: "Paystack is still loading. Please try again.",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Create payment record on the server first
      const response = await apiRequest('POST', '/api/paystack/initialize', {
        amount: ghsAmount,
        email,
        name,
        reference,
        paymentMethod
      });
      
      if (!response.ok) {
        throw new Error('Failed to initialize payment');
      }
      
      const data = await response.json();
      
      // Configure Paystack options
      const config: PaystackProps = {
        key: paystackPublicKey,
        email,
        amount: ghsAmount,
        ref: reference,
        currency: 'GHS',
        channels: paymentMethod === 'mobile-money' 
          ? ['mobile_money'] 
          : ['card'],
        label: name,
        onClose: () => {
          setIsLoading(false);
          onCancel();
        },
        callback: (response: any) => {
          // Verify the transaction on the server
          verifyTransaction(reference);
        }
      };
      
      // Open Paystack payment popup
      const handler = paystackInstance.setup(config);
      handler.openIframe();
    } catch (err: any) {
      setIsLoading(false);
      toast({
        title: "Payment Error",
        description: err.message || "Failed to initialize payment. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  // Verify the transaction after payment
  const verifyTransaction = async (reference: string) => {
    try {
      const response = await apiRequest('GET', `/api/paystack/verify/${reference}`);
      
      if (!response.ok) {
        throw new Error('Failed to verify payment');
      }
      
      const data = await response.json();
      
      if (data.status === 'success') {
        toast({
          title: "Payment Successful",
          description: "Thank you for your donation!",
        });
        onSuccess(reference);
      } else {
        toast({
          title: "Payment Verification Failed",
          description: data.message || "Your payment could not be verified. Please contact support.",
          variant: "destructive"
        });
      }
    } catch (err: any) {
      toast({
        title: "Verification Error",
        description: err.message || "Failed to verify your payment. Please contact support.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // If Paystack public key is not set, show an error message
  if (!paystackPublicKey) {
    return (
      <div className="p-6 text-center">
        <p className="text-red-500">
          Paystack payment is not configured. Please contact the administrator.
        </p>
        <Button onClick={onCancel} className="mt-4">
          Go Back
        </Button>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">
          {paymentMethod === 'mobile-money' 
            ? 'Pay with Mobile Money' 
            : 'Pay with Card (Ghana)'}
        </h3>
        
        <div className="bg-gray-50 p-4 rounded-md">
          <p className="font-medium">Amount: GHS {(ghsAmount / 100).toFixed(2)}</p>
          <p className="text-sm text-muted-foreground">
            (approx. ${parseFloat(amount).toFixed(2)} USD)
          </p>
        </div>
        
        <p className="text-sm">
          {paymentMethod === 'mobile-money'
            ? 'You will be prompted to enter your mobile money details to complete this payment.'
            : 'You will be redirected to securely enter your card details.'}
        </p>
      </div>
      
      <div className="flex gap-3">
        <Button 
          type="button" 
          onClick={onCancel} 
          variant="outline" 
          className="flex-1"
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button 
          type="button" 
          onClick={handlePayment} 
          className="flex-1"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            `Pay GHS ${(ghsAmount / 100).toFixed(2)}`
          )}
        </Button>
      </div>
    </div>
  );
}