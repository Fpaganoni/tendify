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

  return (
    <div className="min-h-screen">
      <Header />
      <div className="h-fit flex justify-center ">
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
      </div>
      <Footer />
    </div>
  );
}
