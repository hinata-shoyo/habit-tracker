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
import { Input } from "@/components/ui/input";
import { useSession } from "next-auth/react";

export default function Dashboard(): React.ReactNode {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [name, setName] = useState("");
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
  useEffect(() => {
    getTasks();
  }, []);

  const {data:session} = useSession() 
  const handleCreate = async () => {
    if (name !== "") {
      try {
        const response = await fetch("/api/task", {
          method: "POST",
          body: JSON.stringify({ name: name, userId:session?.user?.id}),
        });
        const data = await response.json();
        console.log(data);
        setName("");
        getTasks();
      } catch (e) {
        console.log(e);
      }
    } else {
      console.log(":<");
    }
  };

  return (
    <div className="dark:bg-gray-950 dark:text-white bg-stone-200 ">
      <Appbar />
      <div className="dark:text-white gap-10 text-3xl grid lg:grid-cols-2 grid-cols-1 w-full h-full my-44 px-12 container mx-auto lg:px-72">
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
              <CirclePlus
                size={50}
                strokeWidth={"1px"}
                className="backdrop-blur-lg rounded-full"
              />
            </AlertDialogTrigger>
            <AlertDialogContent className="dark:bg-zinc-900 w-11/12">
              <AlertDialogHeader>
                <AlertDialogTitle>Add New Task</AlertDialogTitle>
                <AlertDialogDescription>
                  <Input
                    id="name"
                    placeholder="Drink piss"
                    className="placeholder:text-zinc-500 focus:border-none"
                    onChange={(e) => setName(e.target.value)}
                  />
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleCreate}
                  className="bg-violet-500 text-white hover:bg-violet-400"
                >
                  Add
                </AlertDialogAction>
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
  const today = new Date().toJSON().split("T")[0];
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
  useEffect(() => {
    getCompletes();
  }, []);

  const subtractSixMonths = (): string => {
    const date = new Date();
    date.setMonth(date.getMonth() - 11);
    // Format back to YYYY-MM-DD
    return date.toISOString().split("T")[0];
  };

  const startDate = (completed: Completed[]): Activity[] => {
    const grouped = completed.map((curr) => {
      const date = curr.completedOn.split("T")[0];
      return { date: date, count: 1, level: 4 };
    });
    grouped.unshift({ date: subtractSixMonths(), count: 0, level: 0 });
    const nextDate = new Date(today);
    nextDate.setDate(nextDate.getDate() + 4);
    grouped.push({
      date: nextDate.toISOString().split("T")[0],
      count: 0,
      level: 0,
    });
    return grouped;
  };

  const explicitTheme: ThemeInput = {
    light: ["#383838", "#c4edde", "#7ac7c4", "#f73859", "#8e51ff"],
    dark: ["#383838", "#857ab4", "#7DB9B6", "#F5E9CF", "#8e51ff"],
  };

  const handleComplete = async () => {
    try {
      const response = await fetch("/api/task/complete", {
        method: "POST",
        body: JSON.stringify({
          taskId: id,
          completedOn: today,
        }),
      });
      const data = await response.json();
      console.log(data);
      getCompletes();
    } catch (e) {}
  };
  return (
    <div className="dark:text-white ">
      <div className="border-2 dark:border-gray-400  border-black rounded-xl p-4">
        <div className="flex justify-between mb-2">
          <div className="ml-4">{name}</div>
          <div onClick={handleComplete}>
            <SquareCheck size={30} />
          </div>
        </div>
        <div
          className="ovrflow-x-scroll  mx-auto dark:border-gray-400 border-black border-t-2"
          style={{ direction: "rtl" }}
        >
          <ActivityCalendar
            data={startDate(completed)}
            maxLevel={4}
            hideTotalCount={true}
            hideColorLegend={true}
            hideMonthLabels={true}
            theme={explicitTheme}
          />
        </div>
      </div>
    </div>
  );
};
