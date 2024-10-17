import { AvatarPopover } from "./avatar-popover";

export function AvatarSelector() {
  return (
    <div className="flex items-center space-x-4">
      <div className="relative w-52 h-52 group">
        {false ? (
          <div className="w-52 h-52 flex items-center justify-center">
            <img src={""} alt={"Avatar"} className="object-cover rounded-md" />
          </div>
        ) : (
          <div className="bg-zinc-300 w-52 h-52 rounded-[10px] flex items-center justify-center text-[1.5rem]">
            ?
          </div>
        )}

        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 rounded-md transition-opacity duration-300">
          <AvatarPopover />
        </div>
      </div>
    </div>
  );
}