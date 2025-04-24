import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { PaymentMethodSelector } from "./PaymentMethodSelector";
import PayPalPayment from "./PayPalPayment";
import PaystackPayment from "./PaystackPayment";
import StripePayment from "./StripePayment";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Loader2 } from "lucide-react";

const donationFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().email("Please enter a valid email address"),
  amount: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Amount must be a positive number",
  }),
  message: z.string().optional(),
  isAnonymous: z.boolean().default(false),
});

type DonationFormValues = z.infer<typeof donationFormSchema>;

export default function DonationForm() {
  const [step, setStep] = useState<'form' | 'payment-selection' | 'payment-processing'>('form');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'mobile-money' | 'paypal' | ''>('');
  const [paymentProcessor, setPaymentProcessor] = useState<'stripe' | 'paystack' | 'paypal' | ''>('');
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<DonationFormValues | null>(null);
  const { toast } = useToast();
  
  const form = useForm<DonationFormValues>({
    resolver: zodResolver(donationFormSchema),
    defaultValues: {
      name: "",
      email: "",
      amount: "",
      message: "",
      isAnonymous: false,
    },
  });

  const onSubmit = (data: DonationFormValues) => {
    setFormData(data);
    setStep('payment-selection');
  };

  const handlePaymentMethodSelect = (method: 'card' | 'mobile-money' | 'paypal' | '', processor: 'stripe' | 'paystack' | 'paypal' | '') => {
    setPaymentMethod(method);
    setPaymentProcessor(processor);
    setStep('payment-processing');
  };

  const handlePaymentSuccess = async (paymentId: string) => {
    if (!formData) return;
    
    try {
      setIsLoading(true);
      
      // Record the donation in our database
      const response = await apiRequest('POST', '/api/donations', {
        name: formData.name,
        email: formData.email,
        donationType: 'one-time',
        donationAmount: formData.amount,
        paymentMethod: paymentProcessor,
        message: formData.message || '',
        isAnonymous: formData.isAnonymous,
        transactionId: paymentId,
        status: 'completed'
      });
      
      if (!response.ok) {
        throw new Error('Failed to record donation');
      }
      
      toast({
        title: "Donation Successful",
        description: "Thank you for your generous support!",
      });
      
      // Reset form and state
      form.reset();
      setStep('form');
      setPaymentMethod('');
      setPaymentProcessor('');
      setFormData(null);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "There was an error recording your donation.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePaymentCancel = () => {
    setStep('payment-selection');
    setPaymentMethod('');
    setPaymentProcessor('');
  };

  const handleGoBack = () => {
    setStep(step === 'payment-processing' ? 'payment-selection' : 'form');
  };

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-md">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">
          {step === 'form' && "Make a Donation"}
          {step === 'payment-selection' && "Select Payment Method"}
          {step === 'payment-processing' && "Process Payment"}
        </CardTitle>
        <CardDescription className="text-center">
          {step === 'form' && "Your support helps us continue our mission for Ghana's intellectual revolution"}
          {step === 'payment-selection' && "Choose how you would like to donate"}
          {step === 'payment-processing' && `Donating $${formData?.amount || 0} via ${paymentMethod === 'mobile-money' ? 'Mobile Money' : paymentMethod === 'card' ? 'Card' : 'PayPal'}`}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {step === 'form' && (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Your name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="Your email address" type="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Donation Amount (USD)</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2">$</span>
                        <Input className="pl-8" placeholder="25" type="number" min="1" step="any" {...field} />
                      </div>
                    </FormControl>
                    <FormDescription>
                      Enter the amount you wish to donate in US Dollars.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Message (Optional)</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Share why you're supporting us" 
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="isAnonymous"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Make this donation anonymous</FormLabel>
                      <FormDescription>
                        If selected, your name will not be displayed publicly.
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
              
              <Button type="submit" className="w-full">
                Continue to Payment
              </Button>
            </form>
          </Form>
        )}
        
        {step === 'payment-selection' && formData && (
          <div className="space-y-6">
            <PaymentMethodSelector onSelect={handlePaymentMethodSelect} />
            
            <Button
              type="button"
              variant="outline"
              onClick={handleGoBack}
              className="w-full mt-4"
            >
              Go Back
            </Button>
          </div>
        )}
        
        {step === 'payment-processing' && formData && (
          <div className="space-y-6">
            {paymentProcessor === 'stripe' && (
              <StripePayment
                amount={formData.amount}
                email={formData.email}
                name={formData.name}
                onSuccess={handlePaymentSuccess}
                onCancel={handlePaymentCancel}
              />
            )}
            
            {paymentProcessor === 'paypal' && (
              <PayPalPayment
                amount={formData.amount}
                email={formData.email}
                name={formData.name}
                onSuccess={handlePaymentSuccess}
                onCancel={handlePaymentCancel}
              />
            )}
            
            {paymentProcessor === 'paystack' && (
              <PaystackPayment
                amount={formData.amount}
                email={formData.email}
                name={formData.name}
                paymentMethod={paymentMethod as 'card' | 'mobile-money'}
                onSuccess={handlePaymentSuccess}
                onCancel={handlePaymentCancel}
              />
            )}
            
            {!paymentProcessor && (
              <div className="text-center p-6">
                <Loader2 className="h-8 w-8 animate-spin mx-auto" />
                <p className="mt-2">Loading payment options...</p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}