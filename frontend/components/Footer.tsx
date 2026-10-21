"use client";

export default function Footer() {
  return (
    <footer className="bg-[#0F172A] border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-lg bg-[#1E293B] flex items-center justify-center">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path
                    d="M9 2L2 6v6l7 4 7-4V6L9 2z"
                    stroke="#0F766E"
                    strokeWidth="1.5"
                    fill="none"
                  />
                  <path
                    d="M9 8v4M6 10l3 2 3-2"
                    stroke="#0F766E"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
              <span className="font-serif text-xl font-bold text-white">
                Prevo
              </span>
            </div>
            <p className="text-white/40 text-sm leading-relaxed">
              AI-powered claim denial prevention for independent medical
              practices.
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="text-white/80 text-sm font-semibold mb-4">
              Product
            </h4>
            <ul className="space-y-2.5">
              {[
                ["How It Works", "#how-it-works"],
                ["Scenarios", "#scenarios"],
                ["Code Guide", "#code-guide"],
                ["Denial Playbook", "#playbook"],
                ["Live Demo", "#demo"],
              ].map(([item, href]) => (
                <li key={item}>
                  <a
                    href={href}
                    className="text-white/40 text-sm hover:text-[#0F766E] transition-colors"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-white/80 text-sm font-semibold mb-4">
              Company
            </h4>
            <ul className="space-y-2.5">
              {["About", "Blog", "Careers", "Contact"].map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="text-white/40 text-sm hover:text-[#0F766E] transition-colors"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-white/80 text-sm font-semibold mb-4">Legal</h4>
            <ul className="space-y-2.5">
              {["Privacy Policy", "Terms of Service", "HIPAA Compliance", "Security"].map(
                (item) => (
                  <li key={item}>
                    <a
                      href="#"
                      className="text-white/40 text-sm hover:text-[#0F766E] transition-colors"
                    >
                      {item}
                    </a>
                  </li>
                )
              )}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-16 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-white/30 text-xs">
            &copy; {new Date().getFullYear()} Prevo Health, Inc. All rights
            reserved.
          </p>
          <div className="flex items-center gap-4">
            {/* Social placeholders */}
            {["Twitter", "LinkedIn", "GitHub"].map((s) => (
              <a
                key={s}
                href="#"
                className="text-white/20 text-xs hover:text-[#0F766E] transition-colors"
              >
                {s}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
