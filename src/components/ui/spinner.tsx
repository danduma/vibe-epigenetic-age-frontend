
import { Loader2 } from "lucide-react";

export const Spinner = ({ className = "" }: { className?: string }) => {
  return (
    <div className="flex justify-center items-center">
      <Loader2 className={`h-8 w-8 animate-spin-slow text-primary ${className}`} />
    </div>
  );
};
