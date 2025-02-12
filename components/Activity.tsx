"use client";

import { useState, useEffect } from "react";
import { SquareCheck, Trash } from "lucide-react";
import ActivityCalendar, {
  Activity,
  ThemeInput,
} from "react-activity-calendar";
import { Task } from "./DashboardPage";

export const Activityy: React.FC<Task> = ({ id, name, gettasks}) => {
  interface Completed {
    completedOn: string;
  }
  const [completed, setCompleted] = useState<Completed[]>([]);
  const [todayCom, setTodayCom] = useState(false);
  const [loading, setLoading] = useState(false);
  const [delLoading, setDelLoading] = useState(false);
  const today = new Date().toJSON().split("T")[0];
  const getCompletes = async () => {
    try {
      const response = await fetch(`/api/task/complete?taskId=${id}`, {
        method: "GET",
      });
      const data = await response.json();
      data.completedTasks.map((comp: Completed) => {
        if (comp.completedOn.split("T")[0] === today) {
          setTodayCom(true);
        }
      });
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
    dark: ["#383838", "#857ab4", "#7DB9B6", "#F5E9CF", "#8e51ff"],
  };

  const handleComplete = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/task/complete", {
        method: "POST",
        body: JSON.stringify({
          taskId: id,
          completedOn: today,
        }),
      });
      setLoading(false);
      setTodayCom(!todayCom);
      getCompletes();
    } catch (e) {
      console.log(e);
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setDelLoading(true)
    try {
      const response = await fetch("/api/task", {
        method: "DELETE",
        body: JSON.stringify({
          taskId: id,
        }),
      });
      gettasks()
      setDelLoading(false)
    } catch (e) {
      console.log(e);
      setDelLoading(false)
    }
  };

  return (
    <div className="dark:text-white ">
      <div className="border-2 dark:border-gray-400  border-black rounded-xl p-4">
        <div className="flex justify-between mb-2">
          <div
            className={`ml-4 ${todayCom ? "line-through text-violet-400" : ""}`}
          >
            {name}
          </div>
          <div className="flex gap-4">
            <div onClick={handleDelete}>
              <Trash size={30} className={`${delLoading?'opacity-50':''}`} />
            </div>
            <div onClick={handleComplete}>
              <SquareCheck
                size={30}
                className={`${todayCom ? "text-violet-400" : ""} ${loading ? "opacity-50" : ""}`}
              />
            </div>
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
