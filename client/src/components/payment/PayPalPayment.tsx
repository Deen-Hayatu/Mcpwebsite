import { useEffect } from 'react';
import { 
  PayPalScriptProvider, 
  PayPalButtons,
  usePayPalScriptReducer
} from '@paypal/react-paypal-js';
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface PayPalPaymentProps {
  amount: string;
  email: string;
  name: string;
  onSuccess: (orderId: string) => void;
  onCancel: () => void;
}

// Component that renders PayPal buttons
function PayPalButtonsWrapper({ amount, email, name, onSuccess, onCancel }: PayPalPaymentProps) {
  const [{ isPending, isResolved, options }] = usePayPalScriptReducer();
  const { toast } = useToast();
  
  const paypalAmount = parseFloat(amount).toFixed(2);
  
  return (
    <div className="space-y-4">
      <div className="p-4 bg-secondary/20 rounded-md">
        <h3 className="font-medium">Payment Summary</h3>
        <div className="mt-2 space-y-1 text-sm">
          <p><span className="font-medium">Name:</span> {name}</p>
          <p><span className="font-medium">Email:</span> {email}</p>
          <p><span className="font-medium">Amount:</span> USD {paypalAmount}</p>
        </div>
      </div>
      
      {isPending ? (
        <div className="flex justify-center p-4">
          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <PayPalButtons
          style={{ 
            layout: "vertical",
            color: "gold",
            shape: "rect",
            label: "donate" 
          }}
          createOrder={(data, actions) => {
            return actions.order.create({
              purchase_units: [
                {
                  amount: {
                    value: paypalAmount,
                    currency_code: "USD"
                  },
                  description: "Donation to MPC Ghana",
                  custom_id: email,
                },
              ],
              application_context: {
                shipping_preference: "NO_SHIPPING"
              }
            });
          }}
          onApprove={(data, actions) => {
            return actions.order.capture().then((details) => {
              toast({
                title: "Payment Successful",
                description: `Thank you for your donation to MPC Ghana, ${details.payer.name?.given_name}!`,
              });
              onSuccess(data.orderID);
            });
          }}
          onCancel={() => {
            toast({
              title: "Payment Cancelled",
              description: "You've cancelled the PayPal payment process.",
              variant: "destructive",
            });
            onCancel();
          }}
          onError={(err) => {
            console.error("PayPal Error:", err);
            toast({
              title: "Payment Error",
              description: "An error occurred during the PayPal payment process. Please try again.",
              variant: "destructive",
            });
            onCancel();
          }}
        />
      )}
      
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

// Main PayPal payment component
export default function PayPalPayment(props: PayPalPaymentProps) {
  const paypalClientId = import.meta.env.VITE_PAYPAL_CLIENT_ID;
  
  if (!paypalClientId) {
    return (
      <div className="p-4 border border-yellow-400 bg-yellow-50 rounded-md">
        <h3 className="font-medium text-yellow-800">Payment Configuration Missing</h3>
        <p className="text-sm text-yellow-700 mt-1">
          PayPal payment is currently being set up. Please try again later or choose another payment method.
        </p>
        <Button onClick={props.onCancel} variant="outline" className="mt-4">
          Go Back
        </Button>
      </div>
    );
  }
  
  return (
    <PayPalScriptProvider
      options={{
        "client-id": paypalClientId,
        currency: "USD",
        intent: "capture",
      }}
    >
      <PayPalButtonsWrapper {...props} />
    </PayPalScriptProvider>
  );
}