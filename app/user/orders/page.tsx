import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { OrdersDetails } from "@/components/orders-details";
import { Separator } from "@/components/ui/separator";

export default function UserOrdersPage() {
  return (
    <>
      <Header />
      <OrdersDetails />
      <Separator />
      <Footer />
    </>
  );
}
