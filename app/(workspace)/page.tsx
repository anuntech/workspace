"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import api from "@/libs/api";
import { useIsFetching, useMutation, useQuery } from "@tanstack/react-query";
import {
  ArrowRight,
  Briefcase,
  CheckCircle,
  PlusSquare,
  UserPlus,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { TutorialDashboard } from "./_components/tutorial-dashboard";
import SplashScreen from "@/components/splash-screen";
import { useEffect, useState } from "react";

export default function WorkspacePage() {
  const workspace = useSearchParams().get("workspace");

  const roleQuery = useQuery({
    queryKey: ["workspace/role"],
    queryFn: () =>
      fetch(`/api/workspace/role/${workspace}`).then(async (res) => ({
        data: await res.json(),
        status: res.status,
      })),
  });

  const [showVideo, setShowVideo] = useState(
    !localStorage.getItem("completedIntro")
  );

  const sideBar = useSidebar();

  return (
    <>
      <header className="flex h-14 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
        <div className="flex items-center gap-2">
          <SidebarTrigger
            onClick={() =>
              localStorage.setItem("sidebar", String(!sideBar.open))
            }
            className="-ml-1"
          />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbPage>Dashboard</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      {roleQuery.data?.data?.role !== "member" && !roleQuery.isPending && (
        <TutorialDashboard />
      )}
      {showVideo && (
        <SplashScreen
          onFinish={() => {
            setShowVideo(false);
            localStorage.setItem("completedIntro", "true");
          }}
        />
      )}
    </>
  );
}
