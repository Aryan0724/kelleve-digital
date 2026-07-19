import { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  try {
    const { id } = await params;
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'}/requirements/${id}`);
    if (!res.ok) throw new Error('Failed to fetch');
    const json = await res.json();
    const req = json.data;
    return {
      title: `${req.title} | FindMyInterior Requirements`,
      description: req.description?.substring(0, 160) || "View this requirement on FindMyInterior",
    };
  } catch (e) {
    return {
      title: "Requirement Details | FindMyInterior",
      description: "View requirement details and place a bid on FindMyInterior.",
    };
  }
}

export default function RequirementLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
