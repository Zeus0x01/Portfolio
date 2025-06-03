import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock } from "lucide-react";
import type { Course } from "@shared/schema";

const levelColors = {
  beginner: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  intermediate: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
  advanced: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
};

export default function Courses() {
  const { data: courses = [], isLoading } = useQuery({
    queryKey: ['/api/courses'],
    queryFn: async () => {
      const response = await fetch('/api/courses');
      if (!response.ok) throw new Error('Failed to fetch courses');
      return response.json();
    },
  });

  const handleEnrollClick = (courseId: number) => {
    window.location.href = `/checkout/${courseId}`;
  };

  if (isLoading) {
    return (
      <section id="courses" className="py-20 bg-secondary/5">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 animate-slide-up">Learn & Grow</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto animate-slide-up">
              Master the art of graphic design with my comprehensive courses and tutorials.
            </p>
          </div>
          <div className="flex items-center justify-center">
            <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
          </div>
        </div>
      </section>
    );
  }

  // Hide section if no courses
  if (courses.length === 0) {
    return null;
  }

  return (
    <section id="courses" className="py-20 bg-secondary/5">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 animate-slide-up">Learn & Grow</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto animate-slide-up">
            Master the art of graphic design with my comprehensive courses and tutorials.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((course: Course, index: number) => (
            <Card 
              key={course.id} 
              className="group overflow-hidden hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:-translate-y-2 animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {course.thumbnail && (
                <div className="relative overflow-hidden">
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              )}
              
              <CardHeader>
                <div className="flex items-center justify-between mb-4">
                  <Badge className={levelColors[course.level as keyof typeof levelColors] || 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'}>
                    {course.level}
                  </Badge>
                  <span className="text-2xl font-bold text-primary transition-colors duration-300 group-hover:text-primary/80">
                    ${course.price}
                  </span>
                </div>
                
                <h3 className="text-xl font-semibold mb-3 transition-colors duration-300 group-hover:text-primary">
                  {course.title}
                </h3>
                <p className="text-muted-foreground mb-4 line-clamp-3">
                  {course.shortDescription || course.description}
                </p>
                
                {(course.duration || course.lessons) && (
                  <div className="flex items-center text-sm text-muted-foreground mb-4">
                    <Clock className="w-4 h-4 mr-2" />
                    <span>
                      {course.duration}
                      {course.lessons && ` • ${course.lessons} lessons`}
                    </span>
                  </div>
                )}
              </CardHeader>
              
              <CardContent>
                <Button 
                  className="w-full font-semibold transform transition-all duration-300 hover:scale-105 hover:shadow-lg"
                  onClick={() => handleEnrollClick(course.id)}
                >
                  Enroll Now
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
