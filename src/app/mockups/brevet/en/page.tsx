import type { Metadata } from "next";
import { mockupMetadata } from "../../shared";
import { Brevet, brevetPaths } from "../Brevet";
import { copy } from "../copy";

export const metadata: Metadata = {
  ...mockupMetadata("Brevet (English)"),
  alternates: { languages: { sv: brevetPaths.sv, en: brevetPaths.en } },
};

export default function BrevetEn() {
  return <Brevet copy={copy.en} />;
}
