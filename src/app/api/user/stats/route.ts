import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { PrismaClient } from "@/generated/prisma";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user-specific data
    const [clients, invoices, timeEntries] = await Promise.all([
      prisma.client.count({
        where: { userId: session.user.id }
      }),
      prisma.invoice.count({
        where: { userId: session.user.id }
      }),
      prisma.timeEntry.aggregate({
        where: { userId: session.user.id },
        _sum: { hours: true }
      })
    ]);

    const stats = {
      totalClients: clients,
      totalInvoices: invoices,
      totalHours: Number(timeEntries._sum.hours || 0)
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error("Error fetching user stats:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
