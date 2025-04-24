import { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface PaymentFormProps {
  amount: string;
  email: string;
  name: string;
  onSuccess: (paymentIntentId: string) => void;
  onCancel: () => void;
}

// This is the form that collects card details
function PaymentForm({ amount, email, name, onSuccess, onCancel }: PaymentFormProps) {
  const [clientSecret, setClientSecret] = useState('');
  const [processing, setProcessing] = useState(false);
  const [cardError, setCardError] = useState('');
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();

  useEffect(() => {
    // Initialize payment intent from server
    const getClientSecret = async () => {
      try {
        // Create a PaymentIntent on the server
        const response = await apiRequest('POST', '/api/create-payment-intent', {
          amount: parseFloat(amount),
          email,
          name
        });
        
        const data = await response.json();
        if (data.clientSecret) {
          setClientSecret(data.clientSecret);
        } else {
          setCardError('Unable to initialize payment. Please try again.');
        }
      } catch (error) {
        console.error('Error creating payment intent:', error);
        setCardError('Unable to initialize payment. Please try again.');
      }
    };

    // Only call if we have valid input
    if (parseFloat(amount) > 0) {
      getClientSecret();
    }
  }, [amount, email, name]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not loaded yet. Make sure to disable form submission until Stripe.js has loaded.
      return;
    }

    setProcessing(true);

    // Get CardElement
    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      setCardError('Card element not found');
      setProcessing(false);
      return;
    }

    try {
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name,
            email,
          },
        },
      });

      if (error) {
        setCardError(error.message || 'An error occurred while processing your payment.');
        toast({
          title: "Payment Failed",
          description: error.message || 'An error occurred while processing your payment.',
          variant: "destructive",
        });
      } else if (paymentIntent?.status === 'succeeded') {
        toast({
          title: "Payment Successful",
          description: "Thank you for your donation to MPC Ghana!",
        });
        onSuccess(paymentIntent.id);
      } else {
        setCardError('Payment status: ' + paymentIntent?.status);
      }
    } catch (err: any) {
      console.error('Payment error:', err);
      setCardError(err.message || 'An unexpected error occurred.');
      toast({
        title: "Payment Error",
        description: err.message || 'An unexpected error occurred.',
        variant: "destructive",
      });
    }

    setProcessing(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="p-4 bg-secondary/20 rounded-md">
        <h3 className="font-medium">Payment Summary</h3>
        <div className="mt-2 space-y-1 text-sm">
          <p><span className="font-medium">Name:</span> {name}</p>
          <p><span className="font-medium">Email:</span> {email}</p>
          <p><span className="font-medium">Amount:</span> USD {amount}</p>
        </div>
      </div>

      <div className="p-4 border rounded-md">
        <label className="block text-sm font-medium mb-2">
          Card Details
        </label>
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
        {cardError && <p className="text-red-500 text-sm mt-2">{cardError}</p>}
      </div>

      <Button 
        type="submit" 
        disabled={!stripe || !clientSecret || processing}
        className="w-full"
      >
        {processing ? 'Processing...' : 'Pay Now'}
      </Button>
      
      <Button 
        type="button"
        variant="outline" 
        onClick={onCancel}
        disabled={processing}
        className="w-full"
      >
        Cancel
      </Button>
    </form>
  );
}

// Stripe payment component that wraps the form with the Elements provider
export default function StripePayment({ 
  amount, 
  email, 
  name, 
  onSuccess, 
  onCancel 
}: PaymentFormProps) {
  const [stripePromise, setStripePromise] = useState<any>(null);
  
  useEffect(() => {
    // Initialize Stripe
    const initStripe = async () => {
      const publishableKey = import.meta.env.VITE_STRIPE_PUBLIC_KEY;
      if (publishableKey) {
        setStripePromise(loadStripe(publishableKey));
      }
    };
    
    initStripe();
  }, []);
  
  if (!stripePromise) {
    return (
      <div className="p-4 border border-yellow-400 bg-yellow-50 rounded-md">
        <h3 className="font-medium text-yellow-800">Payment Configuration Missing</h3>
        <p className="text-sm text-yellow-700 mt-1">
          Stripe payment is currently being set up. Please try again later or choose another payment method.
        </p>
        <Button onClick={onCancel} variant="outline" className="mt-4">
          Go Back
        </Button>
      </div>
    );
  }

  return (
    <Elements stripe={stripePromise}>
      <PaymentForm
        amount={amount}
        email={email}
        name={name}
        onSuccess={onSuccess}
        onCancel={onCancel}
      />
    </Elements>
  );
}