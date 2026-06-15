import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  BookOpen, Award, CheckSquare, TrendingUp, ArrowUpRight,
  Clock, Play, Star, Target,
} from 'lucide-react';
import { Loader } from '@components/ui/loader';

const enrolledCourses = [
  { id: 1, title: 'SAT Mathematics Prep', progress: 72, nextLesson: 'Quadratic Equations', instructor: 'Mr. James', color: 'from-indigo-500 to-violet-500' },
  { id: 2, title: 'SAT English & Writing', progress: 55, nextLesson: 'Essay Structure', instructor: 'Ms. Grace', color: 'from-emerald-500 to-teal-500' },
  { id: 3, title: 'SAT Critical Reading', progress: 88, nextLesson: 'Passage Analysis', instructor: 'Dr. Ade', color: 'from-amber-500 to-orange-500' },
];

const upcomingExams = [
  { title: 'SAT Math Practice Test 3', date: '2026-06-18', duration: '45 min', course: 'SAT Mathematics' },
  { title: 'SAT English Mock Exam', date: '2026-06-22', duration: '60 min', course: 'SAT English' },
  { title: 'Full SAT Simulation', date: '2026-06-28', duration: '180 min', course: 'All Subjects' },
];

const myScores = [
  { exam: 'SAT Math Practice 1', score: 78, maxScore: 100, date: '2026-06-01' },
  { exam: 'SAT Math Practice 2', score: 85, maxScore: 100, date: '2026-06-08' },
  { exam: 'SAT English Test 1', score: 82, maxScore: 100, date: '2026-06-10' },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};
const item = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};

export function StudentDashboard() {
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

  const avgScore = Math.round(myScores.reduce((s, e) => s + e.score, 0) / myScores.length);
  const avgProgress = Math.round(enrolledCourses.reduce((s, c) => s + c.progress, 0) / enrolledCourses.length);

  return (
    <motion.div initial="hidden" animate="visible" variants={containerVariants} className="space-y-6">
      {/* Header */}
      <motion.div variants={item}>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Learning Dashboard</h1>
        <p className="text-sm text-gray-500 mt-0.5">Kurios SAT — track your progress and prepare for success</p>
      </motion.div>

      {/* Stats */}
      <motion.div variants={item} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Enrolled Courses', value: enrolledCourses.length.toString(), icon: BookOpen, color: 'text-indigo-600 bg-indigo-50', href: '/lms/my-enrollments' },
          { label: 'Avg Progress', value: `${avgProgress}%`, icon: TrendingUp, color: 'text-violet-600 bg-violet-50', href: '/lms/my-enrollments' },
          { label: 'Avg Score', value: `${avgScore}%`, icon: Star, color: 'text-amber-600 bg-amber-50', href: '/lms/exams' },
          { label: 'Certificates', value: '2', icon: Award, color: 'text-emerald-600 bg-emerald-50', href: '/lms/certificates' },
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
          <Link to="/lms/my-enrollments" className="text-xs text-indigo-600 hover:text-indigo-700 flex items-center gap-1">
            View all <ArrowUpRight className="w-3 h-3" />
          </Link>
        </div>
        <div className="space-y-4">
          {enrolledCourses.map((c) => (
            <Link key={c.id} to={`/lms/courses/${c.id}`}>
              <div className="group flex items-center gap-4 p-4 rounded-xl border border-gray-100 dark:border-gray-700 hover:shadow-sm transition">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${c.color} flex items-center justify-center flex-shrink-0`}>
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 dark:text-white group-hover:text-indigo-600 transition text-sm truncate">{c.title}</p>
                  <p className="text-xs text-gray-500 mt-0.5">Next: {c.nextLesson} • {c.instructor}</p>
                  <div className="mt-2">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-400">Progress</span>
                      <span className="font-medium text-gray-600 dark:text-gray-300">{c.progress}%</span>
                    </div>
                    <div className="h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className={`h-1.5 rounded-full bg-gradient-to-r ${c.color}`}
                        style={{ width: `${c.progress}%` }}
                      />
                    </div>
                  </div>
                </div>
                <button className="flex-shrink-0 p-2 bg-indigo-100 text-indigo-600 rounded-lg hover:bg-indigo-200 transition">
                  <Play className="w-4 h-4" />
                </button>
              </div>
            </Link>
          ))}
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Exams */}
        <motion.div variants={item} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <Target className="w-5 h-5 text-rose-500" />
              Upcoming Exams
            </h2>
            <Link to="/lms/exams" className="text-xs text-indigo-600 hover:text-indigo-700 flex items-center gap-1">
              View all <ArrowUpRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="space-y-3">
            {upcomingExams.map((e, i) => (
              <div key={i} className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{e.title}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{e.course}</p>
                  </div>
                  <div className="text-right flex-shrink-0 ml-2">
                    <p className="text-xs font-medium text-indigo-600">{e.date}</p>
                    <p className="text-xs text-gray-500 flex items-center gap-1 justify-end mt-0.5">
                      <Clock className="w-3 h-3" />{e.duration}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* My Scores */}
        <motion.div variants={item} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <CheckSquare className="w-5 h-5 text-emerald-500" />
              My Scores
            </h2>
          </div>
          <div className="space-y-3">
            {myScores.map((e, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{e.exam}</p>
                  <p className="text-xs text-gray-500">{e.date}</p>
                </div>
                <div className={`px-3 py-1 rounded-lg text-sm font-bold ${
                  e.score >= 90 ? 'bg-emerald-100 text-emerald-700' :
                  e.score >= 70 ? 'bg-amber-100 text-amber-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  {e.score}/{e.maxScore}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Overall Average</span>
              <span className={`text-lg font-bold ${avgScore >= 80 ? 'text-emerald-600' : 'text-amber-600'}`}>{avgScore}%</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Quick actions */}
      <motion.div variants={item} className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Continue Learning', href: '/lms/my-enrollments', icon: Play, color: 'text-indigo-600 bg-indigo-50' },
          { label: 'Take Exam', href: '/lms/exams', icon: CheckSquare, color: 'text-violet-600 bg-violet-50' },
          { label: 'My Certificates', href: '/lms/certificates', icon: Award, color: 'text-amber-600 bg-amber-50' },
          { label: 'Browse Courses', href: '/lms/courses', icon: BookOpen, color: 'text-emerald-600 bg-emerald-50' },
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

export default StudentDashboard;
