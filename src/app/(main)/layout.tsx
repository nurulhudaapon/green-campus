import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { HeaderProfile } from "../component";
import {
  UserCircle,
  CreditCard,
  GraduationCap,
  ClipboardList,
  Calendar,
} from "lucide-react";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const navItems = [
    {
      href: "/profile",
      label: "Profile",
      icon: UserCircle,
    },
    {
      href: "/billing",
      label: "Billing",
      icon: CreditCard,
    },
    {
      href: "/result",
      label: "Result",
      icon: GraduationCap,
    },
    {
      href: "/preregistration",
      label: "Pre-Registration",
      icon: ClipboardList,
    },
    {
      href: "/routine",
      label: "Routine",
      icon: Calendar,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-white shadow-sm">
        <div className="flex h-16 items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-4">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px] sm:w-[400px]">
                <nav className="flex flex-col space-y-2">
                  {navItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-900 hover:bg-gray-100 transition-colors"
                    >
                      <item.icon className="h-5 w-5 text-gray-500" />
                      {item.label}
                    </Link>
                  ))}
                </nav>
              </SheetContent>
            </Sheet>
            <Image
              src="https://studentportal.green.edu.bd/logo.png"
              alt="GUB Logo"
              width={40}
              height={40}
              className="h-10 w-10"
            />
            <h1 className="hidden text-xl font-semibold md:block">
              <span className="text-green-600">Green</span>{" "}
              <span className="text-sky-500">University of Bangladesh</span>
            </h1>
          </div>
          <HeaderProfile />
        </div>
      </header>

      {/* Sidebar and Main Content */}
      <div className="flex">
        {/* Sidebar for larger screens */}
        <aside className="fixed bottom-0 left-0 top-16 hidden w-64 overflow-y-auto border-r bg-white px-3 py-4 md:block">
          <nav className="space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-900 hover:bg-gray-100 transition-colors"
              >
                <item.icon className="h-5 w-5 text-gray-500" />
                {item.label}
              </Link>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 px-4 py-8 md:ml-64 md:px-6">{children}</main>
      </div>
    </div>
  );
}
