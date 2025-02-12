"use client";

import Appbar from "@/components/Appbar";
import React, { useEffect, useState } from "react";
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
import { Activityy } from "@/components/Activity";

export interface Task {
  id: string;
  name: string;
  gettasks:()=>Promise<void>
}

export default function DashboardPage(): React.ReactNode {
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

  const { data: session } = useSession();
  const handleCreate = async () => {
    if (name !== "") {
      try {
        const response = await fetch("/api/task", {
          method: "POST",
          body: JSON.stringify({ name: name, userId: session?.user?.id }),
        });
        const data = await response.json();
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
              <Activityy name={task.name} id={task.id} gettasks={getTasks} />
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
