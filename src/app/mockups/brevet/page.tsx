import type { Metadata } from "next";
import { mockupMetadata } from "../shared";
import { Brevet, brevetPaths } from "./Brevet";
import { copy } from "./copy";

export const metadata: Metadata = {
  ...mockupMetadata("Brevet"),
  alternates: { languages: { sv: brevetPaths.sv, en: brevetPaths.en } },
};

export default function BrevetSv() {
  return <Brevet copy={copy.sv} />;
}
