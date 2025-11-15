import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { XPBar } from "@/components/XPBar";
import { LevelBadge } from "@/components/LevelBadge";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import axios from "axios";

export default function Profile() {
  const { currentUser, userData, refreshUserData } = useAuth();  // <-- IMPORTANT
  const { toast } = useToast();

  const [bio, setBio] = useState("");
  const [skills, setSkills] = useState<any[]>([]);
  const [newSkill, setNewSkill] = useState("");
  const [level, setLevel] = useState(1);
  const [xp, setXP] = useState(0);

  // Load user data when page opens
  useEffect(() => {
    if (userData) {
      setBio(userData.bio || "");
      setSkills(userData.skills || []);
      setLevel(userData.level || 1);
      setXP(userData.xp || 0);
    }
  }, [userData]);

  const xpForNextLevel = level * 100;
  const currentXP = xp % xpForNextLevel;

  // Add skill
  const handleAddSkill = () => {
    if (!newSkill.trim()) return;

    const updated = [...skills, { name: newSkill, level: 1 }];
    setSkills(updated);
    setNewSkill("");
  };

  // Remove a skill
  const removeSkill = (index: number) => {
    const updated = [...skills];
    updated.splice(index, 1);
    setSkills(updated);
  };

  // ===========================
  // SAVE PROFILE TO BACKEND
  // ===========================
  const saveProfile = async () => {
    try {
      await axios.put(`http://127.0.0.1:5000/users/${currentUser.uid}`, {
        bio,
        skills,
      });

      // Refresh global user data from backend
      await refreshUserData();

      toast({
        title: "Profile Updated",
        description: "Your profile changes have been saved.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Could not update profile.",
        variant: "destructive",
      });
    }
  };

  if (!currentUser || !userData) return null;

  return (
    <div className="min-h-screen pt-24 px-6 pb-12">
      <div className="max-w-4xl mx-auto space-y-8">

        <motion.h1
          className="text-3xl font-bold"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Your Profile
        </motion.h1>

        <Card className="p-6 shadow-md space-y-6">

          {/* Name & Level */}
          <div className="flex items-center gap-4">
            <LevelBadge level={level} size="lg" />
            <div>
              <h2 className="text-2xl font-semibold">{userData.username}</h2>
              <p className="text-sm text-muted-foreground">
                {currentUser.email}
              </p>
            </div>
          </div>

          {/* XP Bar */}
          <div>
            <p className="font-medium">XP Progress</p>
            <XPBar currentXP={currentXP} maxXP={xpForNextLevel} level={level} />
            <p className="text-xs text-muted-foreground mt-1">
              {xpForNextLevel - currentXP} XP until next level
            </p>
          </div>

          {/* Bio */}
          <div>
            <label className="block mb-1 text-sm font-medium">Bio</label>
            <Textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Write something about yourself..."
            />
          </div>

          {/* Skills */}
          <div>
            <label className="block mb-2 text-sm font-medium">Skills</label>

            <div className="flex gap-2 mb-3">
              <Input
                placeholder="Add a skill (e.g., React)"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
              />
              <Button onClick={handleAddSkill}>Add</Button>
            </div>

            {skills.length === 0 ? (
              <p className="text-sm text-muted-foreground">No skills added yet.</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm flex items-center gap-2"
                  >
                    {skill.name} — Lvl {skill.level}
                    <button
                      className="text-red-500 ml-2 text-xs"
                      onClick={() => removeSkill(index)}
                    >
                      ✕
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Save Button */}
          <Button className="w-full mt-4" onClick={saveProfile}>
            Save Changes
          </Button>

        </Card>
      </div>
    </div>
  );
}
