import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  BookOpen, Users, CheckSquare, Award, ArrowUpRight,
  Clock, Calendar, Star, Play, FileText,
} from 'lucide-react';
import { Loader } from '@components/ui/loader';

const myCourses = [
  { id: 1, title: 'SAT Mathematics Prep', students: 48, progress: 72, status: 'Ongoing', color: 'from-indigo-500 to-violet-500' },
  { id: 2, title: 'SAT English & Writing', students: 35, progress: 58, status: 'Ongoing', color: 'from-emerald-500 to-teal-500' },
  { id: 3, title: 'SAT Critical Reading', students: 29, progress: 90, status: 'Ongoing', color: 'from-amber-500 to-orange-500' },
  { id: 4, title: 'SAT Test Strategies', students: 52, progress: 40, status: 'Ongoing', color: 'from-rose-500 to-pink-500' },
];

const upcomingClasses = [
  { subject: 'SAT Mathematics Prep', time: '09:00 AM', duration: '90 min', students: 48, date: 'Today' },
  { subject: 'SAT English & Writing', time: '02:00 PM', duration: '60 min', students: 35, date: 'Today' },
  { subject: 'SAT Critical Reading', time: '10:00 AM', duration: '90 min', students: 29, date: 'Tomorrow' },
];

const recentSubmissions = [
  { student: 'Amara Okonkwo', course: 'SAT Math', score: 92, submitted: '2h ago' },
  { student: 'Liam Johnson', course: 'SAT English', score: 78, submitted: '4h ago' },
  { student: 'Fatima Al-Hassan', course: 'SAT Math', score: 88, submitted: '6h ago' },
  { student: 'Diego Martinez', course: 'SAT Critical Reading', score: 95, submitted: '1d ago' },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};
const item = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};

export function TeacherDashboard() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(t);
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <Loader size="lg" />
    </div>
  );

  const totalStudents = myCourses.reduce((s, c) => s + c.students, 0);

  return (
    <motion.div initial="hidden" animate="visible" variants={containerVariants} className="space-y-6">
      {/* Header */}
      <motion.div variants={item}>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Teacher Dashboard</h1>
        <p className="text-sm text-gray-500 mt-0.5">Kurios SAT — your courses and students</p>
      </motion.div>

      {/* Stats */}
      <motion.div variants={item} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'My Courses', value: myCourses.length.toString(), icon: BookOpen, color: 'text-indigo-600 bg-indigo-50', href: '/lms/courses' },
          { label: 'Total Students', value: totalStudents.toString(), icon: Users, color: 'text-violet-600 bg-violet-50', href: '/lms/enrollments' },
          { label: 'Pending Grading', value: '8', icon: CheckSquare, color: 'text-amber-600 bg-amber-50', href: '/lms/exams' },
          { label: 'Certificates Issued', value: '127', icon: Award, color: 'text-emerald-600 bg-emerald-50', href: '/lms/certificates' },
        ].map((s) => (
          <Link key={s.label} to={s.href}>
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-5 hover:shadow-md transition">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${s.color}`}>
                <s.icon className="w-5 h-5" />
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{s.value}</p>
              <p className="text-xs text-gray-500 mt-1">{s.label}</p>
            </div>
          </Link>
        ))}
      </motion.div>

      {/* My Courses */}
      <motion.div variants={item} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-indigo-500" />
            My Courses
          </h2>
          <Link to="/lms/courses" className="text-xs text-indigo-600 hover:text-indigo-700 flex items-center gap-1">
            All courses <ArrowUpRight className="w-3 h-3" />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {myCourses.map((c) => (
            <Link key={c.id} to={`/lms/courses/${c.id}`}>
              <div className="group relative overflow-hidden rounded-xl border border-gray-100 dark:border-gray-700 hover:shadow-md transition">
                <div className={`h-2 w-full bg-gradient-to-r ${c.color}`} />
                <div className="p-4">
                  <p className="font-medium text-gray-900 dark:text-white group-hover:text-indigo-600 transition text-sm">{c.title}</p>
                  <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                    <span className="flex items-center gap-1"><Users className="w-3 h-3" />{c.students} students</span>
                    <span className="flex items-center gap-1"><Play className="w-3 h-3" />{c.status}</span>
                  </div>
                  <div className="mt-3">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-500">Progress</span>
                      <span className="font-medium text-gray-700 dark:text-gray-300">{c.progress}%</span>
                    </div>
                    <div className="h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className={`h-1.5 rounded-full bg-gradient-to-r ${c.color}`}
                        style={{ width: `${c.progress}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Classes */}
        <motion.div variants={item} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6">
          <h2 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2 mb-5">
            <Calendar className="w-5 h-5 text-violet-500" />
            Upcoming Classes
          </h2>
          <div className="space-y-3">
            {upcomingClasses.map((c, i) => (
              <div key={i} className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                <div className="text-center flex-shrink-0">
                  <p className="text-xs font-bold text-indigo-600">{c.date}</p>
                  <p className="text-sm font-bold text-gray-900 dark:text-white">{c.time}</p>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{c.subject}</p>
                  <p className="text-xs text-gray-500">{c.duration} • {c.students} students</p>
                </div>
                <button className="flex-shrink-0 p-1.5 bg-indigo-100 text-indigo-600 rounded-lg hover:bg-indigo-200 transition">
                  <Play className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Recent Submissions */}
        <motion.div variants={item} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-emerald-500" />
              Recent Submissions
            </h2>
            <Link to="/lms/exams" className="text-xs text-indigo-600 hover:text-indigo-700 flex items-center gap-1">
              View all <ArrowUpRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="space-y-3">
            {recentSubmissions.map((s, i) => (
              <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-400 to-violet-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                  {s.student.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{s.student}</p>
                  <p className="text-xs text-gray-500">{s.course} • {s.submitted}</p>
                </div>
                <div className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-bold ${
                  s.score >= 90 ? 'bg-emerald-100 text-emerald-700' :
                  s.score >= 70 ? 'bg-amber-100 text-amber-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  <Star className="w-3 h-3" />{s.score}%
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Quick actions */}
      <motion.div variants={item} className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'My Courses', href: '/lms/courses', icon: BookOpen, color: 'text-indigo-600 bg-indigo-50' },
          { label: 'Exams & Quizzes', href: '/lms/exams', icon: CheckSquare, color: 'text-violet-600 bg-violet-50' },
          { label: 'Certificates', href: '/lms/certificates', icon: Award, color: 'text-amber-600 bg-amber-50' },
          { label: 'Schedule', href: '/attendance', icon: Clock, color: 'text-emerald-600 bg-emerald-50' },
        ].map((q) => (
          <Link key={q.href} to={q.href} className="flex flex-col items-center gap-2 p-4 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 hover:shadow-md transition">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${q.color}`}>
              <q.icon className="w-5 h-5" />
            </div>
            <span className="text-xs font-medium text-gray-700 dark:text-gray-300 text-center">{q.label}</span>
          </Link>
        ))}
      </motion.div>
    </motion.div>
  );
}

export default TeacherDashboard;
