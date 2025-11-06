import { prisma } from "@/lib/prisma";

export default async function Page() {
  const projects = await prisma.project.findMany({
    include: { status: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <main>
      <h1 style={{ fontSize: 24, marginBottom: 8 }}>Projects</h1>
      <form action="/api/projects" method="post" style={{ marginBottom: 16 }}>
        <input name="name" placeholder="Name" required />
        <input
          name="slug"
          placeholder="slug"
          required
          style={{ marginLeft: 8 }}
        />
        <input
          name="liveUrl"
          placeholder="https://app.example.com"
          style={{ marginLeft: 8, width: 280 }}
        />
        <button type="submit" style={{ marginLeft: 8 }}>
          Add
        </button>
      </form>

      <div style={{ display: "grid", gap: 12 }}>
        {projects.map((p) => (
          <article
            key={p.id}
            style={{ border: "1px solid #ddd", borderRadius: 8, padding: 12 }}
          >
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div>
                <h2 style={{ margin: 0 }}>{p.name}</h2>
                <small>{p.slug}</small>
              </div>
              <div style={{ textAlign: "right" }}>
                <div>
                  Last commit:{" "}
                  {p.status?.lastCommitAt?.toISOString()?.slice(0, 19) ?? "—"}
                </div>
                <div>
                  Last deploy:{" "}
                  {p.status?.lastDeployAt?.toISOString()?.slice(0, 19) ?? "—"}
                </div>
                <div>Deploy state: {p.status?.lastDeployState ?? "—"}</div>
              </div>
            </div>
            {p.liveUrl && (
              <div style={{ marginTop: 8 }}>
                Live:{" "}
                <a href={p.liveUrl} target="_blank" rel="noreferrer">
                  {p.liveUrl}
                </a>
              </div>
            )}
          </article>
        ))}
      </div>
    </main>
  );
}
