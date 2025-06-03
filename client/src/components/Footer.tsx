export default function Footer() {
  return (
    <footer className="bg-slate-900 dark:bg-slate-950 text-slate-300 py-12">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center space-y-4">
          <div className="text-2xl font-bold">
            <span className="text-white">Creative</span>
            <span className="text-primary">Studio</span>
          </div>
          
          <p className="text-slate-400">Transforming ideas into visual masterpieces</p>
          
          <div className="flex justify-center space-x-6 pt-4">
            <a href="#" className="hover:text-primary transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-primary transition-colors">
              Terms of Service
            </a>
            <a href="#" className="hover:text-primary transition-colors">
              Support
            </a>
          </div>
          
          <div className="text-slate-500 text-sm pt-4">
            © 2024 Creative Studio. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}
