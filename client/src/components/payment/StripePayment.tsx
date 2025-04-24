import { useEffect, useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Button } from '@/components/ui/button';
import { apiRequest } from '@/lib/queryClient';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Check if Stripe public key is available - this should be set in the environment variables
let stripePromise: ReturnType<typeof loadStripe> | null = null;
if (import.meta.env.VITE_STRIPE_PUBLIC_KEY) {
  stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);
} else {
  console.warn("Stripe public key not found. Set VITE_STRIPE_PUBLIC_KEY in your environment variables.");
}

interface StripePaymentProps {
  amount: string;
  email: string;
  name: string;
  onSuccess: (paymentId: string) => void;
  onCancel: () => void;
}

function StripeCheckoutForm({ amount, email, name, onSuccess, onCancel }: StripePaymentProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      toast({
        title: "Error",
        description: "Stripe hasn't loaded yet. Please try again.",
        variant: "destructive",
      });
      return;
    }

    const cardElement = elements.getElement(CardElement);
    
    if (!cardElement) {
      toast({
        title: "Error",
        description: "Card element not found.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);

    try {
      // Create a payment intent on the server
      const paymentIntentResponse = await apiRequest('POST', '/api/create-payment-intent', {
        amount: parseFloat(amount),
        email,
        name
      });

      if (!paymentIntentResponse.ok) {
        throw new Error('Failed to create payment intent');
      }

      const { clientSecret } = await paymentIntentResponse.json();

      // Confirm the payment with Stripe
      const { paymentIntent, error } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name,
            email,
          },
        },
      });

      if (error) {
        toast({
          title: "Payment failed",
          description: error.message || "Your payment could not be processed. Please try again.",
          variant: "destructive",
        });
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        toast({
          title: "Payment successful",
          description: "Thank you for your donation!",
        });
        onSuccess(paymentIntent.id);
      }
    } catch (err: any) {
      toast({
        title: "Payment error",
        description: err.message || "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Enter Card Details</h3>
        <div className="p-4 border rounded-md">
          <CardElement 
            options={{
              style: {
                base: {
                  fontSize: '16px',
                  color: '#424770',
                  '::placeholder': {
                    color: '#aab7c4',
                  },
                },
                invalid: {
                  color: '#9e2146',
                },
              },
            }}
          />
        </div>
      </div>

      <div className="flex gap-3">
        <Button 
          type="button" 
          onClick={onCancel} 
          variant="outline" 
          className="flex-1"
          disabled={isProcessing}
        >
          Cancel
        </Button>
        <Button 
          type="submit" 
          className="flex-1" 
          disabled={!stripe || isProcessing}
        >
          {isProcessing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            `Pay $${amount}`
          )}
        </Button>
      </div>
    </form>
  );
}

export default function StripePayment(props: StripePaymentProps) {
  // If Stripe isn't loaded, show a message
  if (!stripePromise) {
    return (
      <div className="p-6 text-center">
        <p className="text-red-500">
          Stripe payment is not configured. Please contact the administrator.
        </p>
        <Button onClick={props.onCancel} className="mt-4">
          Go Back
        </Button>
      </div>
    );
  }

  return (
    <Elements stripe={stripePromise}>
      <StripeCheckoutForm {...props} />
    </Elements>
  );
}