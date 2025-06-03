import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { insertPortfolioItemSchema, insertCourseSchema } from "@shared/schema";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Edit, Trash2, Eye, Mail } from "lucide-react";
import type { PortfolioItem, Course, ContactSubmission } from "@shared/schema";

export default function AdminDashboard() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("portfolio");
  const [editingItem, setEditingItem] = useState<PortfolioItem | null>(null);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);

  // Fetch data
  const { data: portfolioItems = [] } = useQuery({
    queryKey: ['/api/portfolio'],
    queryFn: async () => {
      const response = await fetch('/api/portfolio');
      if (!response.ok) throw new Error('Failed to fetch portfolio items');
      return response.json();
    },
  });

  const { data: courses = [] } = useQuery({
    queryKey: ['/api/admin/courses'],
    queryFn: async () => {
      const response = await fetch('/api/admin/courses');
      if (!response.ok) throw new Error('Failed to fetch courses');
      return response.json();
    },
  });

  const { data: contacts = [] } = useQuery({
    queryKey: ['/api/admin/contacts'],
    queryFn: async () => {
      const response = await fetch('/api/admin/contacts');
      if (!response.ok) throw new Error('Failed to fetch contacts');
      return response.json();
    },
  });

  // Portfolio form
  const portfolioForm = useForm({
    resolver: zodResolver(insertPortfolioItemSchema),
    defaultValues: {
      title: "",
      description: "",
      category: "",
      beforeImage: "",
      afterImage: "",
      mainImage: "",
      tools: "",
      isBeforeAfter: false,
      featured: false,
    },
  });

  // Course form
  const courseForm = useForm({
    resolver: zodResolver(insertCourseSchema),
    defaultValues: {
      title: "",
      description: "",
      shortDescription: "",
      price: "0",
      level: "",
      duration: "",
      lessons: 0,
      thumbnail: "",
      videoPreview: "",
      curriculum: null,
      downloadableFiles: null,
      featured: false,
      published: true,
    },
  });

  // Mutations
  const createPortfolioItem = useMutation({
    mutationFn: async (data: any) => {
      return await apiRequest("POST", "/api/portfolio", data);
    },
    onSuccess: () => {
      toast({ title: "Portfolio item created successfully!" });
      portfolioForm.reset();
      queryClient.invalidateQueries({ queryKey: ['/api/portfolio'] });
    },
    onError: () => {
      toast({ title: "Error creating portfolio item", variant: "destructive" });
    },
  });

  const updatePortfolioItem = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: any }) => {
      return await apiRequest("PUT", `/api/portfolio/${id}`, data);
    },
    onSuccess: () => {
      toast({ title: "Portfolio item updated successfully!" });
      setEditingItem(null);
      portfolioForm.reset();
      queryClient.invalidateQueries({ queryKey: ['/api/portfolio'] });
    },
    onError: () => {
      toast({ title: "Error updating portfolio item", variant: "destructive" });
    },
  });

  const deletePortfolioItem = useMutation({
    mutationFn: async (id: number) => {
      return await apiRequest("DELETE", `/api/portfolio/${id}`);
    },
    onSuccess: () => {
      toast({ title: "Portfolio item deleted successfully!" });
      queryClient.invalidateQueries({ queryKey: ['/api/portfolio'] });
    },
    onError: () => {
      toast({ title: "Error deleting portfolio item", variant: "destructive" });
    },
  });

  const createCourse = useMutation({
    mutationFn: async (data: any) => {
      return await apiRequest("POST", "/api/courses", data);
    },
    onSuccess: () => {
      toast({ title: "Course created successfully!" });
      courseForm.reset();
      queryClient.invalidateQueries({ queryKey: ['/api/admin/courses'] });
    },
    onError: () => {
      toast({ title: "Error creating course", variant: "destructive" });
    },
  });

  const updateCourse = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: any }) => {
      return await apiRequest("PUT", `/api/courses/${id}`, data);
    },
    onSuccess: () => {
      toast({ title: "Course updated successfully!" });
      setEditingCourse(null);
      courseForm.reset();
      queryClient.invalidateQueries({ queryKey: ['/api/admin/courses'] });
    },
    onError: () => {
      toast({ title: "Error updating course", variant: "destructive" });
    },
  });

  const deleteCourse = useMutation({
    mutationFn: async (id: number) => {
      return await apiRequest("DELETE", `/api/courses/${id}`);
    },
    onSuccess: () => {
      toast({ title: "Course deleted successfully!" });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/courses'] });
    },
    onError: () => {
      toast({ title: "Error deleting course", variant: "destructive" });
    },
  });

  const markContactResponded = useMutation({
    mutationFn: async (id: number) => {
      return await apiRequest("PUT", `/api/admin/contacts/${id}/respond`);
    },
    onSuccess: () => {
      toast({ title: "Contact marked as responded!" });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/contacts'] });
    },
    onError: () => {
      toast({ title: "Error updating contact", variant: "destructive" });
    },
  });

  // Form handlers
  const onPortfolioSubmit = (data: any) => {
    if (editingItem) {
      updatePortfolioItem.mutate({ id: editingItem.id, data });
    } else {
      createPortfolioItem.mutate(data);
    }
  };

  const onCourseSubmit = (data: any) => {
    if (editingCourse) {
      updateCourse.mutate({ id: editingCourse.id, data });
    } else {
      createCourse.mutate(data);
    }
  };

  const handleEditPortfolio = (item: PortfolioItem) => {
    setEditingItem(item);
    portfolioForm.reset({
      title: item.title,
      description: item.description || "",
      category: item.category,
      beforeImage: item.beforeImage || "",
      afterImage: item.afterImage || "",
      mainImage: item.mainImage,
      tools: item.tools || "",
      isBeforeAfter: item.isBeforeAfter || false,
      featured: item.featured || false,
    });
  };

  const handleEditCourse = (course: Course) => {
    setEditingCourse(course);
    courseForm.reset({
      title: course.title,
      description: course.description,
      shortDescription: course.shortDescription || "",
      price: course.price,
      level: course.level,
      duration: course.duration || "",
      lessons: course.lessons || 0,
      thumbnail: course.thumbnail || "",
      videoPreview: course.videoPreview || "",
      curriculum: course.curriculum,
      downloadableFiles: course.downloadableFiles,
      featured: course.featured || false,
      published: course.published || true,
    });
  };

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-muted-foreground">Manage your portfolio, courses, and contact submissions</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
          <TabsTrigger value="courses">Courses</TabsTrigger>
          <TabsTrigger value="contacts">Contacts</TabsTrigger>
        </TabsList>

        <TabsContent value="portfolio" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{editingItem ? "Edit Portfolio Item" : "Add New Portfolio Item"}</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...portfolioForm}>
                <form onSubmit={portfolioForm.handleSubmit(onPortfolioSubmit)} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={portfolioForm.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Title</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={portfolioForm.control}
                      name="category"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Category</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="ads">Advertisement</SelectItem>
                              <SelectItem value="portraits">Portraits</SelectItem>
                              <SelectItem value="products">Products</SelectItem>
                              <SelectItem value="branding">Branding</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={portfolioForm.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={portfolioForm.control}
                    name="mainImage"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Main Image URL</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex items-center space-x-4">
                    <FormField
                      control={portfolioForm.control}
                      name="isBeforeAfter"
                      render={({ field }) => (
                        <FormItem className="flex items-center space-x-2">
                          <FormLabel>Before/After Comparison</FormLabel>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={portfolioForm.control}
                      name="featured"
                      render={({ field }) => (
                        <FormItem className="flex items-center space-x-2">
                          <FormLabel>Featured</FormLabel>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>

                  {portfolioForm.watch("isBeforeAfter") && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={portfolioForm.control}
                        name="beforeImage"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Before Image URL</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={portfolioForm.control}
                        name="afterImage"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>After Image URL</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  )}

                  <FormField
                    control={portfolioForm.control}
                    name="tools"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tools Used</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="e.g., Photoshop, Illustrator" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex space-x-2">
                    <Button type="submit" disabled={createPortfolioItem.isPending || updatePortfolioItem.isPending}>
                      {editingItem ? "Update" : "Create"} Portfolio Item
                    </Button>
                    {editingItem && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setEditingItem(null);
                          portfolioForm.reset();
                        }}
                      >
                        Cancel
                      </Button>
                    )}
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Portfolio Items</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Featured</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {portfolioItems.map((item: PortfolioItem) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.title}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{item.category}</Badge>
                      </TableCell>
                      <TableCell>{item.isBeforeAfter ? "Before/After" : "Standard"}</TableCell>
                      <TableCell>{item.featured ? "Yes" : "No"}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEditPortfolio(item)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => deletePortfolioItem.mutate(item.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="courses" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{editingCourse ? "Edit Course" : "Add New Course"}</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...courseForm}>
                <form onSubmit={courseForm.handleSubmit(onCourseSubmit)} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={courseForm.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Title</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={courseForm.control}
                      name="price"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Price</FormLabel>
                          <FormControl>
                            <Input type="number" step="0.01" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField
                      control={courseForm.control}
                      name="level"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Level</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="beginner">Beginner</SelectItem>
                              <SelectItem value="intermediate">Intermediate</SelectItem>
                              <SelectItem value="advanced">Advanced</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={courseForm.control}
                      name="duration"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Duration</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="e.g., 8 hours" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={courseForm.control}
                      name="lessons"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Number of Lessons</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              {...field} 
                              onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={courseForm.control}
                    name="shortDescription"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Short Description</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={courseForm.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Description</FormLabel>
                        <FormControl>
                          <Textarea {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={courseForm.control}
                    name="thumbnail"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Thumbnail URL</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex items-center space-x-4">
                    <FormField
                      control={courseForm.control}
                      name="featured"
                      render={({ field }) => (
                        <FormItem className="flex items-center space-x-2">
                          <FormLabel>Featured</FormLabel>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={courseForm.control}
                      name="published"
                      render={({ field }) => (
                        <FormItem className="flex items-center space-x-2">
                          <FormLabel>Published</FormLabel>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="flex space-x-2">
                    <Button type="submit" disabled={createCourse.isPending || updateCourse.isPending}>
                      {editingCourse ? "Update" : "Create"} Course
                    </Button>
                    {editingCourse && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setEditingCourse(null);
                          courseForm.reset();
                        }}
                      >
                        Cancel
                      </Button>
                    )}
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Courses</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Level</TableHead>
                    <TableHead>Published</TableHead>
                    <TableHead>Featured</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {courses.map((course: Course) => (
                    <TableRow key={course.id}>
                      <TableCell className="font-medium">{course.title}</TableCell>
                      <TableCell>${course.price}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{course.level}</Badge>
                      </TableCell>
                      <TableCell>{course.published ? "Yes" : "No"}</TableCell>
                      <TableCell>{course.featured ? "Yes" : "No"}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEditCourse(course)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => deleteCourse.mutate(course.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contacts" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Contact Submissions</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Project Type</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {contacts.map((contact: ContactSubmission) => (
                    <TableRow key={contact.id}>
                      <TableCell className="font-medium">
                        {contact.firstName} {contact.lastName}
                      </TableCell>
                      <TableCell>{contact.email}</TableCell>
                      <TableCell>{contact.projectType || "N/A"}</TableCell>
                      <TableCell>
                        {new Date(contact.submittedAt!).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Badge variant={contact.responded ? "default" : "secondary"}>
                          {contact.responded ? "Responded" : "Pending"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          {!contact.responded && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => markContactResponded.mutate(contact.id)}
                            >
                              <Mail className="w-4 h-4 mr-1" />
                              Mark Responded
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
