import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, Search, Users, FileText, Moon, Sun, LogOut } from "lucide-react";

const Dashboard = () => {
  const navigate = useNavigate();
  const [isDark, setIsDark] = useState(false);

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle("dark");
  };

  const handleLogout = () => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user_id");
    navigate("/");
  };

  const features = [
    {
      title: "Upload Documents",
      description: "Upload and organize your files with tags and categories",
      icon: Upload,
      action: () => navigate("/upload"),
      gradient: "from-primary to-cyan-500",
    },
    {
      title: "Search Documents",
      description: "Find your documents quickly with advanced filters",
      icon: Search,
      action: () => navigate("/search"),
      gradient: "from-secondary to-orange-500",
    },
    {
      title: "Admin Panel",
      description: "Manage users and system settings",
      icon: Users,
      action: () => navigate("/admin"),
      gradient: "from-blue-500 to-indigo-500",
    },
  ];

  return (
    <div className="min-h-screen bg-mesh-gradient">
      <header className="border-b bg-card/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
              <FileText className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold">DocuVault</h1>
              <p className="text-xs text-muted-foreground">Document Management</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={toggleTheme}>
              {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
            <Button variant="ghost" size="icon" onClick={handleLogout}>
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 animate-slide-up">
            <h2 className="text-4xl font-bold mb-4">Welcome to Your Dashboard</h2>
            <p className="text-lg text-muted-foreground">
              Manage your documents with ease and efficiency
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {features.map((feature, index) => (
              <Card
                key={feature.title}
                className="group hover:shadow-xl transition-all duration-300 cursor-pointer border-2 hover:border-primary/50 animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
                onClick={feature.action}
              >
                <CardHeader>
                  <div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                  >
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full group-hover:bg-primary/90">
                    Get Started
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="bg-gradient-to-r from-primary to-cyan-600 text-primary-foreground border-none shadow-2xl">
            <CardHeader>
              <CardTitle className="text-2xl text-white">Quick Stats</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-4xl font-bold text-white">0</p>
                <p className="text-sm opacity-90">Total Documents</p>
              </div>
              <div className="text-center">
                <p className="text-4xl font-bold text-white">0</p>
                <p className="text-sm opacity-90">This Month</p>
              </div>
              <div className="text-center">
                <p className="text-4xl font-bold text-white">0</p>
                <p className="text-sm opacity-90">Categories</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
