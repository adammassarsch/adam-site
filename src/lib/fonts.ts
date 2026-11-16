import { Familjen_Grotesk } from "next/font/google";

/** The site's typeface. Loaded by the (site) layout and the 404, not by the home page. */
export const grotesk = Familjen_Grotesk({
  subsets: ["latin", "latin-ext"],
  variable: "--font-grotesk",
});
