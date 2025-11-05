"use client";

import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardAction,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { useAuth } from "@/lib/auth-context";
import { format } from "date-fns";
import {
  Camera,
  MapPin,
  Calendar,
  Mail,
  Phone,
  Edit2,
  Save,
  X,
  Package,
  Heart,
  Star,
} from "lucide-react";
import { useState } from "react";

export default function UserProfilePage() {
  const { state } = useAuth();

  if (!state.isAuthenticated) {
    return null;
  }
  const createDate = state.user?.created_at;
  const updateDate = state.user?.updated_at;

  const createDateFormated = format(
    new Date(createDate || ""),
    "dd-MM-yyyy HH:mm"
  );

  const updateDateFormated = format(
    new Date(updateDate || ""),
    "dd-MM-yyyy HH:mm"
  );

  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: "John Doe",
    email: "user@example.com",
    phone: "+1 (555) 123-4567",
    location: "New York, USA",
    bio: "Tech enthusiast and avid shopper. Love discovering new products and trends!",
    joinDate: "January 2024",
  });

  const stats = [
    {
      icon: Package,
      label: "Total Orders",
      value: "24",
      color: "from-blue-500 to-blue-600",
    },
    {
      icon: Heart,
      label: "Wishlist Items",
      value: "12",
      color: "from-pink-500 to-pink-600",
    },
    {
      icon: Star,
      label: "Reviews",
      value: "18",
      color: "from-orange-500 to-orange-600",
    },
  ];

  const recentOrders = [
    {
      id: "62",
      product: "Premium Wireless Headphones",
      date: "01-09-2025",
      status: "Processing",
      amount: "$299.99",
    },
    {
      id: "67",
      product: "Minimalist Desk Lamp",
      date: "18-07-2024",
      status: "Delivered",
      amount: "$89.99",
    },
    {
      id: "69",
      product: "Wireless Charging Pad",
      date: "18-07-2024",
      status: "Delivered",
      amount: "$49.99",
    },
  ];

  const handleSave = () => {
    setIsEditing(false);
    // Aquí irían las llamadas a la API para guardar los cambios
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Revertir cambios si es necesario
  };

  return (
    <div className="min-h-screen">
      <Header />

      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white p-6">
        <div className="max-w-6xl mx-auto">
          {/* Header con Banner y Avatar */}
          <div className="relative mb-8">
            {/* Avatar y Botones */}
            <div className=" flex items-end gap-6">
              <div className="relative">
                <div className="w-32 h-32 rounded-full border-4 border-gray-900 bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-4xl font-bold">
                  JD
                </div>
                <button className="absolute bottom-0 right-0 p-2 bg-orange-500 rounded-full hover:bg-orange-600 transition-colors">
                  <Camera size={16} />
                </button>
              </div>
              <div className="mb-4">
                <h1 className="text-3xl font-bold">{profileData.name}</h1>
                <p className="text-gray-400">
                  Member since {profileData.joinDate}
                </p>
              </div>
            </div>

            <div className="absolute top-4 right-4">
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2 bg-gray-800 bg-opacity-70 backdrop-blur-lg hover:bg-opacity-90 px-4 py-2 rounded-lg transition-all"
                >
                  <Edit2 size={18} />
                  Edit Profile
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={handleSave}
                    className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 px-4 py-2 rounded-lg transition-colors"
                  >
                    <Save size={18} />
                    Save
                  </button>
                  <button
                    onClick={handleCancel}
                    className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg transition-colors"
                  >
                    <X size={18} />
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 mt-20">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div
                  key={index}
                  className="bg-gray-800 bg-opacity-50 backdrop-blur-lg rounded-xl p-6 border border-gray-700"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-lg flex items-center justify-center`}
                    >
                      <Icon size={24} />
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">{stat.label}</p>
                      <p className="text-2xl font-bold">{stat.value}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Información Personal */}
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-gray-800 bg-opacity-50 backdrop-blur-lg rounded-xl p-6 border border-gray-700">
                <h2 className="text-xl font-bold mb-4">Personal Information</h2>

                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Mail className="text-orange-500 mt-1" size={20} />
                    <div className="flex-1">
                      <p className="text-gray-400 text-sm">Email</p>
                      {isEditing ? (
                        <input
                          type="email"
                          value={profileData.email}
                          onChange={(e) =>
                            setProfileData({
                              ...profileData,
                              email: e.target.value,
                            })
                          }
                          className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-1 mt-1 text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                        />
                      ) : (
                        <p className="font-medium">{profileData.email}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Phone className="text-orange-500 mt-1" size={20} />
                    <div className="flex-1">
                      <p className="text-gray-400 text-sm">Phone</p>
                      {isEditing ? (
                        <input
                          type="tel"
                          value={profileData.phone}
                          onChange={(e) =>
                            setProfileData({
                              ...profileData,
                              phone: e.target.value,
                            })
                          }
                          className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-1 mt-1 text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                        />
                      ) : (
                        <p className="font-medium">{profileData.phone}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <MapPin className="text-orange-500 mt-1" size={20} />
                    <div className="flex-1">
                      <p className="text-gray-400 text-sm">Location</p>
                      {isEditing ? (
                        <input
                          type="text"
                          value={profileData.location}
                          onChange={(e) =>
                            setProfileData({
                              ...profileData,
                              location: e.target.value,
                            })
                          }
                          className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-1 mt-1 text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                        />
                      ) : (
                        <p className="font-medium">{profileData.location}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Calendar className="text-orange-500 mt-1" size={20} />
                    <div className="flex-1">
                      <p className="text-gray-400 text-sm">Member Since</p>
                      <p className="font-medium">{profileData.joinDate}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bio */}
              <div className="bg-gray-800 bg-opacity-50 backdrop-blur-lg rounded-xl p-6 border border-gray-700">
                <h2 className="text-xl font-bold mb-4">About Me</h2>
                {isEditing ? (
                  <textarea
                    value={profileData.bio}
                    onChange={(e) =>
                      setProfileData({ ...profileData, bio: e.target.value })
                    }
                    rows={4}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                ) : (
                  <p className="text-gray-300">{profileData.bio}</p>
                )}
              </div>
            </div>

            {/* Recent Orders */}
            <div className="lg:col-span-2">
              <div className="bg-gray-800 bg-opacity-50 backdrop-blur-lg rounded-xl p-6 border border-gray-700">
                <h2 className="text-xl font-bold mb-6">Recent Orders</h2>

                <div className="space-y-4">
                  {recentOrders.map((order) => (
                    <div
                      key={order.id}
                      className="bg-gray-700 bg-opacity-50 rounded-lg p-4 hover:bg-opacity-70 transition-all"
                    >
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <span className="text-orange-500 font-semibold">
                              #{order.id}
                            </span>
                            <span
                              className={`text-xs px-2 py-1 rounded-full ${
                                order.status === "Delivered"
                                  ? "bg-green-500 bg-opacity-20 text-green-400"
                                  : "bg-blue-500 bg-opacity-20 text-blue-400"
                              }`}
                            >
                              {order.status}
                            </span>
                          </div>
                          <p className="font-medium mb-1">{order.product}</p>
                          <p className="text-gray-400 text-sm">{order.date}</p>
                        </div>
                        <div className="flex items-center gap-4">
                          <p className="text-xl font-bold text-orange-500">
                            {order.amount}
                          </p>
                          <button className="bg-gray-600 hover:bg-gray-500 px-4 py-2 rounded-lg text-sm transition-colors">
                            View Details
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <button className="w-full mt-6 bg-gray-700 hover:bg-gray-600 text-white font-medium px-6 py-3 rounded-lg transition-colors">
                  View All Orders
                </button>
              </div>

              {/* Activity Section */}
              <div className="mt-6 bg-gray-800 bg-opacity-50 backdrop-blur-lg rounded-xl p-6 border border-gray-700">
                <h2 className="text-xl font-bold mb-6">Recent Activity</h2>

                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                    <div className="flex-1">
                      <p className="font-medium">
                        Reviewed "Minimalist Desk Lamp"
                      </p>
                      <p className="text-gray-400 text-sm">2 days ago</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                    <div className="flex-1">
                      <p className="font-medium">Added 3 items to wishlist</p>
                      <p className="text-gray-400 text-sm">5 days ago</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                    <div className="flex-1">
                      <p className="font-medium">Updated profile information</p>
                      <p className="text-gray-400 text-sm">1 week ago</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* <div className="h-fit flex justify-center ">
        <Card className="m-8 py-8 px-2 md:px-6 w-2xl h-fit">
          <CardHeader>
            <CardTitle>
              {state.user?.first_name} {state.user?.last_name}
            </CardTitle>
            <CardDescription>Manage your profile settings</CardDescription>
            <CardAction>
              <button className="btn btn-primary px-3 py-1 cursor-pointer border-2 border-[orange] hover:shadow shadow-[orange] transition-shadow duration-300 ">
                Edit
              </button>
            </CardAction>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <span className="font-bold">
              Your ID:{" "}
              <p className="font-normal text-sm pl-3">{state.user?.id}</p>
            </span>
            <span className="font-bold">
              Email:{" "}
              <p className="font-normal text-sm pl-3">{state.user?.email}</p>
            </span>
            <span className="font-bold">
              Rol:{" "}
              <p className="font-normal text-sm pl-3">{state.user?.role}</p>
            </span>
            <span className="font-bold">
              Created on:
              <p className="font-normal text-sm pl-3">
                {createDateFormated}hs.
              </p>
            </span>
            <span className="font-bold">
              Last updated:
              <p className="font-normal text-sm pl-3">
                {updateDateFormated}hs.
              </p>
            </span>
          </CardContent>
          <CardFooter>
            <p>
              <i>All your user information is save.</i>
            </p>
          </CardFooter>
        </Card>
      </div> */}
      <Footer />
    </div>
  );
}
