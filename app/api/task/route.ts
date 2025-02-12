import { NextRequest, NextResponse } from "next/server";
import { prisma as prismaClient } from "@/lib/db";
import { z } from "zod";
import { getSession } from "@/lib/auth";

const createTaskSchema = z.object({
  name: z.string(),
  userId: z.string(),
});

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session?.user.id) {
    return NextResponse.json({
      msg: "Unauthorized",
      status: 403,
    });
  }
  try {
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
  const session = await getSession();
  if (!session?.user.id) {
    return NextResponse.json({
      msg: "Unauthorized",
      status: 403,
    });
  }
  const tasks = await prismaClient.task.findMany({
    where: {
      userId: session?.user?.id,
    },
  });
  return NextResponse.json({ tasks });
}

export async function DELETE(req: NextRequest) {
  const session = await getSession();
  if (!session?.user.id) {
    return NextResponse.json({
      msg: "Unauthorized",
      status: 403,
    });
  }
  const data = await req.json();
  const res = await prismaClient.task.delete({
    where: {
      id: data.taskId,
    },
  });
  return NextResponse.json({ msg: "Deleted Successfully" });
}
