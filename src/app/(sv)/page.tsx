import { copy } from "@content/home";
import { Brevet } from "@/components/brevet/Brevet";
import { brevetMetadata } from "@/components/brevet/meta";

export const metadata = brevetMetadata("sv");

export default function Home() {
  return <Brevet copy={copy.sv} />;
}
