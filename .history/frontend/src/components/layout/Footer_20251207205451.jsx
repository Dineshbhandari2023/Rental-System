// import React from "react";
// import { Link } from "react-router-dom";

// const Footer = () => {
//   return (
//     <footer className="bg-white border-t border-gray-200 mt-12">
//       <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
//           <div>
//             <h3 className="text-lg font-semibold text-gray-900 mb-4">
//               {import.meta.env.REACT_APP_SITE_NAME || "Community Rental"}
//             </h3>
//             <p className="text-gray-600 text-sm">
//               Connecting communities through sharing. Rent what you need, lend
//               what you don't use.
//             </p>
//           </div>

//           <div>
//             <h4 className="font-medium text-gray-900 mb-4">Quick Links</h4>
//             <ul className="space-y-2 text-sm">
//               <li>
//                 <Link
//                   to="/items"
//                   className="text-gray-600 hover:text-primary-600"
//                 >
//                   Browse Items
//                 </Link>
//               </li>
//               <li>
//                 <Link
//                   to="/how-it-works"
//                   className="text-gray-600 hover:text-primary-600"
//                 >
//                   How It Works
//                 </Link>
//               </li>
//               <li>
//                 <Link
//                   to="/safety"
//                   className="text-gray-600 hover:text-primary-600"
//                 >
//                   Safety Tips
//                 </Link>
//               </li>
//             </ul>
//           </div>

//           <div>
//             <h4 className="font-medium text-gray-900 mb-4">Legal</h4>
//             <ul className="space-y-2 text-sm">
//               <li>
//                 <Link
//                   to="/terms"
//                   className="text-gray-600 hover:text-primary-600"
//                 >
//                   Terms of Service
//                 </Link>
//               </li>
//               <li>
//                 <Link
//                   to="/privacy"
//                   className="text-gray-600 hover:text-primary-600"
//                 >
//                   Privacy Policy
//                 </Link>
//               </li>
//               <li>
//                 <Link
//                   to="/community"
//                   className="text-gray-600 hover:text-primary-600"
//                 >
//                   Community Guidelines
//                 </Link>
//               </li>
//             </ul>
//           </div>

//           <div>
//             <h4 className="font-medium text-gray-900 mb-4">Contact</h4>
//             <ul className="space-y-2 text-sm">
//               <li className="text-gray-600">support@communityrental.com</li>
//               <li className="text-gray-600">+1 (555) 123-4567</li>
//               <li className="text-gray-600">Mon-Fri, 9AM-6PM EST</li>
//             </ul>
//           </div>
//         </div>

//         <div className="border-t border-gray-200 mt-8 pt-6 text-center text-sm text-gray-500">
//           <p>
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

const Footer = () => {
  return (
    <footer className="bg-amber-50 border-t-4 border-amber-800 mt-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-serif font-bold text-amber-900 mb-4 border-b-2 border-amber-800 pb-2">
              {import.meta.env.REACT_APP_SITE_NAME || "Community Rental"}
            </h3>
            <p className="text-amber-800 text-sm leading-relaxed font-serif italic">
              Connecting communities through sharing. Rent what you need, lend
              what you don't use.
            </p>
          </div>

          <div>
            <h4 className="font-serif font-bold text-amber-900 mb-4 text-lg">
              Quick Links
            </h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  to="/items"
                  className="text-amber-800 hover:text-amber-950 underline decoration-dotted font-serif"
                >
                  Browse Items
                </Link>
              </li>
              <li>
                <Link
                  to="/how-it-works"
                  className="text-amber-800 hover:text-amber-950 underline decoration-dotted font-serif"
                >
                  How It Works
                </Link>
              </li>
              <li>
                <Link
                  to="/safety"
                  className="text-amber-800 hover:text-amber-950 underline decoration-dotted font-serif"
                >
                  Safety Tips
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-serif font-bold text-amber-900 mb-4 text-lg">
              Legal
            </h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  to="/terms"
                  className="text-amber-800 hover:text-amber-950 underline decoration-dotted font-serif"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  to="/privacy"
                  className="text-amber-800 hover:text-amber-950 underline decoration-dotted font-serif"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  to="/community"
                  className="text-amber-800 hover:text-amber-950 underline decoration-dotted font-serif"
                >
                  Community Guidelines
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-serif font-bold text-amber-900 mb-4 text-lg">
              Contact
            </h4>
            <ul className="space-y-3 text-sm font-serif">
              <li className="text-amber-800">support@communityrental.com</li>
              <li className="text-amber-800">+1 (555) 123-4567</li>
              <li className="text-amber-800 italic">Mon-Fri, 9AM-6PM EST</li>
            </ul>
          </div>
        </div>

        <div className="border-t-2 border-amber-800 mt-8 pt-6 text-center text-sm text-amber-900">
          <p className="font-serif">
            &copy; {new Date().getFullYear()}{" "}
            {import.meta.env.REACT_APP_SITE_NAME || "Community Rental"}. All
            rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
