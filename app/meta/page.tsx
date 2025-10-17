// app/meta/page.tsx
import { prisma } from "@/lib/prisma";
import MetaTabs from "./components/MetaTabs";

export const dynamic = 'force-dynamic';

export default async function MetaPage() {
  // Get all analytics data
  const [projects, totalEvents, recentEvents, invoices, expenses] = await Promise.all([
    prisma.project.findMany({
      include: { 
        ProjectStatus: true,
        _count: {
          select: {
            IntegrationEvent: true,
            Invoice: true,
            Expense: true
          }
        }
      }
    }),
    prisma.integrationEvent.count(),
    prisma.integrationEvent.findMany({
      take: 20,
      orderBy: { occurredAt: "desc" },
      include: { Project: true }
    }),
    prisma.invoice.findMany({
      include: { Project: true },
      orderBy: { issuedAt: "desc" }
    }),
    prisma.expense.findMany({
      include: { Project: true },
      orderBy: { incurredAt: "desc" }
    })
  ]);

  // Calculate analytics
  const totalProjects = projects.length;
  const activeProjects = projects.filter(p => p.ProjectStatus?.lastCommitAt).length;
  const totalRevenue = invoices
    .filter(inv => inv.status === "paid")
    .reduce((sum, inv) => sum + inv.amountCents, 0);
  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amountCents, 0);
  const netProfit = totalRevenue - totalExpenses;
  
  // Overdue invoices
  const overdueInvoices = invoices.filter(inv => 
    inv.status === "sent" && 
    inv.issuedAt && 
    new Date(inv.issuedAt).getTime() < Date.now() - (30 * 24 * 60 * 60 * 1000) // 30 days
  );

  // Project health
  const projectsWithIssues = projects.filter(p => {
    const daysSinceCommit = p.ProjectStatus?.lastCommitAt ? 
      (Date.now() - new Date(p.ProjectStatus.lastCommitAt).getTime()) / (1000 * 60 * 60 * 24) : 
      999;
    return daysSinceCommit > 7; // No commits in 7 days
  });

  const analytics = {
    overview: {
      totalProjects,
      activeProjects,
      totalEvents,
      totalRevenue: totalRevenue / 100, // Convert cents to dollars
      totalExpenses: totalExpenses / 100,
      netProfit: netProfit / 100
    },
    health: {
      projectsWithIssues: projectsWithIssues.length,
      overdueInvoices: overdueInvoices.length,
      deploymentFailures: recentEvents.filter(e => e.type === "deployment_failed").length
    },
    recent: recentEvents
  };

  return (
    <MetaTabs 
      analytics={analytics}
      projects={projects}
      invoices={invoices}
      expenses={expenses}
    />
  );
}