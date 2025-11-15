import { useState } from "react";
import { ProfileCard } from "@/components/ProfileCard";

import { useAuth } from "@/context/AuthContext";
import { Card } from "@/components/ui/card";
import { XPBar } from "@/components/XPBar";
import { LevelBadge } from "@/components/LevelBadge";
import { MilestoneCard } from "@/components/MilestoneCard";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Trophy, Target, Zap, Users } from "lucide-react";

export default function Dashboard() {
  const { userData } = useAuth();
  const [levelUpAnimation, setLevelUpAnimation] = useState(false);

  if (!userData) {
    return null;
  }

  // XP logic
  const xpForNextLevel = userData.level * 100;
  const currentLevelXP = userData.xp % xpForNextLevel;

  // Mock data (replace later)
  const contributionData = [
    { name: userData.username, tasks: 12, xp: 150 },
    { name: "Teammate 1", tasks: 8, xp: 100 },
    { name: "Teammate 2", tasks: 15, xp: 180 },
  ];

  const taskCompletionData = [
    { name: "Completed", value: 25, color: "hsl(var(--chart-2))" },
    { name: "In Progress", value: 10, color: "hsl(var(--chart-4))" },
    { name: "Not Started", value: 5, color: "hsl(var(--muted))" },
  ];

  const stats = [
    {
      label: "Total XP",
      value: userData.xp,
      icon: Zap,
      gradient: "from-chart-1 to-chart-3",
    },
    {
      label: "Tasks Completed",
      value: 25,
      icon: Target,
      gradient: "from-chart-2 to-chart-4",
    },
    {
      label: "Active Projects",
      value: 3,
      icon: Users,
      gradient: "from-chart-3 to-chart-5",
    },
  ];

  const mockMilestones = [
    {
      id: "1",
      projectId: "proj1",
      title: "First Project Created",
      description: "Successfully created your first project",
      xpReward: 50,
      isCompleted: true,
      createdAt: new Date(),
      completedAt: new Date(),
    },
    {
      id: "2",
      projectId: "proj1",
      title: "Team Player",
      description: "Collaborate with 5 teammates",
      xpReward: 100,
      isCompleted: false,
      createdAt: new Date(),
      completedAt: null,
    },
  ];

  return (
    <ProtectedRoute>
      <div className="min-h-screen pt-24 px-4 pb-12">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center lg:text-left"
          >
            <h1 className="text-4xl font-bold tracking-tight mb-2">
              Welcome back, {userData.username}!
            </h1>
            <p className="text-muted-foreground text-lg">
              Track your progress and celebrate achievements
            </p>
          </motion.div>

          {/* 👤 Profile Section (NEWLY ADDED) */}
          <div className="mt-6">
            <ProfileCard />
          </div>

          {/* XP & Level */}
          <Card className="p-8">
            <div className="flex flex-col lg:flex-row items-center gap-8">
              <div className="flex-shrink-0">
                <LevelBadge level={userData.level} size="lg" animate={levelUpAnimation} />
              </div>
              <div className="flex-1 w-full space-y-4">
                <div>
                  <h2 className="text-2xl font-bold mb-1">Level {userData.level}</h2>
                  <p className="text-muted-foreground">
                    {xpForNextLevel - currentLevelXP} XP until next level
                  </p>
                </div>
                <XPBar
                  currentXP={currentLevelXP}
                  maxXP={xpForNextLevel}
                  level={userData.level}
                  showLabel={false}
                />
              </div>
            </div>
          </Card>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-6 hover-elevate">
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-12 h-12 rounded-lg bg-gradient-to-br ${stat.gradient} flex items-center justify-center`}
                    >
                      <stat.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">{stat.label}</p>
                      <p className="text-2xl font-bold">
                        {stat.value}
                      </p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Contribution Chart */}
            <Card className="p-6">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Trophy className="w-5 h-5" />
                Team Contributions
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={contributionData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="name" className="text-xs" />
                  <YAxis className="text-xs" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "6px",
                    }}
                  />
                  <Bar dataKey="tasks" fill="hsl(var(--chart-1))" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Card>

            {/* Task Completion Pie */}
            <Card className="p-6">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Target className="w-5 h-5" />
                Task Completion
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={taskCompletionData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {taskCompletionData.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "6px",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>

              <div className="flex justify-center gap-6 mt-4">
                {taskCompletionData.map((item) => (
                  <div key={item.name} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-sm text-muted-foreground">
                      {item.name}: {item.value}
                    </span>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Milestones */}
          <div>
            <h2 className="text-2xl font-bold mb-6">Milestones</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {mockMilestones.map((milestone, index) => (
                <MilestoneCard key={milestone.id} milestone={milestone} index={index} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
