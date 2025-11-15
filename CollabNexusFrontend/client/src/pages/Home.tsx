import { FeatureCard } from "@/components/FeatureCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/context/AuthContext";
import { motion } from "framer-motion";
import { 
  Users, 
  FolderKanban, 
  TrendingUp, 
  MessageSquare,
  ArrowRight,
  Sparkles
} from "lucide-react";

export default function Home() {
  const { currentUser } = useAuth();

  const features = [
    {
      title: "Skill Matchmaking",
      description: "Connect with the perfect teammates based on your skills, interests, and project ideas. Our intelligent matching system finds collaborators who complement your strengths.",
      icon: Users,
      href: currentUser ? "/matchmaking" : "/signup",
      gradient: "bg-gradient-to-br from-chart-1 to-chart-3",
    },
    {
      title: "Project Hub",
      description: "Create and manage projects with an intuitive Kanban board. Assign tasks, track progress, and collaborate seamlessly with your team in real-time.",
      icon: FolderKanban,
      href: currentUser ? "/projects" : "/signup",
      gradient: "bg-gradient-to-br from-chart-2 to-chart-4",
    },
    {
      title: "Progress Dashboard",
      description: "Track your team's performance with beautiful charts and analytics. Earn XP, level up, and celebrate milestones as you complete tasks together.",
      icon: TrendingUp,
      href: currentUser ? "/dashboard" : "/signup",
      gradient: "bg-gradient-to-br from-chart-3 to-chart-5",
    },
    {
      title: "Peer Review",
      description: "Give and receive constructive feedback from your teammates. Rate collaborations, share insights, and grow together as a team.",
      icon: MessageSquare,
      href: currentUser ? "/dashboard" : "/signup",
      gradient: "bg-gradient-to-br from-chart-4 to-chart-1",
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[70vh] flex items-center justify-center px-4 py-20 overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-chart-3/5 -z-10" />
        
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Badge className="mb-4" variant="secondary">
              <Sparkles className="w-3 h-3 mr-1" />
              Gamified Collaboration Platform
            </Badge>
            
            <h1 className="text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              Build Amazing Projects
              <br />
              <span className="bg-gradient-to-r from-primary to-chart-3 bg-clip-text text-transparent">
                Together
              </span>
            </h1>
            
            <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto mb-8">
              Connect with talented teammates, manage projects with ease, and level up your collaboration skills with CollabNexus.
            </p>

            <div className="flex items-center justify-center gap-4 flex-wrap">
              <a href={currentUser ? "/dashboard" : "/signup"}>
                <Button size="lg" data-testid="button-get-started">
                  Get Started
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </a>
              <a href="#features">
                <Button size="lg" variant="outline" data-testid="button-learn-more">
                  Learn More
                </Button>
              </a>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="flex items-center justify-center gap-8 flex-wrap pt-8"
          >
            <div className="text-center">
              <p className="text-3xl font-bold">500+</p>
              <p className="text-sm text-muted-foreground">Active Teams</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold">10K+</p>
              <p className="text-sm text-muted-foreground">Projects Created</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold">50K+</p>
              <p className="text-sm text-muted-foreground">Tasks Completed</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold tracking-tight mb-4">
              Everything You Need to Collaborate
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Powerful features designed to help teams work together seamlessly
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <FeatureCard key={index} {...feature} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold tracking-tight mb-4">
              How It Works
            </h2>
            <p className="text-xl text-muted-foreground">
              Get started in three simple steps
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "1",
                title: "Create Your Profile",
                description: "Sign up and add your skills, interests, and what you're passionate about building.",
              },
              {
                step: "2",
                title: "Find Your Team",
                description: "Use our matchmaking system to discover teammates who share your vision and complement your skills.",
              },
              {
                step: "3",
                title: "Build & Level Up",
                description: "Manage projects, complete tasks, earn XP, and achieve milestones together as a team.",
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                className="text-center"
              >
                <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-3xl font-bold mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      {!currentUser && (
        <section className="py-20 px-4 bg-gradient-to-br from-primary to-chart-3">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto text-center space-y-6"
          >
            <h2 className="text-4xl lg:text-5xl font-bold tracking-tight text-primary-foreground">
              Ready to Start Collaborating?
            </h2>
            <p className="text-xl text-primary-foreground/90">
              Join thousands of teams already building amazing projects together
            </p>
            <a href="/signup">
              <Button size="lg" variant="secondary" data-testid="button-cta-signup">
                Get Started Free
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </a>
          </motion.div>
        </section>
      )}
    </div>
  );
}
