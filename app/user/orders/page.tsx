import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";

export default function UserOrdersPage() {
  return (
    <>
      <Header />
      <div className="min-h-fill m-auto max-w-5xl py-14">
        <h2 className="font-bold  lg:text-lg text-center mb-5">
          Your orders details here!
        </h2>
        <Table>
          <TableHeader>
            <TableRow className="bg-orange hover:bg-orange">
              <TableHead>Order ID</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Product</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>576</TableCell>
              <TableCell>01-06-2024</TableCell>
              <TableCell>Eco-Friendly Water Bottle</TableCell>
              <TableCell>1</TableCell>
              <TableCell>Shipped</TableCell>
              <TableCell>$34.99</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>526</TableCell>
              <TableCell>15-05-2024</TableCell>
              <TableCell>Organic Cotton T-Shirt</TableCell>
              <TableCell>2</TableCell>
              <TableCell>Shipped</TableCell>
              <TableCell>$59.99</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>69</TableCell>
              <TableCell>18-07-2024</TableCell>
              <TableCell>Wireless Charging Pad</TableCell>
              <TableCell>1</TableCell>
              <TableCell>Shipped</TableCell>
              <TableCell>$49.99</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>67</TableCell>
              <TableCell>18-07-2024</TableCell>
              <TableCell>Minimalist Desk Lamp</TableCell>
              <TableCell>1</TableCell>
              <TableCell>Shipped</TableCell>
              <TableCell>$89.99</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>62</TableCell>
              <TableCell>01-09-2025</TableCell>
              <TableCell>Premium Wireless Headphones</TableCell>
              <TableCell>1</TableCell>
              <TableCell>Processing</TableCell>
              <TableCell>$299.99</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
      <Footer />
    </>
  );
}
