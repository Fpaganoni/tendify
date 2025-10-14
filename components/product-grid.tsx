import { ProductCard } from "./product-card";
import { ScrollAnimation } from "./scroll-animations";
import { WooCommerceProduct } from "@/lib/woocommerce-types";

interface ProductGridProps {
  products: WooCommerceProduct[];
  title?: string;
}

export function ProductGrid({ products, title }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-semibold mb-2">No products found</h3>
        <p className="text-muted-foreground">
          Try adjusting your search or filters.
        </p>
      </div>
    );
  }

  return (
    <section className="space-y-6">
      {title && (
        <ScrollAnimation animation="fadeInUp" delay={100}>
          <h2 className="text-3xl font-bold text-center text-balance">
            {title}
          </h2>
        </ScrollAnimation>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product, index) => (
          <ScrollAnimation
            key={product.id}
            animation="fadeInUp"
            delay={index * 100 + 200}
          >
            <ProductCard product={product} />
          </ScrollAnimation>
        ))}
      </div>
    </section>
  );
}
