import { Badge } from "@/components/ui/badge";

export default function About() {
  const stats = [
    { value: "150+", label: "Projects Completed" },
    { value: "50+", label: "Happy Clients" },
    { value: "8", label: "Years Experience" },
    { value: "25+", label: "Awards Won" },
  ];

  const skills = [
    "Photoshop",
    "Illustrator", 
    "InDesign",
    "Figma",
    "After Effects",
    "Lightroom"
  ];

  const skillColors = [
    'bg-primary/10 text-primary',
    'bg-secondary/10 text-secondary',
    'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    'bg-primary/10 text-primary',
    'bg-secondary/10 text-secondary',
    'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  ];

  return (
    <section id="about" className="py-20 bg-background">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <img 
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600" 
              alt="Creative professional at work" 
              className="rounded-xl shadow-2xl w-full h-auto object-cover" 
            />
          </div>
          
          <div className="space-y-6">
            <h2 className="text-4xl md:text-5xl font-bold">About Me</h2>
            
            <p className="text-xl text-muted-foreground leading-relaxed">
              With over 8 years of experience in graphic design, I've had the privilege of working with brands across various industries, from startups to Fortune 500 companies.
            </p>
            
            <p className="text-lg text-muted-foreground leading-relaxed">
              My passion lies in transforming complex ideas into visually compelling stories that connect with audiences and drive results. I specialize in brand identity, digital campaigns, and photo retouching.
            </p>
            
            <div className="grid grid-cols-2 gap-6 pt-6">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl font-bold text-primary mb-2">{stat.value}</div>
                  <div className="text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>

            <div className="pt-6">
              <h3 className="text-xl font-semibold mb-4">Skills & Tools</h3>
              <div className="flex flex-wrap gap-3">
                {skills.map((skill, index) => (
                  <Badge key={skill} className={skillColors[index % skillColors.length]}>
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
