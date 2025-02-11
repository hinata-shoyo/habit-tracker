"use client";
import Appbar from "@/components/Appbar";
import ActivityCalendar, {
  Activity,
  ThemeInput,
} from "react-activity-calendar";
import React, { useEffect, useState } from "react";
import { SquareCheck } from "lucide-react";
interface Task {
  id: string;
  name: string;
  userId?: string;
  createdAt: Date;
}
import { CirclePlus } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function Dashboard(): React.ReactNode {
  const [tasks, setTasks] = useState<Task[]>([]);
  useEffect(() => {
    const getTasks = async () => {
      try {
        const res = await fetch("/api/task", {
          method: "GET",
        });
        const data = await res.json();
        setTasks(data?.tasks);
      } catch (e) {
        console.log(e);
      }
    };
    getTasks();
  }, []);
  return (
    <div className="dark:bg-gray-950 dark:text-white bg-stone-200 h-screen ">
      <Appbar />
      <div className="dark:text-white lg:gap-20 gap-10 text-3xl flex flex-col justify-center items-center w-full h-full">
        {tasks.map((task: Task) => {
          return (
            <div key={task.id}>
              <Activityy
                name={task.name}
                id={task.id}
                createdAt={task.createdAt}
              />
            </div>
          );
        })}
        <div className="fixed bottom-10 right-10">
          <AlertDialog>
            <AlertDialogTrigger>
              <CirclePlus size={50} strokeWidth={"1px"} />
            </AlertDialogTrigger>
            <AlertDialogContent className="dark:bg-zinc-900">
              <AlertDialogHeader>
                <AlertDialogTitle>Add New Task</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete
                  your account and remove your data from our servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction className="bg-violet-500 text-white hover:bg-violet-400">Continue</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </div>
  );
}

const Activityy: React.FC<Task> = ({ id, name, createdAt }) => {
  interface Completed {
    completedOn: string;
  }
  const [completed, setCompleted] = useState<Completed[]>([]);
  useEffect(() => {
    const getCompletes = async () => {
      try {
        const response = await fetch(`/api/task/complete?taskId=${id}`, {
          method: "GET",
        });
        const data = await response.json();
        setCompleted(data.completedTasks);
      } catch (e) {
        console.log(e);
      }
    };
    getCompletes();
  }, []);

  const subtractSixMonths = (dateStr: Date): string => {
    const date = new Date(dateStr.toString().split("T")[0]);
    date.setMonth(date.getMonth() - 2);

    // Format back to YYYY-MM-DD
    return date.toISOString().split("T")[0];
  };

  // Example Usage:

  const startDate = (completed: Completed[]): Activity[] => {
    const grouped = completed.map((curr) => {
      const date = curr.completedOn.split("T")[0];
      return { date: date, count: 1, level: 4 };
    });
    grouped.unshift({ date: subtractSixMonths(createdAt), count: 0, level: 0 });
    return grouped;
  };

  // const transformData = (): Activity[] => {
  //   const grouped = completed.reduce<
  //     Record<string, { date: string; count: number }>
  //   >((acc, task) => {
  //     const date = task.completedOn.split("T")[0]; // Extract YYYY-MM-DD
  //
  //     if (!acc[date]) {
  //       acc[date] = { date, count: 0 };
  //     }
  //
  //     acc[date].count += 1;
  //     return acc;
  //   }, {});
  //
  //   // Convert grouped object to array and set level
  //   return Object.values(grouped).map((entry) => ({
  //     ...entry,
  //     level: entry.count > 0 ? 4 : 1, // Level 4 if exists, 1 if not
  //   }));
  // };

  const data = [
    {
      date: "2025-06-23",
      count: 1,
      level: 1,
    },
    {
      date: "2025-08-02",
      count: 16,
      level: 4,
    },
    {
      date: "2025-11-29",
      count: 1,
      level: 1,
    },
  ];

  const explicitTheme: ThemeInput = {
    light: ["#383838", "#c4edde", "#7ac7c4", "#f73859", "#8e51ff"],
    dark: ["#383838", "#857ab4", "#7DB9B6", "#F5E9CF", "#8e51ff"],
  };

  return (
    <div className="dark:text-white ">
      {completed.length > 0 ? (
        <div className="border-2 dark:border-gray-400 border-black rounded-xl p-5">
          <div className="flex justify-between  mb-6">
            <div className="ml-6 ">{name}</div>
            <div>
              <SquareCheck size={30} />
            </div>
          </div>
          <div className="max-w-[80vw] overflow-x-scroll dark:border-gray-400 border-black border-t-2">
            <ActivityCalendar
              data={data}
              maxLevel={4}
              hideTotalCount={true}
              hideColorLegend={true}
              hideMonthLabels={true}
              theme={explicitTheme}
            />
          </div>
        </div>
      ) : (
        <div></div>
      )}
    </div>
  );
};
