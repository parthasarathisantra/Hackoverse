import { useState } from "react";
import { Card } from "@/components/ui/card";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { TeammateSuggestionCard } from "@/components/TeammateSuggestionCard";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { Search, Plus, X, Users } from "lucide-react";

// -----------------------------
// TeammateMatch Type (local)
// -----------------------------
type TeammateMatch = {
  user: {
    id: string;
    username: string;
    email: string;
    skills: string[];
    interests: string[];
    xp: number;
    level: number;
  };
  matchPercentage: number;
  matchingSkills: string[];
};

export default function SkillMatchmaking() {
  const { toast } = useToast();

  const [skillInput, setSkillInput] = useState("");
  const [skills, setSkills] = useState<string[]>([]);

  const [interestInput, setInterestInput] = useState("");
  const [interests, setInterests] = useState<string[]>([]);

  const [projectIdea, setProjectIdea] = useState("");
  const [matches, setMatches] = useState<TeammateMatch[]>([]);
  const [searching, setSearching] = useState(false);

  // Add skill
  const addSkill = () => {
    if (skillInput.trim() && !skills.includes(skillInput.trim())) {
      setSkills([...skills, skillInput.trim()]);
    }
    setSkillInput("");
  };

  // Remove skill
  const removeSkill = (skill: string) => {
    setSkills(skills.filter((s) => s !== skill));
  };

  // Add interest
  const addInterest = () => {
    if (interestInput.trim() && !interests.includes(interestInput.trim())) {
      setInterests([...interests, interestInput.trim()]);
    }
    setInterestInput("");
  };

  // Remove interest
  const removeInterest = (interest: string) => {
    setInterests(interests.filter((i) => i !== interest));
  };

  // Matchmaking (mock version)
  const handleFindTeammates = async () => {
    if (skills.length === 0) {
      toast({
        title: "Missing skills",
        description: "Add at least one skill to find teammates.",
        variant: "destructive",
      });
      return;
    }

    setSearching(true);

    // Simulate backend processing
    setTimeout(() => {
      const mockResults: TeammateMatch[] = [
        {
          user: {
            id: "user1",
            username: "Sarah Chen",
            email: "sarah@example.com",
            skills: ["React", "TypeScript", "Node.js"],
            interests: ["Frontend", "AI"],
            xp: 450,
            level: 5,
          },
          matchPercentage: 92,
          matchingSkills: skills.slice(0, 2),
        },
        {
          user: {
            id: "user2",
            username: "Alex Kumar",
            email: "alex@example.com",
            skills: ["Python", "Machine Learning"],
            interests: ["AI", "Research"],
            xp: 730,
            level: 7,
          },
          matchPercentage: 85,
          matchingSkills: skills.slice(0, 1),
        },
        {
          user: {
            id: "user3",
            username: "Jordan Lee",
            email: "jordan@example.com",
            skills: ["UI/UX", "Figma", "React"],
            interests: ["Design", "Product"],
            xp: 320,
            level: 4,
          },
          matchPercentage: 78,
          matchingSkills: skills.slice(0, 1),
        },
      ];

      setMatches(mockResults);
      setSearching(false);

      toast({
        title: "Teammates found!",
        description: `We found ${mockResults.length} collaborators`,
      });
    }, 1500);
  };

  // Connect button
  const handleConnect = (userId: string) => {
    toast({
      title: "Request sent!",
      description: "They will be notified about your interest.",
    });
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen pt-24 px-4 pb-12">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="w-16 h-16 bg-gradient-to-br from-chart-1 to-chart-3 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold mb-2">Find Your Perfect Team</h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Connect with collaborators who match your skills and project vision
            </p>
          </motion.div>

          {/* Input Form */}
          <Card className="p-8 mb-12">
            <div className="space-y-6">
              {/* Skills */}
              <div className="space-y-3">
                <Label>Required Skills</Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="e.g., React, Python, UI Design"
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyPress={(e) =>
                      e.key === "Enter" && (e.preventDefault(), addSkill())
                    }
                  />
                  <Button type="button" onClick={addSkill}>
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>

                {/* Skill badges */}
                {skills.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {skills.map((skill, i) => (
                      <Badge key={i} variant="secondary" className="gap-1">
                        {skill}
                        <button onClick={() => removeSkill(skill)}>
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              {/* Interests */}
              <div className="space-y-3">
                <Label>Expected Interests</Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="e.g., AI, Web Development"
                    value={interestInput}
                    onChange={(e) => setInterestInput(e.target.value)}
                    onKeyPress={(e) =>
                      e.key === "Enter" && (e.preventDefault(), addInterest())
                    }
                  />
                  <Button type="button" onClick={addInterest}>
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>

                {interests.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {interests.map((interest, i) => (
                      <Badge key={i} variant="secondary" className="gap-1">
                        {interest}
                        <button onClick={() => removeInterest(interest)}>
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              {/* Project Idea */}
              <div className="space-y-3">
                <Label htmlFor="projectIdea">Project Idea (Optional)</Label>
                <Textarea
                  id="projectIdea"
                  placeholder="Describe what you'd like to build..."
                  value={projectIdea}
                  onChange={(e) => setProjectIdea(e.target.value)}
                  rows={4}
                />
              </div>

              {/* Search Button */}
              <Button
                className="w-full"
                size="lg"
                onClick={handleFindTeammates}
                disabled={searching}
              >
                <Search className="w-4 h-4 mr-2" />
                {searching ? "Searching..." : "Find Teammates"}
              </Button>
            </div>
          </Card>

          {/* Results */}
          {matches.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold mb-6">
                Recommended Teammates ({matches.length})
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {matches.map((match, index) => (
                  <TeammateSuggestionCard
                    key={match.user.id}
                    match={match}
                    index={index}
                    onConnect={handleConnect}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
