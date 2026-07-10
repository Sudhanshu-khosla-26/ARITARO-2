import connectDB from "@/lib/db";
import Service from "@/models/Service";
import { requireAdmin } from "@/lib/session";
import { initApp } from "@/lib/init";

// GET /api/services - fetch services (public: published only, admin: all)
export async function GET(request) {
  try {
    await initApp();

    const { searchParams } = new URL(request.url);
    const adminView = searchParams.get("admin") === "true";
    const { authorized } = await requireAdmin().catch(() => ({ authorized: false }));

    const filter = adminView && authorized ? {} : { isPublished: true };
    const services = await Service.find(filter).lean();

    if (adminView && authorized) {
      // Return raw DB docs for admin management
      return Response.json({
        services: services.map((s) => ({
          id: s._id.toString(),
          name: s.name,
          slug: s.slug,
          shortDescription: s.shortDescription,
          description: s.description,
          duration: s.duration,
          isPublished: s.isPublished,
          image: s.image,
          overview: s.overview,
          methodology: s.methodology ?? [],
          scope: s.scope ?? [],
          deliverables: s.deliverables ?? [],
          standards: s.standards ?? [],
          sampleFindings: s.sampleFindings ?? [],
          faqs: s.faqs ?? [],
          icon: s.icon,
          pdfUrl: s.pdfUrl,
          createdAt: s.createdAt?.toISOString() ?? null,
        })),
      });
    }

    // Public view — mapped for frontend cards
    const mapped = services.map((s) => {
      let color = "#818CF8";
      let category = "Cybersecurity";
      const slug = s.slug || "";
      if (slug.includes("ai") || slug.includes("automation") || slug.includes("bot")) {
        color = "#6366F1"; category = "AI & Automation";
      } else if (slug.includes("dev") || slug.includes("web") || slug.includes("app") || slug.includes("api")) {
        color = "#22D3EE"; category = "Development";
      } else if (slug.includes("security") || slug.includes("test") || slug.includes("audit") || slug.includes("threat") || slug.includes("vapt")) {
        color = "#A855F7"; category = "Cybersecurity";
      }
      const features = s.scope?.length ? s.scope.slice(0, 4) : (s.methodology?.length ? s.methodology.slice(0, 4) : ["Premium Service"]);
      return {
        _id: s._id.toString(),
        number: slug,
        title: s.name,
        desc: s.description,
        features,
        color,
        category,
        slug,
      };
    });

    const categoriesSet = new Set(["All"]);
    mapped.forEach((s) => categoriesSet.add(s.category));
    return Response.json({ services: mapped, categories: Array.from(categoriesSet) });
  } catch (error) {
    console.error("Error fetching services:", error);
    return Response.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

// POST /api/services - create a new service (admin only)
export async function POST(request) {
  try {
    const { authorized } = await requireAdmin();
    if (!authorized) {
      return Response.json({ message: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const body = await request.json();
    const { name, slug, description, shortDescription, duration, icon, overview, methodology, scope, deliverables, standards, sampleFindings, faqs, isPublished, image, pdfUrl } = body;

    if (!name || !slug || !description || !shortDescription || !overview) {
      return Response.json({ message: "name, slug, description, shortDescription, and overview are required" }, { status: 400 });
    }

    const existing = await Service.findOne({ slug });
    if (existing) {
      return Response.json({ message: "A service with this slug already exists" }, { status: 409 });
    }

    const service = await Service.create({
      name, slug, description, shortDescription,
      duration: duration || "2-4 weeks",
      icon: icon || "shield",
      overview,
      methodology: methodology ?? [],
      scope: scope ?? [],
      deliverables: deliverables ?? [],
      standards: standards ?? [],
      sampleFindings: sampleFindings ?? [],
      faqs: faqs ?? [],
      isPublished: isPublished ?? false,
      image: image || "",
      pdfUrl: pdfUrl || "",
    });

    return Response.json({ message: "Service created", service: { id: service._id.toString(), slug: service.slug } }, { status: 201 });
  } catch (error) {
    console.error("POST /api/services error:", error);
    return Response.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

