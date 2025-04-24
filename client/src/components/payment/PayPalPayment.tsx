import { useEffect, useState } from 'react';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
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

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Pay with PayPal</h3>
        <p className="text-sm text-muted-foreground">
          You will be redirected to PayPal to complete your payment securely.
        </p>
        
        {isLoading ? (
          <div className="p-6 text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto" />
            <p className="mt-2">Preparing PayPal checkout...</p>
          </div>
        ) : (
          <PayPalScriptProvider options={{ 
            clientId: paypalClientId,
            currency: "USD",
            intent: "capture"
          }}>
            <PayPalButtons
              style={{ 
                layout: 'vertical',
                shape: 'rect',
                color: 'gold'
              }}
              createOrder={async () => {
                try {
                  setIsLoading(true);
                  const response = await apiRequest('POST', '/api/paypal/create-order', {
                    amount: numericAmount,
                    email,
                    name
                  });
                  
                  if (!response.ok) {
                    throw new Error('Failed to create PayPal order');
                  }
                  
                  const orderData = await response.json();
                  setIsLoading(false);
                  return orderData.id;
                } catch (err: any) {
                  setIsLoading(false);
                  toast({
                    title: "Error creating order",
                    description: err.message || "Could not initiate PayPal checkout",
                    variant: "destructive"
                  });
                  throw err;
                }
              }}
              onApprove={async (data, actions) => {
                try {
                  setIsLoading(true);
                  // Capture the funds from the transaction
                  const response = await apiRequest('POST', '/api/paypal/capture-order', {
                    orderId: data.orderID
                  });
                  
                  if (!response.ok) {
                    throw new Error('Failed to capture PayPal payment');
                  }
                  
                  const details = await response.json();
                  
                  // Call onSuccess with the payment ID
                  onSuccess(details.id);
                  
                  toast({
                    title: "Payment successful",
                    description: "Thank you for your donation!",
                  });
                } catch (err: any) {
                  toast({
                    title: "Payment failed",
                    description: err.message || "Could not complete payment",
                    variant: "destructive"
                  });
                } finally {
                  setIsLoading(false);
                }
              }}
              onCancel={() => {
                toast({
                  title: "Payment cancelled",
                  description: "You have cancelled the PayPal payment process.",
                });
                onCancel();
              }}
              onError={(err) => {
                toast({
                  title: "Payment error",
                  description: "There was an error processing your payment. Please try again.",
                  variant: "destructive"
                });
                console.error('PayPal error:', err);
              }}
            />
          </PayPalScriptProvider>
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