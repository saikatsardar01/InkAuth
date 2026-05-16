import Link from "next/link";

export default function Footer() {
  return (
    // <footer className="bg-background border-t border-border pt-24 pb-12">
    //   <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    //     <div className="grid grid-cols-1 md:grid-cols-4 gap-12 border-b border-border pb-16">
    //       <div className="md:col-span-2">
    //         <span className="font-bold text-2xl tracking-tighter mb-4 block text-foreground">Ink Auth</span>
    //         <p className="max-w-xs text-foreground/50 leading-relaxed">
    //           A sanctuary for readers and writers. We believe in the power of stories to change the world.
    //         </p>
    //       </div>
    //       <div>
    //         <h4 className="font-bold mb-6 text-foreground">Explore</h4>
    //         <ul className="space-y-4 text-sm text-foreground/50">
    //           <li><Link href="/library" prefetch={false} className="hover:text-foreground transition-colors">Library</Link></li>
    //           <li><Link href="/coming-soon" prefetch={false} className="hover:text-foreground transition-colors">Authors</Link></li>
    //           <li><Link href="/coming-soon" prefetch={false} className="hover:text-foreground transition-colors">Membership</Link></li>
    //         </ul>
    //       </div>
    //       <div>
    //         <h4 className="font-bold mb-6 text-foreground">Support</h4>
    //         <ul className="space-y-4 text-sm text-foreground/50">
    //           <li><Link href="/coming-soon" prefetch={false} className="hover:text-foreground transition-colors">Help Center</Link></li>
    //           <li><Link href="/terms" prefetch={false} className="hover:text-foreground transition-colors">Terms of Service</Link></li>
    //           <li><Link href="/privacy" prefetch={false} className="hover:text-foreground transition-colors">Privacy</Link></li>
    //         </ul>
    //       </div>
    //     </div>
    //     <div className="pt-8 text-sm text-foreground/30 flex justify-between items-center">
    //       <p>© 2026 Ink Auth. All rights reserved.</p>
    //       <div className="flex space-x-6">
    //         <Link href="#" prefetch={false} className="hover:text-foreground transition-colors">Twitter</Link>
    //         <Link href="#" prefetch={false} className="hover:text-foreground transition-colors">Instagram</Link>
    //       </div>
    //     </div>
    //   </div>
    // </footer>
    <footer className="bg-accent py-20 transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 border-b border-border pb-16">
          <div className="md:col-span-2">
            <span className="font-bold text-2xl tracking-tighter mb-4 block text-foreground text-3xl">Ink Auth</span>
            <p className="max-w-xs text-foreground/50 text-lg leading-relaxed">
              A sanctuary for readers and writers. We believe in the power of stories to change the world.
            </p>
          </div>
          <div>
            <h4 className="font-bold mb-6 text-foreground font-bold text-2xl">Explore</h4>
            <ul className="space-y-4 text-lg text-foreground/50 text-bold]">
              <li><Link href="/library" prefetch={false} className="hover:text-foreground transition-colors">Library</Link></li>
              <li>
                <Link href="/radio" prefetch={false} className="group flex items-center gap-3 hover:text-foreground transition-all duration-300">
                  <span className="font-bold">Radio</span>
                  <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-red-700 text-[12px] font-black text-white uppercase tracking-tighter relative overflow-hidden group-hover:scale-110 transition-transform">
                    <span className="relative z-10">Live</span>
                    <span className="absolute inset-0 bg-white/50 animate-[pulse_2.5s_infinite]"></span>
                  </span>
                </Link>
              </li>
              <li><Link href="/coming-soon" prefetch={false} className="hover:text-foreground transition-colors">Membership</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-6 text-foreground font-bold text-2xl">Support</h4>
            <ul className="space-y-4 text-lg text-foreground/50">
              <li><Link href="/coming-soon" prefetch={false} className="hover:text-foreground transition-colors">Help Center</Link></li>
              <li><Link href="/terms" prefetch={false} className="hover:text-foreground transition-colors">Terms of Service</Link></li>
              <li><Link href="/privacy" prefetch={false} className="hover:text-foreground transition-colors">Privacy</Link></li>
            </ul>
          </div>
        </div>
        <div className="pt-8 text-base text-foreground/30 flex justify-between items-center">
          <p>© {new Date().getFullYear()} Ink Auth. All rights reserved.</p>
          <div className="flex space-x-6">
            <Link href="#" prefetch={false} className="hover:text-foreground transition-colors">Twitter</Link>
            <Link href="https://www.instagram.com/inkauth.in/" prefetch={false} className="hover:text-foreground transition-colors">Instagram</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
