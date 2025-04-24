import { useState } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { CreditCard, Phone } from "lucide-react";

type PaymentOption = "card" | "mobile-money" | "paypal" | "";
type PaymentProcessor = "stripe" | "paystack" | "paypal" | "";

interface PaymentMethodSelectorProps {
  onSelect: (method: PaymentOption, processor: PaymentProcessor) => void;
}

export function PaymentMethodSelector({ onSelect }: PaymentMethodSelectorProps) {
  const [selectedMethod, setSelectedMethod] = useState<PaymentOption>("");
  const [selectedProcessor, setSelectedProcessor] = useState<PaymentProcessor>("");

  const handleSelect = (method: PaymentOption, processor: PaymentProcessor) => {
    setSelectedMethod(method);
    setSelectedProcessor(processor);
  };

  const handleContinue = () => {
    if (selectedMethod && selectedProcessor) {
      onSelect(selectedMethod, selectedProcessor);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Select Payment Method</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Credit Card Option - International */}
          <div 
            className={`p-4 rounded-md border ${selectedMethod === 'card' && selectedProcessor === 'stripe' ? 'border-primary bg-primary/5' : 'border-border'} cursor-pointer hover:border-primary transition-colors`}
            onClick={() => handleSelect('card', 'stripe')}
          >
            <div className="flex items-center space-x-3">
              <RadioGroupItem 
                value="card-stripe" 
                id="card-stripe"
                checked={selectedMethod === 'card' && selectedProcessor === 'stripe'} 
                onClick={() => handleSelect('card', 'stripe')}
              />
              <CreditCard className="h-5 w-5" />
              <Label htmlFor="card-stripe" className="cursor-pointer">International Credit Card</Label>
            </div>
            <p className="text-sm text-muted-foreground mt-2 ml-8">Visa, Mastercard, American Express, etc.</p>
          </div>

          {/* Credit Card Option - Ghana */}
          <div 
            className={`p-4 rounded-md border ${selectedMethod === 'card' && selectedProcessor === 'paystack' ? 'border-primary bg-primary/5' : 'border-border'} cursor-pointer hover:border-primary transition-colors`}
            onClick={() => handleSelect('card', 'paystack')}
          >
            <div className="flex items-center space-x-3">
              <RadioGroupItem 
                value="card-paystack" 
                id="card-paystack"
                checked={selectedMethod === 'card' && selectedProcessor === 'paystack'} 
                onClick={() => handleSelect('card', 'paystack')}
              />
              <CreditCard className="h-5 w-5" />
              <Label htmlFor="card-paystack" className="cursor-pointer">Ghanaian Credit Card</Label>
            </div>
            <p className="text-sm text-muted-foreground mt-2 ml-8">Local bank cards accepted in Ghana</p>
          </div>
          
          {/* Mobile Money Option */}
          <div 
            className={`p-4 rounded-md border ${selectedMethod === 'mobile-money' && selectedProcessor === 'paystack' ? 'border-primary bg-primary/5' : 'border-border'} cursor-pointer hover:border-primary transition-colors`}
            onClick={() => handleSelect('mobile-money', 'paystack')}
          >
            <div className="flex items-center space-x-3">
              <RadioGroupItem 
                value="mobile-money" 
                id="mobile-money"
                checked={selectedMethod === 'mobile-money' && selectedProcessor === 'paystack'} 
                onClick={() => handleSelect('mobile-money', 'paystack')}
              />
              <Phone className="h-5 w-5" />
              <Label htmlFor="mobile-money" className="cursor-pointer">Mobile Money</Label>
            </div>
            <p className="text-sm text-muted-foreground mt-2 ml-8">MTN Mobile Money, Vodafone Cash, AirtelTigo Money</p>
          </div>
          
          {/* PayPal Option */}
          <div 
            className={`p-4 rounded-md border ${selectedMethod === 'paypal' && selectedProcessor === 'paypal' ? 'border-primary bg-primary/5' : 'border-border'} cursor-pointer hover:border-primary transition-colors`}
            onClick={() => handleSelect('paypal', 'paypal')}
          >
            <div className="flex items-center space-x-3">
              <RadioGroupItem 
                value="paypal" 
                id="paypal"
                checked={selectedMethod === 'paypal' && selectedProcessor === 'paypal'} 
                onClick={() => handleSelect('paypal', 'paypal')}
              />
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M9.17,13.6a.68.68,0,0,0,.67.56h.47a4.62,4.62,0,0,0,5-3.75c0-2-1.56-2.77-3.81-2.77H9.3a.68.68,0,0,0-.67.56L7.28,15.36A.67.67,0,0,0,8,16.07h.47a.68.68,0,0,0,.67-.56l.42-2.13A.23.23,0,0,1,9.17,13.6Z"></path>
                <path d="M18.63,8.15c-.16,1-.95,4.92-1.2,6.2a.23.23,0,0,1-.23.19h-.74a.39.39,0,0,1-.38-.48L17.38,8a.28.28,0,0,1,.27-.24h.7A.3.3,0,0,1,18.63,8.15Z"></path>
                <path d="M20,7.56c-1.42-.16-3.27.06-4.4.86a.54.54,0,0,0-.24.33l-.18.91a.3.3,0,0,0,.3.35c.65,0,1.63-.9,3.08-.9Z"></path>
              </svg>
              <Label htmlFor="paypal" className="cursor-pointer">PayPal</Label>
            </div>
            <p className="text-sm text-muted-foreground mt-2 ml-8">International payments via PayPal</p>
          </div>
        </div>
      </div>
      
      <Button 
        type="button"
        onClick={handleContinue}
        disabled={!selectedMethod || !selectedProcessor}
        className="w-full"
      >
        Continue to Payment
      </Button>
    </div>
  );
}