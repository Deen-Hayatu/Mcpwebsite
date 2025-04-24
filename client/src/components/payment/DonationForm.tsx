import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { insertDonationSchema } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import PaymentProcessor from "./PaymentProcessor";

// Extend the donation schema with client-side validation
const donationFormSchema = insertDonationSchema.extend({
  name: z.string().min(2, "Name must be at least 2 characters long"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().optional(),
  donationType: z.string().min(1, "Please select a donation type"),
  donationAmount: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Please enter a valid amount",
  }),
  message: z.string().optional(),
  isAnonymous: z.boolean().optional(),
});

type DonationFormValues = z.infer<typeof donationFormSchema>;

export default function DonationForm() {
  const [step, setStep] = useState<'form' | 'payment' | 'success'>('form');
  const [donationData, setDonationData] = useState<DonationFormValues | null>(null);
  const { toast } = useToast();

  const form = useForm<DonationFormValues>({
    resolver: zodResolver(donationFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      donationType: "one-time",
      donationAmount: "",
      message: "",
      isAnonymous: false,
      paymentMethod: "",
      paymentProcessor: "",
      paymentReference: "",
      status: "pending",
    },
  });

  const onSubmit = (data: DonationFormValues) => {
    setDonationData(data);
    setStep('payment');
  };

  const handlePaymentComplete = () => {
    setStep('success');
    form.reset();
  };

  const handlePaymentCancel = () => {
    setStep('form');
  };

  const resetForm = () => {
    setStep('form');
    form.reset();
  };

  // Success message after donation
  if (step === 'success') {
    return (
      <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-md space-y-6">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-green-100 rounded-full mx-auto flex items-center justify-center">
            <svg className="h-8 w-8 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold">Thank You for Your Donation!</h2>
          <p className="text-gray-600">
            Your generous contribution will help support our mission to promote intellectual revolution in Ghana.
          </p>
          <Button onClick={resetForm} className="mt-4">
            Make Another Donation
          </Button>
        </div>
      </div>
    );
  }

  // Payment processing screen
  if (step === 'payment' && donationData) {
    return (
      <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-md space-y-6">
        <h2 className="text-2xl font-bold text-center">Complete Your Donation</h2>
        <PaymentProcessor
          name={donationData.name}
          email={donationData.email}
          amount={donationData.donationAmount}
          donorInfo={donationData}
          onComplete={handlePaymentComplete}
          onCancel={handlePaymentCancel}
        />
      </div>
    );
  }

  // Initial donation form
  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-md space-y-6">
      <h2 className="text-2xl font-bold text-center">Make a Donation</h2>
      <p className="text-center text-gray-600">
        Your support helps us continue our mission to champion intellectual revolution in Ghana.
      </p>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Personal Information */}
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
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
                    <Input placeholder="you@example.com" type="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="+233 XXXXXXXXX" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          {/* Donation Type */}
          <FormField
            control={form.control}
            name="donationType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Donation Type</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex flex-col space-y-1"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="one-time" id="one-time" />
                      <FormLabel htmlFor="one-time" className="font-normal cursor-pointer">
                        One-time Donation
                      </FormLabel>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="monthly" id="monthly" />
                      <FormLabel htmlFor="monthly" className="font-normal cursor-pointer">
                        Monthly Donation
                      </FormLabel>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="annual" id="annual" />
                      <FormLabel htmlFor="annual" className="font-normal cursor-pointer">
                        Annual Donation
                      </FormLabel>
                    </div>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {/* Donation Amount */}
          <FormField
            control={form.control}
            name="donationAmount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Donation Amount</FormLabel>
                <FormControl>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                      $
                    </span>
                    <Input className="pl-7" placeholder="Amount" {...field} />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {/* Message */}
          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Message (Optional)</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Share why you're making this donation..."
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {/* Anonymous Donation */}
          <FormField
            control={form.control}
            name="isAnonymous"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Make this donation anonymous</FormLabel>
                </div>
              </FormItem>
            )}
          />
          
          <Button type="submit" className="w-full">Continue to Payment</Button>
        </form>
      </Form>
    </div>
  );
}