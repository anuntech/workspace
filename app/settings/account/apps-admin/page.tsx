"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal } from "lucide-react"; // ícone para o botão de opções
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function AppsAdminPage() {
  const events = [
    {
      title: "Bear Hug: Live in Concert",
      date: "May 20, 2024 at 10 PM",
      location: "Harmony Theater, Winnipeg, MB",
      ticketsSold: "350/500 tickets sold",
      status: "On Sale",
      statusColor: "green",
      imageUrl: "/images/bear-hug.jpg",
    },
    {
      title: "Six Fingers — DJ Set",
      date: "Jun 2, 2024 at 8 PM",
      location: "Moonbeam Arena, Uxbridge, ON",
      ticketsSold: "72/150 tickets sold",
      status: "On Sale",
      statusColor: "green",
      imageUrl: "/images/six-fingers.jpg",
    },
    {
      title: "We All Look The Same",
      date: "Aug 5, 2024 at 4 PM",
      location: "Electric Coliseum, New York, NY",
      ticketsSold: "275/275 tickets sold",
      status: "Closed",
      statusColor: "gray",
      imageUrl: "/images/we-all-look.jpg",
    },
    {
      title: "Viking People",
      date: "Dec 31, 2024 at 8 PM",
      location: "Tapestry Hall, Cambridge, ON",
      ticketsSold: "6/40 tickets sold",
      status: "On Sale",
      statusColor: "green",
      imageUrl: "/images/viking-people.jpg",
    },
  ];

  const searchParams = useSearchParams();
  const workspace = searchParams.get("workspace");

  return (
    <div className="flex flex-col items-center p-10">
      <div className="w-full max-w-3xl space-y-5">
        <h1 className="text-2xl">Aplicações</h1>
        <div className="flex justify-between items-center">
          <Input type="text" placeholder="Search events..." className="w-2/3" />
          <Button className="ml-4">
            <Link href={`/settings/account/admin?workspace=${workspace}`}>
              Create event
            </Link>
          </Button>
        </div>

        <div className="space-y-5">
          {events.map((event, index) => (
            <div
              key={index}
              className="flex items-center space-x-4 p-4 border-b"
            >
              <img
                src={event.imageUrl}
                alt={event.title}
                className="w-20 h-20 object-cover rounded-md"
              />
              <div className="flex flex-col flex-grow">
                <h2 className="text-lg font-semibold">{event.title}</h2>
                <p className="text-sm text-gray-500">
                  {event.date} - {event.location}
                </p>
                <p className="text-sm text-gray-500">{event.ticketsSold}</p>
              </div>
              <Badge
                className={`px-2 py-1 ${
                  event.statusColor === "green"
                    ? "bg-green-100 text-green-600"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {event.status}
              </Badge>
              <Button variant="ghost">
                <MoreHorizontal className="w-5 h-5" />
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
