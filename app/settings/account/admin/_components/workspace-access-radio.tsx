import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface Props {
  value: string;
  setValue: (value: string) => void;
}

export function WorkspaceAccessRadio({ value, setValue }: Props) {
  return (
    <RadioGroup
      defaultValue="free"
      value={value}
      onValueChange={(value) => setValue(value)}
      className="flex items-center space-x-2"
    >
      <div className="flex items-center gap-2">
        <RadioGroupItem value="free" id="r1" />
        <Label htmlFor="r1">Free</Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="premium" id="r2" />
        <Label htmlFor="r2">Premium</Label>
      </div>
    </RadioGroup>
  );
}
