import type { Metadata } from "next";
import { getTool, normalizeSlug } from "@/lib/tools";

type LayoutProps = {
  params: Promise<{ slug: string }>;
  children: React.ReactNode;
};

type MetadataProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: MetadataProps): Promise<Metadata> {
  const { slug } = await params;
  const normalizedSlug = normalizeSlug(slug);
  const tool = getTool(normalizedSlug);
  const title = tool ? `${tool.title} Docs` : "Tool Docs";
  const description = tool
    ? `Documentation for ${tool.title}: installation, usage, configuration, and examples.`
    : "Sufumi tool documentation, installation steps, and usage examples.";
  const url = `/tools/${tool?.slug ?? normalizedSlug}/docs`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      url,
      title,
      description,
      siteName: "Sufumi",
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
  };
}

export default function ToolDocsLayout({ children }: LayoutProps) {
  return children;
}
