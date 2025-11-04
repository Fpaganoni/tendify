"use client";

import type React from "react";

import { useState } from "react";
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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
  MapPin,
  Phone,
  Mail,
  MessageSquare,
  HeadphonesIcon,
} from "lucide-react";

const contactInfo = [
  {
    icon: MapPin,
    title: "Visit Our Store",
    details: ["123 Commerce Street", "New York, NY 10001", "United States"],
    action: "Get Directions",
  },
  {
    icon: Phone,
    title: "Call Us",
    details: [
      "+1 (555) 123-4567",
      "Mon-Fri: 9AM-6PM EST",
      "Sat-Sun: 10AM-4PM EST",
    ],
    action: "Call Now",
  },
  {
    icon: Mail,
    title: "Email Support",
    details: [
      "support@modernstore.com",
      "sales@modernstore.com",
      "Response within 24 hours",
    ],
    action: "Send Email",
  },
];

const supportOptions = [
  {
    icon: MessageSquare,
    title: "Live Chat",
    description: "Get instant help from our support team",
    availability: "Available 24/7",
    badge: "Fastest",
  },
  {
    icon: HeadphonesIcon,
    title: "Phone Support",
    description: "Speak directly with our experts",
    availability: "Mon-Fri 9AM-6PM EST",
    badge: "Personal",
  },
  {
    icon: Mail,
    title: "Email Support",
    description: "Detailed assistance via email",
    availability: "Response within 24 hours",
    badge: "Detailed",
  },
];

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1000));

    toast({
      title: "Message sent successfully!",
      description: "We'll get back to you within 24 hours.",
      className: "bg-success-accent text-white",
    });

    setFormData({ name: "", email: "", subject: "", message: "" });
    setIsSubmitting(false);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

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
                  Get in Touch
                </Badge>
                <h1 className="text-4xl lg:text-6xl font-bold text-foreground mb-6">
                  We're Here to
                  <span className="text-primary"> Help</span>
                </h1>
                <p className="text-xl text-muted-foreground leading-relaxed">
                  Have questions about our products or need assistance with your
                  order? Our friendly support team is ready to help you every
                  step of the way.
                </p>
              </div>
            </div>
          </section>
        </ScrollAnimation>

        {/* Support Options */}
        <ScrollAnimation>
          <section className="py-16">
            <div className="container px-4">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-4">
                  Choose Your Preferred Support
                </h2>
                <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                  We offer multiple ways to get in touch. Pick the option that
                  works best for you.
                </p>
              </div>
              <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-10">
                {supportOptions.map((option, index) => (
                  <ScrollAnimation key={option.title} delay={index * 0.1}>
                    <Card className="text-center hover:shadow-lg transition-shadow duration-300">
                      <CardHeader>
                        <div className="relative">
                          <option.icon className="w-12 h-12 mx-auto mb-4 text-primary" />
                          <Badge
                            className="absolute -top-2 -right-8"
                            variant="secondary"
                          >
                            {option.badge}
                          </Badge>
                        </div>
                        <CardTitle className="text-xl">
                          {option.title}
                        </CardTitle>
                        <CardDescription className="text-base">
                          {option.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground mb-4">
                          {option.availability}
                        </p>
                        <Button className="w-full">Get Started</Button>
                      </CardContent>
                    </Card>
                  </ScrollAnimation>
                ))}
              </div>
            </div>
          </section>
        </ScrollAnimation>

        {/* Contact Form & Info */}
        <ScrollAnimation>
          <section className="py-16 bg-muted/30  ">
            <div className="container px-4 mb-10 mt-5">
              <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
                {/* Contact Form */}
                <div>
                  <h2 className="text-3xl font-bold mb-18">
                    Send Us a Message
                  </h2>
                  <Card className="sticky top-10">
                    <CardContent className="p-6">
                      <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="name">Full Name</Label>
                            <Input
                              id="name"
                              name="name"
                              value={formData.name}
                              onChange={handleChange}
                              required
                              className="mt-1"
                            />
                          </div>
                          <div>
                            <Label htmlFor="email">Email Address</Label>
                            <Input
                              id="email"
                              name="email"
                              type="email"
                              value={formData.email}
                              onChange={handleChange}
                              required
                              className="mt-1"
                            />
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="subject">Subject</Label>
                          <Input
                            id="subject"
                            name="subject"
                            value={formData.subject}
                            onChange={handleChange}
                            required
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="message">Message</Label>
                          <Textarea
                            id="message"
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            required
                            rows={6}
                            className="mt-1 max-h-48"
                            placeholder="Tell us how we can help you..."
                          />
                        </div>
                        <Button
                          type="submit"
                          className="w-full"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? "Sending..." : "Send Message"}
                        </Button>
                      </form>
                    </CardContent>
                  </Card>
                </div>

                {/* Contact Information */}
                <div>
                  <h2 className="text-3xl font-bold mb-6">Get in Touch</h2>
                  <div className="space-y-6">
                    {contactInfo.map((info, index) => (
                      <ScrollAnimation key={info.title} delay={index * 0.1}>
                        <Card>
                          <CardContent className="p-6">
                            <div className="flex items-start space-x-4">
                              <info.icon className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
                              <div className="flex-1">
                                <h3 className="font-semibold text-lg mb-2">
                                  {info.title}
                                </h3>
                                {info.details.map((detail, idx) => (
                                  <p
                                    key={idx}
                                    className="text-muted-foreground mb-1"
                                  >
                                    {detail}
                                  </p>
                                ))}
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="mt-3 bg-transparent"
                                >
                                  {info.action}
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </ScrollAnimation>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>
        </ScrollAnimation>

        {/* FAQ Section */}
        <ScrollAnimation>
          <section className="py-16">
            <div className="container px-4">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-4">
                  Frequently Asked Questions
                </h2>
                <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                  Quick answers to common questions. Can't find what you're
                  looking for? Contact us directly.
                </p>
              </div>
              <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">
                      What are your shipping options?
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      We offer free standard shipping on orders over $50, with
                      express and overnight options available.
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">
                      What's your return policy?
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      We accept returns within 30 days of purchase for a full
                      refund, provided items are in original condition.
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">
                      Do you offer international shipping?
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      Yes, we ship to over 25 countries worldwide. Shipping
                      costs and delivery times vary by location.
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">
                      How can I track my order?
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      Once your order ships, you'll receive a tracking number
                      via email to monitor your package's progress.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>
        </ScrollAnimation>
      </main>
      <Footer />
    </div>
  );
}
