import { createFileRoute } from "@tanstack/react-router";
import { DesignStudio } from "@/components/studio/DesignStudio";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  return <DesignStudio />;
}
