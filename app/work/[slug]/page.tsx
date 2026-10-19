import type { Metadata } from "next";
import { notFound } from "next/navigation";
import SiteShell from "@/components/SiteShell";
import CaseView from "@/components/CaseView";
import { projects, getProject } from "@/lib/projects";
import { site } from "@/lib/site";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const project = getProject(params.slug);
  if (!project) return {};
  return {
    title: project.title,
    description: project.summary,
    alternates: { canonical: `/work/${project.slug}` },
    openGraph: {
      title: project.title,
      description: project.summary,
      // absolute: a root-relative path would drop the Pages sub-path
      images: [{ url: `${site.url}${project.cover}`, alt: project.title }],
    },
  };
}

export default function CaseStudy({ params }: { params: { slug: string } }) {
  const project = getProject(params.slug);
  if (!project) notFound();

  // Per-case structured data. Without it a search engine or an AI assistant
  // sees these pages as untyped documents; CreativeWork ties each project back
  // to the same Person entity the home page declares, and the breadcrumb makes
  // the site hierarchy explicit.
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CreativeWork",
        "@id": `${site.url}/work/${project.slug}#work`,
        name: project.title,
        headline: project.tagline,
        description: project.summary,
        url: `${site.url}/work/${project.slug}`,
        image: `${site.url}${project.cover}`,
        dateCreated: project.year,
        inLanguage: "en",
        genre: project.sector,
        keywords: project.tags.join(", "),
        creator: { "@id": `${site.url}/#person` },
        author: { "@id": `${site.url}/#person` },
        about: project.client,
        isPartOf: { "@id": `${site.url}/#website` },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Work", item: site.url },
          {
            "@type": "ListItem",
            position: 2,
            name: project.title,
            item: `${site.url}/work/${project.slug}`,
          },
        ],
      },
    ],
  };

  return (
    <SiteShell>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <CaseView project={project} />
    </SiteShell>
  );
}
