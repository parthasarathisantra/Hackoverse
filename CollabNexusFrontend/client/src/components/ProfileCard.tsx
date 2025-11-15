import { Card } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import { LevelBadge } from "@/components/LevelBadge";
import { XPBar } from "@/components/XPBar";
import { motion } from "framer-motion";
import { Mail, User } from "lucide-react";

export function ProfileCard() {
  const { userData, currentUser } = useAuth();

  if (!userData) return null;

  const xpForNextLevel = userData.level * 100;
  const currentXP = userData.xp % xpForNextLevel;

  const skills = userData.skills || [];
  const bio = userData.bio || "No bio added yet.";

  // Avatar initials
  const initials = userData.username
    ? userData.username[0].toUpperCase()
    : "U";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card className="p-6 shadow-md hover:shadow-lg transition-all">
        {/* Profile Header */}
        <div className="flex flex-col md:flex-row items-center gap-6 mb-6">

          {/* Avatar */}
          <div className="w-24 h-24 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-4xl font-bold">
            {initials}
          </div>

          {/* Username + Bio */}
          <div className="flex-1">
            <h2 className="text-3xl font-bold">{userData.username}</h2>
            <p className="text-muted-foreground text-sm mt-1">{bio}</p>

            {/* Email */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground mt-3">
              <Mail className="w-4 h-4" />
              <span>{currentUser?.email || "Email not available"}</span>
            </div>

            {/* UID */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
              <User className="w-4 h-4" />
              <span>ID: {currentUser?.uid}</span>
            </div>
          </div>

          {/* Level Badge */}
          <div className="flex-shrink-0">
            <LevelBadge level={userData.level} size="lg" />
          </div>
        </div>

        {/* XP Progress */}
        <div className="mb-6">
          <p className="font-medium text-lg mb-1">Level Progress</p>
          <XPBar 
            currentXP={currentXP}
            maxXP={xpForNextLevel}
            level={userData.level}
          />
          <p className="text-xs text-muted-foreground mt-1">
            {xpForNextLevel - currentXP} XP to reach next level
          </p>
        </div>

        {/* Skills */}
        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-2">Skills</h3>

          {skills.length === 0 ? (
            <p className="text-muted-foreground text-sm">
              No skills added yet.
            </p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {skills.map((skill: any, index: number) => (
                <span
                  key={index}
                  className="px-4 py-1 bg-primary/10 text-primary border border-primary/20 rounded-full text-sm font-medium"
                >
                  {skill.name} • Level {skill.level}
                </span>
              ))}
            </div>
          )}
        </div>
      </Card>
    </motion.div>
  );
}
