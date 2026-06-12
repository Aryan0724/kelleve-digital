import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Menu, Search, User } from "lucide-react";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl font-bold tracking-tight text-primary">
            FindMyInterior<span className="text-orange-500">.</span>
          </span>
        </Link>
        <div className="hidden md:flex ml-10 gap-6">
          <Link href="/professionals" className="text-sm font-medium hover:text-primary">
            Professionals
          </Link>
          <Link href="/projects" className="text-sm font-medium hover:text-primary">
            Projects
          </Link>
          <Link href="/materials" className="text-sm font-medium hover:text-primary">
            Materials
          </Link>
          <Link href="/workers" className="text-sm font-medium hover:text-primary">
            Workforce
          </Link>
          <Link href="/blog" className="text-sm font-medium hover:text-primary">
            Blog
          </Link>
          <Link href="/post-requirement" className="text-sm font-medium text-orange-600 hover:text-orange-700">
            Post Requirement
          </Link>
        </div>
        <div className="ml-auto flex items-center gap-4">
          <Button variant="ghost" size="icon" className="md:hidden">
            <Search className="h-5 w-5" />
            <span className="sr-only">Search</span>
          </Button>
          <div className="hidden md:flex items-center gap-2">
            <Button variant="outline" render={<Link href="/login" />} nativeButton={false}>
              Log in
            </Button>
            <Button render={<Link href="/join" />} nativeButton={false}>
              List Business
            </Button>
          </div>
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
