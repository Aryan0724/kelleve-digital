"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trash2, Edit } from "lucide-react";

export function CMSAdminPanel() {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    id: null as number | null,
    title: "",
    excerpt: "",
    content: "",
    category: "Tips",
    status: "published",
  });

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const res = await api.get("/blogs");
      setBlogs(res.data.data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!formData.title || !formData.content) return alert("Title and Content are required.");
    try {
      if (formData.id) {
        await api.put(`/admin/blogs/${formData.id}`, formData);
      } else {
        await api.post("/admin/blogs", formData);
      }
      setIsEditing(false);
      resetForm();
      fetchBlogs();
    } catch (e: any) {
      alert(e.response?.data?.message || "Failed to save blog post");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this post?")) return;
    try {
      await api.delete(`/admin/blogs/${id}`);
      fetchBlogs();
    } catch (e) {
      console.error("Failed to delete");
    }
  };

  const resetForm = () => {
    setFormData({ id: null, title: "", excerpt: "", content: "", category: "Tips", status: "published" });
  };

  if (loading && !blogs.length) return <div className="text-center p-8">Loading CMS...</div>;

  return (
    <div className="space-y-6">
      {isEditing ? (
        <Card>
          <CardHeader>
            <CardTitle>{formData.id ? "Edit Blog Post" : "Create New Blog Post"}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input 
              placeholder="Post Title" 
              value={formData.title} 
              onChange={(e) => setFormData({ ...formData, title: e.target.value })} 
            />
            <Textarea 
              placeholder="Short excerpt..." 
              value={formData.excerpt} 
              onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })} 
            />
            <div className="flex gap-4">
              <Select value={formData.category} onValueChange={(val) => setFormData({ ...formData, category: val || "" })}>
                <SelectTrigger className="w-[200px]"><SelectValue placeholder="Category" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Tips">Tips</SelectItem>
                  <SelectItem value="Trends">Trends</SelectItem>
                  <SelectItem value="Guide">Guide</SelectItem>
                  <SelectItem value="News">News</SelectItem>
                </SelectContent>
              </Select>
              <Select value={formData.status} onValueChange={(val) => setFormData({ ...formData, status: val || "" })}>
                <SelectTrigger className="w-[200px]"><SelectValue placeholder="Status" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Textarea 
              placeholder="Full content (Markdown or HTML supported in frontend)" 
              className="min-h-[300px]"
              value={formData.content} 
              onChange={(e) => setFormData({ ...formData, content: e.target.value })} 
            />
            <div className="flex gap-2">
              <Button onClick={handleSave}>Save Post</Button>
              <Button variant="outline" onClick={() => { setIsEditing(false); resetForm(); }}>Cancel</Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Content Management</CardTitle>
              <CardDescription>Manage blog posts and articles.</CardDescription>
            </div>
            <Button onClick={() => setIsEditing(true)}>Create Post</Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Published Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {blogs.map((blog) => (
                  <TableRow key={blog.id}>
                    <TableCell className="font-medium">{blog.title}</TableCell>
                    <TableCell>{blog.category}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded text-xs ${blog.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-gray-100'}`}>
                        {blog.status}
                      </span>
                    </TableCell>
                    <TableCell>{new Date(blog.published_at || blog.created_at).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" onClick={() => { setFormData(blog); setIsEditing(true); }}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(blog.id)}>
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {blogs.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-slate-500 py-6">
                      No blog posts found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
