import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
      <h2 className="text-3xl font-bold mb-4">Page Not Found</h2>
      <p className="text-gray-600 mb-8">Sorry, we couldn't find the page you're looking for.</p>
      <Button asChild>
        <Link href="/" className="flex items-center gap-2">
          <Home className="w-4 h-4" />
          Return Home
        </Link>
      </Button>
    </div>
  );
}