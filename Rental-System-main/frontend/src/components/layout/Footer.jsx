// import React from "react";
// import { Link } from "react-router-dom";

// const Footer = () => {
//   return (
//     <footer className="bg-amber-50 border-t-4 border-amber-800 mt-12">
//       <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
//           <div>
//             <h3 className="text-xl font-serif font-bold text-amber-900 mb-4 border-b-2 border-amber-800 pb-2">
//               {import.meta.env.REACT_APP_SITE_NAME || "Community Rental"}
//             </h3>
//             <p className="text-amber-800 text-sm leading-relaxed font-serif italic">
//               Connecting communities through sharing. Rent what you need, lend
//               what you don't use.
//             </p>
//           </div>

//           <div>
//             <h4 className="font-serif font-bold text-amber-900 mb-4 text-lg">
//               Quick Links
//             </h4>
//             <ul className="space-y-3 text-sm">
//               <li>
//                 <Link
//                   to="/items"
//                   className="text-amber-800 hover:text-amber-950 underline decoration-dotted font-serif"
//                 >
//                   Browse Items
//                 </Link>
//               </li>
//               <li>
//                 <Link
//                   to="/how-it-works"
//                   className="text-amber-800 hover:text-amber-950 underline decoration-dotted font-serif"
//                 >
//                   How It Works
//                 </Link>
//               </li>
//               <li>
//                 <Link
//                   to="/safety"
//                   className="text-amber-800 hover:text-amber-950 underline decoration-dotted font-serif"
//                 >
//                   Safety Tips
//                 </Link>
//               </li>
//             </ul>
//           </div>

//           <div>
//             <h4 className="font-serif font-bold text-amber-900 mb-4 text-lg">
//               Legal
//             </h4>
//             <ul className="space-y-3 text-sm">
//               <li>
//                 <Link
//                   to="/terms"
//                   className="text-amber-800 hover:text-amber-950 underline decoration-dotted font-serif"
//                 >
//                   Terms of Service
//                 </Link>
//               </li>
//               <li>
//                 <Link
//                   to="/privacy"
//                   className="text-amber-800 hover:text-amber-950 underline decoration-dotted font-serif"
//                 >
//                   Privacy Policy
//                 </Link>
//               </li>
//               <li>
//                 <Link
//                   to="/community"
//                   className="text-amber-800 hover:text-amber-950 underline decoration-dotted font-serif"
//                 >
//                   Community Guidelines
//                 </Link>
//               </li>
//             </ul>
//           </div>

//           <div>
//             <h4 className="font-serif font-bold text-amber-900 mb-4 text-lg">
//               Contact
//             </h4>
//             <ul className="space-y-3 text-sm font-serif">
//               <li className="text-amber-800">support@communityrental.com</li>
//               <li className="text-amber-800">+1 (555) 123-4567</li>
//               <li className="text-amber-800 italic">Mon-Fri, 9AM-6PM EST</li>
//             </ul>
//           </div>
//         </div>

//         <div className="border-t-2 border-amber-800 mt-8 pt-6 text-center text-sm text-amber-900">
//           <p className="font-serif">
//             &copy; {new Date().getFullYear()}{" "}
//             {import.meta.env.REACT_APP_SITE_NAME || "Community Rental"}. All
//             rights reserved.
//           </p>
//         </div>
//       </div>
//     </footer>
//   );
// };

// export default Footer;

import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  EnvelopeIcon,
  PhoneIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";

const Footer = () => {
  const footerLinks = [
    {
      title: "Quick Links",
      links: [
        { name: "Browse Items", path: "/items" },
        { name: "How It Works", path: "/how-it-works" },
        { name: "Safety Tips", path: "/safety" },
      ],
    },
    {
      title: "Legal",
      links: [
        { name: "Terms of Service", path: "/terms" },
        { name: "Privacy Policy", path: "/privacy" },
        { name: "Community Guidelines", path: "/community" },
      ],
    },
  ];

  const contactInfo = [
    {
      icon: EnvelopeIcon,
      text: "support@communityrental.com",
      type: "email",
    },
    {
      icon: PhoneIcon,
      text: "+1 (555) 123-4567",
      type: "phone",
    },
    {
      icon: ClockIcon,
      text: "Mon-Fri, 9AM-6PM EST",
      type: "hours",
    },
  ];

  return (
    <footer className="relative bg-gradient-to-b from-slate-900 via-slate-950 to-black border-t-2 border-amber-700/30 mt-auto overflow-hidden">
      {/* Decorative top line */}
      <div className="h-1 bg-gradient-to-r from-transparent via-amber-600 to-transparent" />

      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, rgb(217, 119, 6) 1px, transparent 0)`,
            backgroundSize: "30px 30px",
          }}
        />
      </div>

      {/* Decorative corner elements */}
      <div className="absolute top-0 left-0 w-32 h-32 border-l-2 border-t-2 border-amber-900/20" />
      <div className="absolute top-0 right-0 w-32 h-32 border-r-2 border-t-2 border-amber-900/20" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="md:col-span-1"
          >
            <div className="relative inline-block">
              <h3 className="text-2xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-200 to-amber-400 mb-4 pb-2">
                {import.meta.env.REACT_APP_SITE_NAME || "Community Rental"}
              </h3>
              <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-amber-600 to-transparent" />
            </div>
            <p className="text-amber-300/70 text-sm leading-relaxed font-serif italic mt-4">
              Connecting communities through sharing. Rent what you need, lend
              what you don't use.
            </p>

            {/* Decorative element */}
            <div className="mt-6 w-16 h-px bg-gradient-to-r from-amber-600 to-transparent" />
          </motion.div>

          {/* Links Sections */}
          {footerLinks.map((section, sectionIndex) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: sectionIndex * 0.1 }}
            >
              <h4 className="font-serif font-bold text-amber-200 mb-6 text-lg relative inline-block">
                {section.title}
                <span className="absolute -bottom-2 left-0 w-12 h-0.5 bg-amber-700" />
              </h4>
              <ul className="space-y-3 text-sm">
                {section.links.map((link, linkIndex) => (
                  <motion.li
                    key={link.name}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{
                      duration: 0.3,
                      delay: sectionIndex * 0.1 + linkIndex * 0.05,
                    }}
                  >
                    <Link
                      to={link.path}
                      className="group text-amber-300/80 hover:text-amber-200 font-serif transition-all duration-200 inline-flex items-center"
                    >
                      <span className="w-0 h-px bg-amber-600 group-hover:w-3 transition-all duration-300 mr-0 group-hover:mr-2" />
                      {link.name}
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          ))}

          {/* Contact Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h4 className="font-serif font-bold text-amber-200 mb-6 text-lg relative inline-block">
              Contact
              <span className="absolute -bottom-2 left-0 w-12 h-0.5 bg-amber-700" />
            </h4>
            <ul className="space-y-4 text-sm font-serif">
              {contactInfo.map((item, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: 0.3 + index * 0.05 }}
                  className="flex items-start space-x-3 text-amber-300/80 group"
                >
                  <item.icon className="h-5 w-5 text-amber-600 group-hover:text-amber-500 transition-colors flex-shrink-0 mt-0.5" />
                  <span
                    className={
                      item.type === "hours"
                        ? "italic"
                        : "group-hover:text-amber-200 transition-colors"
                    }
                  >
                    {item.text}
                  </span>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Decorative divider */}
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="my-10 h-px bg-gradient-to-r from-transparent via-amber-900/50 to-transparent origin-center"
        />

        {/* Bottom section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="text-center"
        >
          <p className="font-serif text-amber-400/60 text-sm">
            &copy; {new Date().getFullYear()}{" "}
            <span className="text-amber-300/80 font-semibold">
              {import.meta.env.REACT_APP_SITE_NAME || "Community Rental"}
            </span>
            . All rights reserved.
          </p>
          <p className="font-serif text-amber-500/40 text-xs mt-2 italic">
            Built with care for the community
          </p>
        </motion.div>
      </div>

      {/* Decorative bottom corner elements */}
      <div className="absolute bottom-0 left-0 w-32 h-32 border-l-2 border-b-2 border-amber-900/20" />
      <div className="absolute bottom-0 right-0 w-32 h-32 border-r-2 border-b-2 border-amber-900/20" />
    </footer>
  );
};

export default Footer;
