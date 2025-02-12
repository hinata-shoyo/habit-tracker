import { NextRequest, NextResponse } from "next/server";
import { prismaClient } from "@/lib/db";
import { z } from "zod";
import { getSession, Sessionn } from "@/lib/auth";

const createTaskSchema = z.object({
  name: z.string(),
  userId: z.string(),
});

export async function POST(req: NextRequest) {
  try {
    console.log("h")
    const data = createTaskSchema.parse(await req.json());
    const task = await prismaClient.task.create({
      data: {
        name: data.name,
        userId: data.userId,
      },
    });
    return NextResponse.json({ msg: "success", task });
  } catch (e) {
    console.log(e);
    return NextResponse.json({ msg: "no hi" });
  }
}

export async function GET() {
  const session = await getSession() as Sessionn;
  const tasks = await prismaClient.task.findMany({
    where: {
      userId: session?.user?.id,
    },
  });
  return NextResponse.json({ tasks });
}
