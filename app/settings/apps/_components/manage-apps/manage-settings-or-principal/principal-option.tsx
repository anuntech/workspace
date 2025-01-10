import { Button } from "@/components/ui/button";
import Link from "next/link";
import { DropdownApplication } from "@/app/(workspace)/_components/sidebar/dropdown-application";
import { useRef, useState } from "react";
import { IconComponent } from "@/components/get-lucide-icons";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getS3Image } from "@/libs/s3-client";
import { ChevronUp } from "lucide-react";
import { AppFormData } from "../types";

interface PrincipalOptionProps {
  data: AppFormData;
}

export function PrincipalOption({ data }: PrincipalOptionProps) {
  const buttonRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);

  return (
    <>
      <Button
        variant="ghost"
        asChild
        className="bg-gray-200 mb-1 text-gray-900 hover:bg-gray-200 hover:text-gray-900 transition-colors duration-150"
      >
        <div
          className="flex items-center justify-between w-72 h-4"
          ref={buttonRef}
        >
          <Link href={``} passHref className="flex items-center">
            <div className="flex items-center justify-center">
              {data.images.emojiAvatarType === "emoji" && (
                <p className="pointer-events-none">{data.images.emojiAvatar}</p>
              )}
              {data.images.emojiAvatarType === "lucide" && (
                <IconComponent
                  className="size-5 pointer-events-none"
                  name={data.images.emojiAvatar}
                />
              )}
              {(data.images.emojiAvatarType === "image" ||
                !data.images.emojiAvatar) && (
                <Avatar className="size-5">
                  <AvatarImage src={getS3Image(data.images.emojiAvatar)} />
                  <AvatarFallback>AB</AvatarFallback>
                </Avatar>
              )}
            </div>
            <span className="ml-3">{data.principalLink.title}</span>
          </Link>

          <div className="flex items-center gap-2">
            <DropdownApplication
              isHover={true}
              applicationId={"123"}
              className="text-muted-foreground"
            />
            {data.sublinks.length > 0 && (
              <ChevronUp className="text-muted-foreground cursor-pointer" />
            )}
          </div>
        </div>
      </Button>

      <div className="flex flex-col gap-5">
        {data.sublinks.map((sub, index) => (
          <Button
            key={index}
            variant="ghost"
            className="hover:bg-gray-200 w-72 hover:text-gray-900 transition-colors duration-150 justify-start pl-10 relative before:content-['•'] before:absolute before:left-6 before:text-gray-500 h-4 py-4"
          >
            {sub.title}
          </Button>
        ))}

        <Button variant="outline" className="w-48 mt-4">
          Adicionar sublink
        </Button>
      </div>
    </>
  );
}
