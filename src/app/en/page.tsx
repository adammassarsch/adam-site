import { copy } from "@content/home";
import { Brevet } from "@/components/brevet/Brevet";
import { brevetMetadata } from "@/components/brevet/meta";

export const metadata = brevetMetadata("en");

export default function HomeEn() {
  return <Brevet copy={copy.en} />;
}
