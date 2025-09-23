import { Check } from "lucide-react"

interface CheckoutProgressProps {
  currentStep: number
}

const steps = [
  { id: 1, name: "Cart", description: "Review items" },
  { id: 2, name: "Shipping", description: "Delivery details" },
  { id: 3, name: "Payment", description: "Payment method" },
  { id: 4, name: "Confirmation", description: "Order complete" },
]

export function CheckoutProgress({ currentStep }: CheckoutProgressProps) {
  return (
    <div className="w-full py-6">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-full border-2 ${
                  step.id < currentStep
                    ? "bg-primary border-primary text-primary-foreground"
                    : step.id === currentStep
                      ? "border-primary text-primary"
                      : "border-muted text-muted-foreground"
                }`}
              >
                {step.id < currentStep ? <Check className="h-5 w-5" /> : step.id}
              </div>
              <div className="mt-2 text-center">
                <p
                  className={`text-sm font-medium ${step.id <= currentStep ? "text-foreground" : "text-muted-foreground"}`}
                >
                  {step.name}
                </p>
                <p className="text-xs text-muted-foreground">{step.description}</p>
              </div>
            </div>
            {index < steps.length - 1 && (
              <div className={`mx-4 h-0.5 w-16 ${step.id < currentStep ? "bg-primary" : "bg-muted"} hidden sm:block`} />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
