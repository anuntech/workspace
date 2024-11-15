import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface Props {
  value: string;
  setValue: (value: "free" | "premium" | "buyable" | "rentable") => void;
}

export function WorkspaceAccessRadio({ value, setValue }: Props) {
  return (
    <RadioGroup
      defaultValue="free"
      value={value}
      onValueChange={(value) =>
        setValue(value as "free" | "premium" | "buyable" | "rentable")
      }
      className="flex items-center space-x-2"
    >
      <div className="flex items-center gap-2">
        <RadioGroupItem value="free" />
        <Label htmlFor="r1">Free</Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="premium" />
        <Label htmlFor="r2">Premium</Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="buyable" />
        <Label htmlFor="r2">Buyable</Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="rentable" />
        <Label htmlFor="r2">Rentable</Label>
      </div>
    </RadioGroup>
  );
}
