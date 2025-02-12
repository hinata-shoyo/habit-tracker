import { getSession } from "@/lib/auth";
import { prisma as prismaClient } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const completeTaskSchema = z.object({
  taskId: z.string(),
  completedOn: z
    .string()
    .transform((val) => new Date(val))
    .optional(),
});

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session?.user.id) {
    return NextResponse.json({
      msg: "Unauthorized",
      status: 403,
    });
  }
  const data = completeTaskSchema.parse(await req.json());
  const completed = await prismaClient.completed.findFirst({
    where: {
      taskId: data.taskId,
      completedOn: data.completedOn,
    },
  });
  if (completed) {
    try {
      await prismaClient.completed.delete({
        where: {
          id: completed.id,
          // completedOn: data.completedOn,
        },
      });
      return NextResponse.json({
        msg: "uncompleted the task",
      });
    } catch (e) {
      console.log(e);
    }
  }
  if (!completed) {
    try {
      await prismaClient.completed.create({
        data: {
          taskId: data.taskId,
          completedOn: data.completedOn,
        },
      });
      return NextResponse.json({
        msg: "completed the task",
      });
    } catch (e) {
      console.log(e);
    }
  }
}

export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session?.user.id) {
    return NextResponse.json({
      msg: "Unauthorized",
      status: 403,
    });
  }
  const taskId = req.nextUrl.searchParams.get("taskId");
  const completedTasks = await prismaClient.completed.findMany({
    where: {
      taskId: taskId || "",
    },
  });

  return NextResponse.json({ completedTasks });
}
