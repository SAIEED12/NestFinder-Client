"use client";
import { useState, useEffect } from "react";
import { Link, Button } from "@heroui/react";
import { useTheme } from "next-themes";
import { Home, Sun, Moon } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useSession, signOut } from "@/lib/auth-client";
import Image from "next/image";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  const { data: session, isPending } = useSession();
  const user = session?.user;
  const router = useRouter()


  const handleSignOut = async () => {
    await signOut();
    router.push("/login");
  }

  // Prevent hydration mismatch for client-side state icons
  useEffect(() => {
    setMounted(true);
  }, []);

  const pathname = usePathname();
  if(pathname.includes('dashboard')){
    return null;
  }

  

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "All Properties", href: "/all-properties" },
    { name: "Services", href: "/services" },
    { name: "About", href: "/about" },
  ];

  if(user){
    navLinks.push({ name: "Dashboard", href: "/dashboard" });
  }

  return (
    <nav className="sticky top-0 z-40 w-full border-b border-gray-100 bg-white/80 dark:bg-zinc-950/80 dark:border-zinc-800 backdrop-blur-lg transition-colors duration-200">
      <header className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        {/* Left Side: Mobile Menu Button & Brand Logo */}
        <div className="flex items-center gap-4">
          <button
            className="md:hidden text-zinc-600 dark:text-zinc-300"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
            aria-expanded={isMenuOpen}
          >
            <span className="sr-only">Menu</span>
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>

          {/* Logo with matching brand color styling */}
          <div className="flex items-center gap-2 cursor-pointer">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#E05638] text-white">
              <Home size={18} strokeWidth={2.5} />
            </div>
            <p className="text-xl font-bold tracking-tight text-zinc-900 dark:text-white">
              NestFinder
            </p>
          </div>
        </div>

        {/* Center: Navigation Links matching the design image */}
        <div className="hidden md:flex gap-6 lg:gap-8 items-center">
          {navLinks.map((navLink) => {
            const isActive = pathname === navLink.href;
            return (
              <Link
                key={navLink.href}
                href={navLink.href}
                className={`font-medium text-sm transition-colors relative py-1 whitespace-nowrap hover:no-underline ${
                  isActive
                    ? "text-[#E05638] font-semibold dark:text-[#E05638]"
                    : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                }`}
              >
                {navLink.name}
                {isActive && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-[#E05638] to-[#c9492e]" />
                )}
              </Link>
            );
          })}
        </div>

        {/* Right Side: Theme Toggle & Authentication Buttons */}
        <div className="flex items-center gap-4">
          {/* Theme Toggle Switch */}
          <Button
            variant="ghost"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="p-2 rounded-full text-zinc-600 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800 transition-colors"
            aria-label="Toggle Theme"
          >
            {mounted ? (
              theme === "dark" ? (
                <Sun size={20} />
              ) : (
                <Moon size={20} />
              )
            ) : (
              <div className="w-5 h-5" />
            )}
          </Button>

          {
            user ? 
            <>
            <p className="hidden lg:text-sm font-medium text-zinc-700 dark:text-zinc-200">
              Hi, {user.name}!
            </p>
            <Image
                src={session?.user?.image}
                alt="User Avatar"
                width={30}
                height={30}
                className="rounded-full"
              />
              <Button
              onClick={handleSignOut}  
              variant="ghost">
              SignOut
              </Button>
              
            </>
            :  
              <><Link
                href="/login"
                className="hidden text-sm font-medium text-zinc-700 dark:text-zinc-200 hover:text-zinc-900 sm:block hover:no-underline"
              >
                Login
              </Link><Link
                href="/register"
                className="rounded-xl bg-[#E05638] px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#c9492e] transition-all hover:no-underline"
              >
                  Register
                </Link></>
            
          }


        </div>
      </header>

      {/* Mobile Dropdown Menu Navigation */}
      {isMenuOpen && (
        <div className="border-t border-gray-100 bg-white dark:bg-zinc-950 dark:border-zinc-800 md:hidden">
          <ul className="flex flex-col gap-1 p-4">
            {navLinks.map((navLink) => {
              const isActive = pathname === navLink.href;
              return (
                <li key={navLink.href}>
                  <Link
                    href={navLink.href}
                    className={`block py-2 text-sm font-medium no-underline hover:no-underline transition-colors ${
                      isActive
                        ? "text-[#E05638] font-semibold"
                        : "text-zinc-600 dark:text-zinc-300"
                    }`}
                  >
                    {navLink.name}
                  </Link>
                </li>
              );
            })}
            <li className="mt-2 flex flex-col gap-2 border-t border-gray-100 dark:border-zinc-800 pt-4">
              <Link
                href="/login"
                className="block py-2 text-sm font-medium text-zinc-600 dark:text-zinc-300 hover:no-underline"
              >
                Login
              </Link>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
}
