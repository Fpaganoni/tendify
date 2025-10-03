import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { ScrollAnimation } from "@/components/scroll-animations";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Award, Globe, Heart } from "lucide-react";
import Image from "next/image";

const stats = [
  { label: "Happy Customers", value: "50K+", icon: Users },
  { label: "Products Sold", value: "100K+", icon: Award },
  { label: "Countries Served", value: "25+", icon: Globe },
  { label: "Years of Excellence", value: "10+", icon: Heart },
];

const team = [
  {
    name: "Sarah Johnson",
    role: "Founder & CEO",
    image: "/professional-woman-ceo.png",
    bio: "Passionate about creating exceptional shopping experiences",
  },
  {
    name: "Michael Chen",
    role: "Head of Product",
    image: "/professional-product-manager.png",
    bio: "Expert in curating the finest products for our customers",
  },
  {
    name: "Emily Rodriguez",
    role: "Customer Experience Lead",
    image: "/professional-woman-customer-service.jpg",
    bio: "Dedicated to ensuring every customer feels valued and heard",
  },
];

const values = [
  {
    title: "Quality First",
    description:
      "We carefully curate every product to ensure the highest quality standards.",
    icon: Award,
  },
  {
    title: "Customer Centric",
    description:
      "Your satisfaction is our priority. We listen, adapt, and improve continuously.",
    icon: Heart,
  },
  {
    title: "Sustainable Future",
    description:
      "We partner with eco-conscious brands to build a better tomorrow.",
    icon: Globe,
  },
  {
    title: "Innovation Driven",
    description:
      "We embrace new technologies to enhance your shopping experience.",
    icon: Users,
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        {/* Hero Section */}
        <ScrollAnimation>
          <section className="py-20 bg-gradient-to-r from-primary/10 to-secondary/10">
            <div className="container px-4">
              <div className="max-w-4xl mx-auto text-center">
                <Badge className="mb-4" variant="secondary">
                  Our Story
                </Badge>
                <h1 className="text-4xl lg:text-6xl font-bold text-foreground mb-6">
                  Building the Future of
                  <span className="text-primary"> E-Commerce</span>
                </h1>
                <p className="text-xl text-muted-foreground leading-relaxed">
                  Since 2014, we've been on a mission to revolutionize online
                  shopping by connecting customers with exceptional products and
                  creating memorable experiences that go beyond just
                  transactions.
                </p>
              </div>
            </div>
          </section>
        </ScrollAnimation>

        {/* Stats Section */}
        <ScrollAnimation>
          <section className="py-16">
            <div className="container px-4">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                {stats.map((stat, index) => (
                  <ScrollAnimation key={stat.label} delay={index * 0.1}>
                    <Card className="text-center">
                      <CardContent className="p-6">
                        <stat.icon className="w-8 h-8 mx-auto mb-4 text-primary" />
                        <div className="text-3xl font-bold text-foreground mb-2">
                          {stat.value}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {stat.label}
                        </div>
                      </CardContent>
                    </Card>
                  </ScrollAnimation>
                ))}
              </div>
            </div>
          </section>
        </ScrollAnimation>

        {/* Mission Section */}
        <ScrollAnimation>
          <section className="py-16 bg-muted/30">
            <div className="container px-4">
              <div className="max-w-4xl mx-auto">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                  <div>
                    <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
                    <p className="text-muted-foreground text-lg leading-relaxed mb-6">
                      We believe shopping should be more than just buying
                      products. It should be about discovering new
                      possibilities, connecting with brands that share your
                      values, and feeling confident in every purchase you make.
                    </p>
                    <p className="text-muted-foreground text-lg leading-relaxed">
                      That's why we've built a platform that prioritizes
                      quality, authenticity, and customer satisfaction above all
                      else. Every product in our catalog is carefully selected
                      and every interaction is designed to delight.
                    </p>
                  </div>
                  <div className="relative h-96 rounded-lg overflow-hidden">
                    <Image
                      src="/modern-office-collaboration.png"
                      alt="Our mission"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>
        </ScrollAnimation>

        {/* Values Section */}
        <ScrollAnimation>
          <section className="py-16">
            <div className="container px-4">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-4">Our Values</h2>
                <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                  These core principles guide everything we do and shape the
                  experience we create for our customers.
                </p>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                {values.map((value, index) => (
                  <ScrollAnimation key={value.title} delay={index * 0.1}>
                    <Card className="text-center h-full">
                      <CardHeader>
                        <value.icon className="w-12 h-12 mx-auto mb-4 text-primary" />
                        <CardTitle className="text-xl">{value.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <CardDescription className="text-base">
                          {value.description}
                        </CardDescription>
                      </CardContent>
                    </Card>
                  </ScrollAnimation>
                ))}
              </div>
            </div>
          </section>
        </ScrollAnimation>

        {/* Team Section */}
        <ScrollAnimation>
          <section className="py-16 bg-muted/30">
            <div className="container px-4">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-4">Meet Our Team</h2>
                <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                  The passionate individuals behind our mission to transform
                  e-commerce.
                </p>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
                {team.map((member, index) => (
                  <ScrollAnimation key={member.name} delay={index * 0.1}>
                    <Card className="text-center">
                      <CardContent className="p-6">
                        <div className="relative w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden">
                          <Image
                            src={member.image || "/placeholder.svg"}
                            alt={member.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <h3 className="text-xl font-semibold mb-2">
                          {member.name}
                        </h3>
                        <p className="text-primary font-medium mb-3">
                          {member.role}
                        </p>
                        <p className="text-muted-foreground text-sm">
                          {member.bio}
                        </p>
                      </CardContent>
                    </Card>
                  </ScrollAnimation>
                ))}
              </div>
            </div>
          </section>
        </ScrollAnimation>
      </main>
      <Footer />
    </div>
  );
}
