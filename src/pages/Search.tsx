import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { FileText, Search as SearchIcon, Download, Eye, CalendarIcon, ArrowLeft, Moon, Sun, LogOut, X, Archive } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface SearchResult {
  document_id: string;
  document_name: string;
  major_head: string;
  minor_head: string;
  document_date: string;
  document_remarks: string;
  tags: string[];
  file_path: string;
}

const Search = () => {
  const navigate = useNavigate();
  const [isDark, setIsDark] = useState(false);
  const [fromDate, setFromDate] = useState<Date>();
  const [toDate, setToDate] = useState<Date>();
  const [majorHead, setMajorHead] = useState("");
  const [minorHead, setMinorHead] = useState("");
  const [searchTags, setSearchTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [previewUrl, setPreviewUrl] = useState("");
  const [showPreview, setShowPreview] = useState(false);

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle("dark");
  };

  const handleLogout = () => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user_id");
    navigate("/");
  };

  const personalNames = ["John", "Tom", "Emily", "Sarah", "Michael", "Jessica"];
  const departments = ["Accounts", "HR", "IT", "Finance", "Marketing", "Sales"];

  const minorHeadOptions = majorHead === "Personal" ? personalNames : departments;

  const handleAddTag = () => {
    if (tagInput.trim() && !searchTags.includes(tagInput.trim())) {
      setSearchTags([...searchTags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setSearchTags(searchTags.filter((tag) => tag !== tagToRemove));
  };

  const handleSearch = async () => {
    setLoading(true);
    const searchData = {
      major_head: majorHead || undefined,
      minor_head: minorHead || undefined,
      from_date: fromDate ? format(fromDate, "dd-MM-yyyy") : undefined,
      to_date: toDate ? format(toDate, "dd-MM-yyyy") : undefined,
      tags: searchTags.length > 0 ? searchTags.map(tag => ({ tag_name: tag })) : undefined,
      user_id: localStorage.getItem("user_id") || "user",
    };

    try {
      const token = localStorage.getItem("auth_token");
      const response = await fetch("https://apis.allsoft.co/api/documentManagement/searchDocument", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          token: token || "",
        },
        body: JSON.stringify(searchData),
      });

      const data = await response.json();

      if (response.ok && data.documents) {
        setResults(data.documents);
        toast({
          title: "Search completed",
          description: `Found ${data.documents.length} document(s)`,
        });
      } else {
        setResults([]);
        toast({
          title: "No results",
          description: "No documents found matching your criteria",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to search documents. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePreview = (filePath: string) => {
    setPreviewUrl(filePath);
    setShowPreview(true);
  };

  const handleDownload = (filePath: string, fileName: string) => {
    const link = document.createElement("a");
    link.href = filePath;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadAll = () => {
    toast({
      title: "Download in progress",
      description: "Preparing ZIP file with all documents...",
    });
    // In a real implementation, this would call an API to create and download a ZIP
  };

  return (
    <div className="min-h-screen bg-mesh-gradient">
      <header className="border-b bg-card/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard")}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
              <FileText className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Search Documents</h1>
              <p className="text-xs text-muted-foreground">Find your files quickly</p>
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

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Search Filters */}
          <Card className="shadow-xl animate-slide-up">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-2">
                <SearchIcon className="w-6 h-6" />
                Search Filters
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                {/* Category */}
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select value={majorHead} onValueChange={(value) => {
                    setMajorHead(value);
                    setMinorHead("");
                  }}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent className="bg-popover z-50">
                      <SelectItem value="Personal">Personal</SelectItem>
                      <SelectItem value="Professional">Professional</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Sub-category */}
                {majorHead && (
                  <div className="space-y-2">
                    <Label>{majorHead === "Personal" ? "Name" : "Department"}</Label>
                    <Select value={minorHead} onValueChange={setMinorHead}>
                      <SelectTrigger>
                        <SelectValue placeholder={`Select ${majorHead === "Personal" ? "name" : "department"}`} />
                      </SelectTrigger>
                      <SelectContent className="bg-popover z-50">
                        {minorHeadOptions.map((option) => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {/* From Date */}
                <div className="space-y-2">
                  <Label>From Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !fromDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {fromDate ? format(fromDate, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 bg-popover z-50" align="start">
                      <Calendar mode="single" selected={fromDate} onSelect={setFromDate} initialFocus className="pointer-events-auto" />
                    </PopoverContent>
                  </Popover>
                </div>

                {/* To Date */}
                <div className="space-y-2">
                  <Label>To Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !toDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {toDate ? format(toDate, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 bg-popover z-50" align="start">
                      <Calendar mode="single" selected={toDate} onSelect={setToDate} initialFocus className="pointer-events-auto" />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              {/* Tags */}
              <div className="space-y-2">
                <Label>Tags</Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Add a tag to search..."
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), handleAddTag())}
                  />
                  <Button type="button" onClick={handleAddTag}>Add</Button>
                </div>
                {searchTags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {searchTags.map((tag) => (
                      <div
                        key={tag}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                      >
                        {tag}
                        <button onClick={() => handleRemoveTag(tag)} className="hover:text-primary/80">
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <Button onClick={handleSearch} disabled={loading} className="w-full">
                {loading ? "Searching..." : "Search Documents"}
              </Button>
            </CardContent>
          </Card>

          {/* Results */}
          {results.length > 0 && (
            <Card className="shadow-xl animate-slide-up">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-2xl">Search Results ({results.length})</CardTitle>
                <Button onClick={handleDownloadAll} variant="outline">
                  <Archive className="w-4 h-4 mr-2" />
                  Download All as ZIP
                </Button>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {results.map((doc) => (
                    <Card key={doc.document_id} className="hover:shadow-lg transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 space-y-2">
                            <h3 className="font-semibold text-lg">{doc.document_name}</h3>
                            <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
                              <span className="bg-muted px-2 py-1 rounded">{doc.major_head}</span>
                              <span className="bg-muted px-2 py-1 rounded">{doc.minor_head}</span>
                              <span className="bg-muted px-2 py-1 rounded">{doc.document_date}</span>
                            </div>
                            {doc.tags && doc.tags.length > 0 && (
                              <div className="flex flex-wrap gap-1">
                                {doc.tags.map((tag, idx) => (
                                  <span key={idx} className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            )}
                            {doc.document_remarks && (
                              <p className="text-sm text-muted-foreground">{doc.document_remarks}</p>
                            )}
                          </div>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handlePreview(doc.file_path)}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => handleDownload(doc.file_path, doc.document_name)}
                            >
                              <Download className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>

      {/* Preview Dialog */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-4xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>Document Preview</DialogTitle>
          </DialogHeader>
          <div className="flex items-center justify-center min-h-[400px]">
            {previewUrl.endsWith('.pdf') ? (
              <iframe src={previewUrl} className="w-full h-[600px] rounded" />
            ) : (
              <img src={previewUrl} alt="Document preview" className="max-w-full max-h-[600px] rounded" />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Search;
