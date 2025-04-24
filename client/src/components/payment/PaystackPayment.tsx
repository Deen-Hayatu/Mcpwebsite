import { useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
// Using the standard Paystack Inline JS
declare global {
  interface Window {
    PaystackPop: any;
  }
}

interface PaystackPaymentProps {
  name: string;
  email: string;
  amount: string;
  onSuccess: (reference: string) => void;
  onCancel: () => void;
  paymentMethod: 'card' | 'mobile-money';
}

export default function PaystackPayment({
  name,
  email,
  amount,
  onSuccess,
  onCancel,
  paymentMethod
}: PaystackPaymentProps) {
  const { toast } = useToast();
  const amountInKobo = Math.round(parseFloat(amount) * 100); // Convert to kobo (smallest currency unit)
  
  // Check if Paystack public key is available
  const paystackPublicKey = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY;
  
  if (!paystackPublicKey) {
    return (
      <div className="p-4 border border-yellow-400 bg-yellow-50 rounded-md">
        <h3 className="font-medium text-yellow-800">Payment Configuration Missing</h3>
        <p className="text-sm text-yellow-700 mt-1">
          Paystack payment is currently being set up. Please try again later or choose another payment method.
        </p>
        <Button onClick={onCancel} variant="outline" className="mt-4">
          Go Back
        </Button>
      </div>
    );
  }

  const config = {
    reference: new Date().getTime().toString(),
    email: email,
    amount: amountInKobo,
    publicKey: paystackPublicKey,
    firstname: name.split(' ')[0],
    lastname: name.includes(' ') ? name.split(' ').slice(1).join(' ') : '',
    channels: paymentMethod === 'mobile-money' ? ['mobile_money'] : ['card'],
    currency: 'GHS',
    label: 'MPC Ghana Donation',
  };
  
  const handlePaystackSuccess = (reference: any) => {
    toast({
      title: "Payment Successful",
      description: "Thank you for your donation to MPC Ghana!",
    });
    onSuccess(reference.reference);
  };
  
  const handlePaystackClose = () => {
    toast({
      title: "Payment Cancelled",
      description: "You've cancelled the payment. You can try again when ready.",
      variant: "destructive",
    });
    onCancel();
  };

  // We'll handle the Paystack popup initialization
  const handlePayNow = () => {
    // For now, show a placeholder message since API keys are pending
    toast({
      title: "Paystack Integration Pending",
      description: "Paystack integration will be completed once API keys are available.",
    });
    
    // In actual implementation with API keys:
    // const handler = window.PaystackPop.setup({
    //   ...config,
    //   onSuccess: handlePaystackSuccess,
    //   onClose: handlePaystackClose,
    // });
    // handler.openIframe();
  };

  return (
    <div className="space-y-4">
      <div className="p-4 bg-secondary/20 rounded-md">
        <h3 className="font-medium">Payment Summary</h3>
        <div className="mt-2 space-y-1 text-sm">
          <p><span className="font-medium">Name:</span> {name}</p>
          <p><span className="font-medium">Email:</span> {email}</p>
          <p><span className="font-medium">Amount:</span> GHS {amount}</p>
          <p><span className="font-medium">Method:</span> {paymentMethod === 'card' ? 'Credit Card' : 'Mobile Money'}</p>
        </div>
      </div>
      
      <Button 
        onClick={handlePayNow}
        className="w-full bg-green-600 hover:bg-green-700 text-white"
      >
        Pay with Paystack
      </Button>
      
      <Button 
        variant="outline" 
        onClick={onCancel}
        className="w-full"
      >
        Cancel
      </Button>
    </div>
  );
}