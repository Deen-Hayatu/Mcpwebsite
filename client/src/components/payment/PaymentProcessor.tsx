import { useState } from 'react';
import { PaymentMethodSelector } from './PaymentMethodSelector';
import PaystackPayment from './PaystackPayment';
import StripePayment from './StripePayment';
import PayPalPayment from './PayPalPayment';
import { Button } from "@/components/ui/button";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

type PaymentOption = "card" | "mobile-money" | "paypal" | "";
type PaymentProcessor = "stripe" | "paystack" | "paypal" | "";

interface PaymentProcessorProps {
  amount: string;
  email: string;
  name: string;
  donorInfo: any; // This should match the donation form data structure
  onComplete: () => void;
  onCancel: () => void;
}

export default function PaymentProcessor({
  amount,
  email,
  name,
  donorInfo,
  onComplete,
  onCancel
}: PaymentProcessorProps) {
  const [selectedMethod, setSelectedMethod] = useState<PaymentOption>("");
  const [selectedProcessor, setSelectedProcessor] = useState<PaymentProcessor>("");
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [paymentId, setPaymentId] = useState("");
  const { toast } = useToast();

  const handleSelectPaymentMethod = (method: PaymentOption, processor: PaymentProcessor) => {
    setSelectedMethod(method);
    setSelectedProcessor(processor);
  };

  const handlePaymentSuccess = async (referenceId: string) => {
    setPaymentId(referenceId);
    setPaymentSuccess(true);
    
    try {
      // Save donation information to the database
      const response = await apiRequest('POST', '/api/donations', {
        ...donorInfo,
        amount: parseFloat(amount),
        email,
        name,
        paymentMethod: selectedMethod,
        paymentProcessor: selectedProcessor,
        paymentReference: referenceId,
        status: 'completed'
      });
      
      if (!response.ok) {
        throw new Error('Failed to save donation information');
      }
      
      // Proceed with success flow
      onComplete();
    } catch (error) {
      console.error('Error saving donation:', error);
      toast({
        title: "Error Recording Donation",
        description: "Your payment was successful, but we couldn't record your donation details. Please contact us with your payment reference.",
        variant: "destructive",
      });
    }
  };

  const handleCancel = () => {
    setSelectedMethod("");
    setSelectedProcessor("");
    onCancel();
  };

  // Show appropriate payment form based on selected method and processor
  const renderPaymentForm = () => {
    if (selectedProcessor === 'paystack') {
      return (
        <PaystackPayment
          name={name}
          email={email}
          amount={amount}
          onSuccess={handlePaymentSuccess}
          onCancel={handleCancel}
          paymentMethod={selectedMethod as 'card' | 'mobile-money'}
        />
      );
    } else if (selectedProcessor === 'stripe') {
      return (
        <StripePayment
          name={name}
          email={email}
          amount={amount}
          onSuccess={handlePaymentSuccess}
          onCancel={handleCancel}
        />
      );
    } else if (selectedProcessor === 'paypal') {
      return (
        <PayPalPayment
          name={name}
          email={email}
          amount={amount}
          onSuccess={handlePaymentSuccess}
          onCancel={handleCancel}
        />
      );
    }
    
    return null;
  };

  // Success screen after payment
  if (paymentSuccess) {
    return (
      <div className="space-y-4 p-6 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full mx-auto flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold">Thank You!</h2>
        <p>Your donation of {selectedProcessor === 'paystack' ? 'GHS' : 'USD'} {amount} has been received.</p>
        <p className="text-sm text-muted-foreground">Payment Reference: {paymentId}</p>
        <Button onClick={onComplete} className="mt-4">
          Return to Website
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {selectedMethod && selectedProcessor ? (
        renderPaymentForm()
      ) : (
        <PaymentMethodSelector onSelect={handleSelectPaymentMethod} />
      )}
    </div>
  );
}