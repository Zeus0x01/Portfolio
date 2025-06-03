import { useStripe, Elements, PaymentElement, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useEffect, useState } from 'react';
import { useParams } from 'wouter';
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import { ArrowLeft } from "lucide-react";

// Make sure to call `loadStripe` outside of a component's render to avoid
// recreating the `Stripe` object on every render.
const stripePromise = import.meta.env.VITE_STRIPE_PUBLIC_KEY 
  ? loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY)
  : null;

const CheckoutForm = ({ course }: { course: any }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    if (!stripe || !elements) {
      setIsProcessing(false);
      return;
    }

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/?payment=success&course=${course.id}`,
      },
    });

    if (error) {
      toast({
        title: "Payment Failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Payment Successful",
        description: "You have been enrolled in the course!",
      });
    }
    setIsProcessing(false);
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Complete Your Purchase</CardTitle>
        <div className="text-sm text-muted-foreground">
          <div className="font-semibold">{course.title}</div>
          <div className="text-2xl font-bold text-primary mt-2">${course.price}</div>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <PaymentElement />
          <Button 
            type="submit" 
            className="w-full" 
            disabled={!stripe || !elements || isProcessing}
          >
            {isProcessing ? "Processing..." : `Pay $${course.price}`}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default function Checkout() {
  const params = useParams();
  const courseId = params.courseId;
  const [clientSecret, setClientSecret] = useState("");
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!courseId) return;

    // Create PaymentIntent and get course details
    apiRequest("POST", "/api/create-payment-intent", { courseId: parseInt(courseId) })
      .then((res) => res.json())
      .then((data) => {
        setClientSecret(data.clientSecret);
        setCourse(data.course);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error creating payment intent:", error);
        setLoading(false);
      });
  }, [courseId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center min-h-[calc(100vh-80px)]">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
        </div>
      </div>
    );
  }

  if (!clientSecret || !course) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center min-h-[calc(100vh-80px)] px-4">
          <Card className="w-full max-w-md">
            <CardContent className="pt-6 text-center">
              <h1 className="text-2xl font-bold mb-4">Course Not Found</h1>
              <p className="text-muted-foreground mb-4">
                The course you're trying to purchase could not be found.
              </p>
              <Button onClick={() => window.location.href = "/"} variant="outline">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-6 py-20">
        <div className="max-w-2xl mx-auto">
          <Button 
            onClick={() => window.location.href = "/"} 
            variant="ghost" 
            className="mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Courses
          </Button>
          
          <Elements stripe={stripePromise} options={{ clientSecret }}>
            <CheckoutForm course={course} />
          </Elements>
        </div>
      </div>
    </div>
  );
}
