import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/hooks/useAuth";
import { BookOpen, Calendar, Award, Download } from "lucide-react";
import type { Course, CourseEnrollment, User } from "@shared/schema";

export default function UserProfile() {
  const { user, isAuthenticated } = useAuth();

  const { data: enrollments = [], isLoading } = useQuery({
    queryKey: ['/api/my-courses'],
    enabled: isAuthenticated,
    queryFn: async () => {
      const response = await fetch('/api/my-courses');
      if (!response.ok) throw new Error('Failed to fetch enrollments');
      return response.json();
    },
  });

  const { data: allCourses = [] } = useQuery({
    queryKey: ['/api/courses'],
    queryFn: async () => {
      const response = await fetch('/api/courses');
      if (!response.ok) throw new Error('Failed to fetch courses');
      return response.json();
    },
  });

  if (!isAuthenticated || !user) {
    return null;
  }

  const typedUser = user as User;

  const enrolledCourses = allCourses.filter((course: Course) =>
    enrollments.some((enrollment: CourseEnrollment) => enrollment.courseId === course.id)
  );

  if (isLoading) {
    return (
      <section className="py-20 bg-secondary/5">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="profile" className="py-20 bg-secondary/5">
      <div className="max-w-6xl mx-auto px-6">
        <div className="mb-16">
          <Card className="overflow-hidden">
            <div className="h-32 bg-gradient-to-r from-primary to-primary/60"></div>
            <CardContent className="relative pt-0 pb-8">
              <div className="flex flex-col md:flex-row items-start md:items-end gap-6 -mt-16">
                <Avatar className="w-32 h-32 border-4 border-background shadow-xl">
                  <AvatarImage src={typedUser.profileImageUrl || ""} alt={typedUser.firstName || ""} />
                  <AvatarFallback className="text-2xl font-bold">
                    {typedUser.firstName?.[0]?.toUpperCase() || typedUser.email?.[0]?.toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1 space-y-2">
                  <h2 className="text-3xl font-bold">
                    {typedUser.firstName} {typedUser.lastName}
                  </h2>
                  <p className="text-muted-foreground">{typedUser.email}</p>
                  <div className="flex items-center gap-4 pt-2">
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-primary" />
                      <span className="text-sm">{enrolledCourses.length} Courses Enrolled</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-primary" />
                      <span className="text-sm">
                        Member since {new Date(typedUser.createdAt!).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {enrolledCourses.length > 0 && (
          <div>
            <h3 className="text-2xl font-bold mb-8">My Courses</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {enrolledCourses.map((course: Course) => {
                const enrollment = enrollments.find((e: CourseEnrollment) => e.courseId === course.id);
                const progress = Math.floor(Math.random() * 100); // This would come from actual progress tracking
                
                return (
                  <Card key={course.id} className="overflow-hidden hover:shadow-lg transition-all duration-300">
                    {course.thumbnail && (
                      <img
                        src={course.thumbnail}
                        alt={course.title}
                        className="w-full h-48 object-cover"
                      />
                    )}
                    
                    <CardHeader>
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant="secondary">{course.level}</Badge>
                        {enrollment?.completedAt && (
                          <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                            <Award className="w-3 h-3 mr-1" />
                            Completed
                          </Badge>
                        )}
                      </div>
                      <CardTitle className="text-lg">{course.title}</CardTitle>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {course.shortDescription || course.description}
                      </p>
                    </CardHeader>
                    
                    <CardContent className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span>Progress</span>
                          <span>{progress}%</span>
                        </div>
                        <Progress value={progress} className="h-2" />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <p className="text-xs text-muted-foreground">
                          Enrolled: {new Date(enrollment?.enrolledAt!).toLocaleDateString()}
                        </p>
                        <Button size="sm" variant="outline">
                          <Download className="w-4 h-4 mr-2" />
                          Materials
                        </Button>
                      </div>
                      
                      <Button className="w-full">
                        {enrollment?.completedAt ? "Review Course" : "Continue Learning"}
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}