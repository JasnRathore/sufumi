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
  const title = tool ? tool.title : "Tool";
  const description = tool?.description ?? "Sufumi tool details, features, and install options.";
  const url = `/tools/${tool?.slug ?? normalizedSlug}`;

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

export default function ToolLayout({ children }: LayoutProps) {
  return children;
}
